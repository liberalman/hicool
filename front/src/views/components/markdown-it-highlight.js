import hljs from 'highlight.js'
import yaml from 'highlight.js/lib/languages/yaml.js'
import go from 'highlight.js/lib/languages/go.js'
import 'highlight.js/styles/github.css'

hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('go', go);

export default (md) => {                                                                                              
  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    if (token.info.length > 0) {
      const code = token.content.trim()
      try {
        return `<pre><code class="hljs">${hljs.highlightAuto(code, [token.info]).value}</code></pre>`
      } catch (e) { // JSON.parse exception
        return `<pre>some error:${e}</pre>`
      }
    }
    return temp(tokens, idx, options, env, slf)
  }
}
