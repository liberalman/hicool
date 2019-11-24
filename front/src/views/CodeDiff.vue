<template lang="html">
  <div>
    <header class="a-header" :style="{background: 'url(http://image.hicool.top/static/album/5ac0a43f7c0636267ed49b91/1503658700339782278.jpg)' + 'center center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
      <div class="text-wrap">
        <h3 class="shadow">Code Diff</h3>
        <p class="shadow-light">yeah!</p>
      </div>
    </header>
    <div style="margin: 2em auto;">
      <div id="view"></div>
    </div>
    <CopyRight />
  </div>
</template>

<script>
  import router from '../router'
  import CodeMirror from 'codemirror'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/addon/merge/merge.js'
  import 'codemirror/addon/merge/merge.css'
  import DiffMatchPatch from 'diff-match-patch'
  window.diff_match_patch = DiffMatchPatch
  window.DIFF_DELETE = -1
  window.DIFF_INSERT = 1
  window.DIFF_EQUAL = 0

  export default {
    props: ['headline', 'subline', 'mySrc'],
    components: {
      'CopyRight': () =>
        import('./components/CopyRight.vue'),
      'vNav': () =>
        import('./components/Nav.vue'),
    },
    data(){
      return {
        left: '1',
        right: '1',
      }
    },
    mounted() {
      this.initUI(this.left, this.right)
    },
    // 定义对比方法
    methods: {
      initUI(value, orig2) {
        if (value == null) return;
        let target = document.getElementById("view");
        target.innerHTML = "";
        CodeMirror.MergeView(target, {
          value: value, //上次内容
          origLeft: null,
          orig: orig2, //本次内容
          lineNumbers: true, //显示行号
          mode: "text/html",
          highlightDifferences: true,
          connect: 'align',
          readOnly: false, //只读 不可修改
        });
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/scss/article.scss';
  @import '../assets/scss/components/header.scss';
</style>
