const hljs = require('highlight.js') // https://highlightjs.org/static/demo/ 各种不同风格的颜色可以这里查看
//为了节省空间，这里不引用highlight.js的css了，而是放到index.html中，引入cdn地址

// markdown-it 插件
const emoji = require('markdown-it-emoji')
const toc = require('markdown-it-table-of-contents')
const katex = require('@iktakahiro/markdown-it-katex')

// 自定义块
const containers = require('./containers')

const md = require('markdown-it')({
  html: true,
  // 代码高亮
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
      return '<pre class="hljs"><code>' +
        hljs.highlight(lang, str, true).value +
        '</code></pre>'
      } catch (__) {}
    }

    return '<pre v-pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})
// 使用 emoji 插件渲染 emoji
.use(emoji)
// 使用 table-of-contents 插件实现自动生成目录
.use(toc, {
  includeLevel: [2, 3]
})
// 定义自定义的块容器
.use(containers)
.use(katex, {"throwOnError" : false, "errorColor" : " #cc0000"}) // 样式在index.html中统一引入

function Render( content ) {
  return md.render(content)
}

module.exports = {
  Render
}
