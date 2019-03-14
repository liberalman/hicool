# -*- coding: utf-8 -*-

import json
import zlib
from urllib import parse,request
import urllib
import requests

BASE_URL = 'https://api.hicool.top:6011/api/v1/front'
HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',
  'Content-Type': 'application/json;charset=UTF-8',
  'Authorization': 'Bearer XXXXXXXXXXXXx'
}

def GET(path, params):
  textmod = ''
  if not params is None :
    textmod = parse.urlencode(params)
  #输出内容:page=1&size=2&...
  header_dict = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',
    'Content-Type': 'application/json;charset=UTF-8'
  }
  req = request.Request(url='%s%s%s' % (path,'?',textmod),headers=header_dict)
  rsp = request.urlopen(req)
  #print(response.headers)
  #print(response.headers.get('Content-Encoding'))
  if not rsp.headers.get('Content-Encoding') is None and 'gzip' in rsp.headers.get('Content-Encoding'):
    rsp = zlib.decompress(rsp.read(), 16 + zlib.MAX_WBITS)
  else:
    rsp = rsp.read()
  #print(response)
  #输出内容(python3默认获取到的是16进制'bytes'类型数据 Unicode编码，如果如需可读输出则需decode解码成对应编码):b'\xe7\x99\xbb\xe5\xbd\x95\xe6\x88\x90\xe5\x8a\x9f'
  #print(response.decode(encoding='utf-8'))
  #输出内容:
  return rsp.decode(encoding='utf-8')

def POST(path, params):
  f = urllib.request.urlopen(
    url = path,
    data = urllib.urlencode(params)
  )
  return f.read()

def PUT(path, params):
  request = requests.put(path, json=params, headers=HEADERS)
  return request.content.decode(encoding='utf-8')


if __name__=="__main__":
  # get article list
  page = 56
  size = 10
  total = 0
  while 1 :
    json_str = GET(BASE_URL + '/articles', {'page':page,'size':size,'sort_name':'updated','sort_order':'false'})
    json_dict = json.loads(json_str)
    total = json_dict.get('total')
    print('total:', total, 'current:', page)
    linenum = len(json_dict.get('list'))
    list = json_dict.get('list')

    for i in range(linenum):
      needUpdate = False
      # get article
      print('deal:', list[i].get('_id'))
      #print(list[i])
      json_str = GET(BASE_URL + '/article/' + list[i].get('_id'), None)
      #print(json_str)
      json_dict = json.loads(json_str)

      # replace web site
      params = {}

      content = json_dict.get('content')
      index = content.find('o9gqjr7iy.bkt.clouddn.com')
      if index >= 0 :
        content = content.replace('o9gqjr7iy.bkt.clouddn.com', 'image.hicool.top')
        needUpdate = True
        params['content'] = content

      cover = ''
      if 'cover' in list[i]:
        index = cover.find('o9gqjr7iy.bkt.clouddn.com')
        if index >= 0 :
          cover = cover.replace('o9gqjr7iy.bkt.clouddn.com', 'image.hicool.top')
          needUpdate = True
          params['cover'] = cover

      # update article
      if True == needUpdate :
        json_str = PUT(BASE_URL + '/article/' + list[i].get('_id'), params)
        print(json_str)

    page += 1
    if (page - 1) * size > total :
      break


