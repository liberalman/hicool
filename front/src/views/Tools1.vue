<template>
  <div>
    <header :style="{'min-height': '5em',background: 'url(http://image.hicool.top/static/album/5ac0a43f7c0636267ed49b91/1503658700339782278.jpg) center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
    </header>

    <div>
      <span>format sql</span>
      <el-input type="textarea" v-model="content" rows="30" />
      <el-button @click="format">Go</el-button>
    </div>

    </br>

    <div>
      <span>clean table style</span>
      <el-input type="textarea" v-model="content2" rows="30" />
      <el-button @click="clean_table_style">Go</el-button>
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
      content: 'DELETE FROM table1 WHERE NOT EXISTS ( SELECT * FROM table2 WHERE table1.field1 = table2.field1 );',
      content2: ''
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
    },
    clean_table_style() {
      var str = this.content2
      str=str.replace(/<\/?(html|head|title|meta|body)\b[^>]*>/ig,"");
      str=str.replace(/<table[^>]*>/ig,"<table>");
      str=str.replace(/(<tr[^>]*>)/ig, function (a, b) {
        if(a.indexOf('rowspan')>-1){
          a=a.replace(/([a-z]+)="([^"]+)?"/ig,function(c,d,e){
            return d === 'rowspan' ? (d + '="' + e + '"') : '';
          })
          return a;
        }else{
          return '<tr>';
        }
      });
      str=str.replace(/(<td[^>]*>)/ig, function (a, b) {
        if(a.indexOf('colspan')>-1){
          a=a.replace(/([a-z]+)="([^"]+)?"/ig,function(c,d,e){
            return d === 'colspan' ? (d + '="' + e + '"') : '';
          })
          return a;
        }else{
          return '<td>';
        }
      });
      this.content2 = str
      console.log(str)
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss">
  @import '../assets/scss/components/header.scss';
</style>
