在当前用户目录下新建目录 data/mongo/db, data/redis/data, data/nginx/conf.d, 同时在conf.d目录下配置一下新建文件libertyblog-api.conf, 内容如下
```
mkdir -p ~/data/mongo/db
mkdir -p ~/data/redis/data
mkdir -p ~/data/nginx/conf.d
cd ~/data/nginx/conf.d
```
然后新建nginx配置文件，nginx.conf
```
upstream libertyblog-api-koa {
    server libertyblog-api-koa容器IP:9000;
}

server {
    listen 443 ssl;
    server_name api.hicool.top;

    ssl_certificate /etc/nginx/conf.d/ca.crt;
    ssl_certificate_key /etc/nginx/conf.d/ca.key;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://libertyblog-api-koa;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_read_timeout 900s;
    }
}

server {
    listen 80;
    server_name api.hicool.top;
    return 301 https://$server_name$request_uri;
}
```
由于api服务器地址使用了https, 所以不启动nginx并配置证书还没法演示. 所以在conf.d目录下再生成证书文件, 命令如下:
```
openssl genrsa -out ca.key 2048
# 下面这个命令随便填一些国家公司名称就可以了
openssl req -new -key ca.key -out ca.csr
openssl x509 -req -days 365 -in ca.csr -signkey ca.key -out ca.crt
```
当然使用自签名的证书在浏览器访问是有问题的, 手动允许就可以了.
同是修改一下hosts文件, 将api.hicool.top转到本机, 否则数据将从线上的libertyblog服务器获取
```
127.0.0.1    api.hicool.top
```
接下来启动所有容器.
```
docker-compose up -d
```
容器启动后可以查看libertyblog-api-koa容器id
```
docker ps|grep libertyblog-api-koa|awk '{print $1}'
```
根据上一步得到的容器id，这里用变量$CONTAINER_ID代替，查询容器内IP
```
docker inspect --format='{{.NetworkSettings.IPAddress}}' $CONTAINER_ID
```
一般得到的ip，如 172.17.0.6 这样的私有ip。然后修改nginx.conf配置文件，将"libertyblog-api-koa容器IP"替换容器内IP地址，重启nginx容器
```
docker restart nginxcontainerID
```
输入localhost+相应端口号就可访问了, 以上仅为演示, 实际生产环境当然不能这样部署, nginx和数据库容器要独立出来, 并设置密码验证.如mongodb需要加上
```
  command:
  - mongod
  - --auth
```
redis可使用独立的配置文件,并加上密码
```
  volumes:
  - /opt/redis/data:/data
  - /opt/redis/config:/usr/local/etc/redis
```
libertyblog-api-koa容器中INITDATA环境变量为开启初始化数据, 当数据库设置了密码时, 可使用相应的环境变量传入进去.
docker确实是个好东西, 上面如果用rancher部署, 那自然更简单了.

