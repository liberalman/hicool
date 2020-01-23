<template>
  <div>
    <header :style="{'min-height': '5em',background: 'url(http://image.hicool.top/static/album/5ac0a43f7c0636267ed49b91/1503658700339782278.jpg) center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
    </header>

    <div>
      <el-input type="textarea" v-model="content" cols="30" />
      <el-button @click="format">Go</el-button>
    </div>

    <CopyRight />
  </div>
</template>

<script>
import sqlFormatter from "sql-formatter"
export default {
  name: "Excel",
  data() {
    return {
      content: 'DELETE FROM table1 WHERE NOT EXISTS ( SELECT * FROM table2 WHERE table1.field1 = table2.field1 );'
    };
  },
  components: {
    'vNav': () =>
    import('./components/Nav'),
    'CopyRight': () =>
      import('./components/CopyRight.vue'),
  },
  methods: {
    /*代码格式化*/
    format() {
     /*将sql内容进行格式后放入编辑器中*/
     this.content = sqlFormatter.format(this.content);
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss">
  @import '../assets/scss/components/header.scss';
</style>
