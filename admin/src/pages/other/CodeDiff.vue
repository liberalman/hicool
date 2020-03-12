<template lang="html">
  <div>
    <div style="margin: 2em auto;">
      <div id="view"></div>
      <br/>
      <a-input
        type="textarea"
        :rows="5"
        placeholder="请输入Left内容"
        v-model="left">
      </a-input>
      <br/>
      <a-input
        type="textarea"
        :rows="5"
        placeholder="请输入Right内容"
        v-model="right">
      </a-input>
      <br/>
      <button plain @click="diff">Go</button>
    </div>
  </div>
</template>

<script>
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
    components: {
    },
    data(){
      return {
        left: '',
        right: '',
      }
    },
    mounted() {
      this.initUI(this.left, this.right)
    },
    // 定义对比方法
    methods: {
      diff() {
        this.initUI(this.left, this.right)
      },
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
          readOnly: true,
        });
      }
    }
  }
</script>
