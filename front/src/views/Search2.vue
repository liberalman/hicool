<template lang="html">
  <div>
    <header>
      <vNav></vNav>
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in mylist" :key="item">
          <div style="text-align: center">
            <img v-bind:src="item.cover" class="img-responsive" alt="响应式图像" />
          </div>
          <div class="text-wrap">
            <el-form style="margin-top: 10em;">
              <el-form-item>
                <el-input placeholder="请输入内容" v-model="key" class="input-with-select">
                  <el-select v-model="scope" slot="prepend" placeholder="请选择">
                    <el-option v-for="item in scope_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                  <el-button slot="append" icon="el-icon-search" @click="onSubmit"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item>
              <p>
                大约有 {{count}} 项符合查询结果。（搜索耗时：{{search_cost}} 秒） 
              </p>
              <p>(C)opyright 2016 - Hicool search - 页面处理总时间：{{total_cost}} 秒
                </p>
              </el-form-item>
            </el-form>
          </div>
        </el-carousel-item>
      </el-carousel>
    </header>
    <ul class="main-wrapper" style="background-color:white;">
      <li v-for="item in list" class="main-item">
        <router-link :to="{name: 'article', params: {id: item.id}}" class="item" target="_blank">
          <section class="list-title" v-text="item.title"></section>
        </router-link>
        <section class="list-abstract">
          <div v-if="item.text">
            <p v-html="item.text"></p>
            <router-link :to="{name: 'article', params: {id: item.id}}">»</router-link>
          </div>
        </section>
        <section class="list-info">
          <section class="list-author"><i class="el-icon-view"></i> {{item.percent}}</section>
          <section class="list-created"><i class="el-icon-star-off"></i> {{item.rank}}</section>
        </section>
      </li>
    </ul>

    <el-pagination style="text-align: center;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
    </el-pagination>

  </div>
</template>

<script>  
  export default {
    name: 'Search',
    components: {
      'vNav': () => import('./components/Nav.vue'),
    },
    data() {
      return {
        headline: 'Hicool Search', // 用户名
        subline: 'The thought of independence and freedom.', // 副标题
        imgSrc: 'http://image.hicool.top/static/album/5ac0a4bac0979028323030f3/1503759063328965200.jpg', // 头图 http://of30nsqpd.bkt.clouddn.com/2015061101335924.jpeg
        mylist: [{cover: 'http://image.hicool.top/static/album/5ac0a4bac0979028323030f3/1503759063328965200.jpg'}],
        
        value: '',
        suggestionAttribute: 'original_title',
        suggestions: [],
        selectedEvent: "",

        sort: 1,
        sort_options: [{
          value: 1,
          label: '相关性'
        }],
        scope: 1,
        scope_options: [{
          value: 1,
          label: '全文'
        }, {
          value: 2,
          label: 'Title'
        }],
        checkList:['模糊搜索','同义词'],
        key: '万向节',
        search_cost: 0.0000,
        list: [],
        count: 0,
        total_cost: 0.0000,
        page: 1,
        size: 10,
      }
    },
    computed: Vuex.mapState({
      
    }),
    created() {
      
    },
    methods: {
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.size = val
        this.onSubmit()
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.page = val
        this.onSubmit()
      },
      onSubmit() {
        let _this = this
        axios.get(`https://www.hicool.top/search/json?query=${this.key}&page=${this.page}&size=${this.size}`)
          .then(function (response) {
            _this.list = response.data.docs
            _this.count = response.data.total
          })
          .catch(function (error) {
            console.log(error);
            alert(error);
          })
      },
    },
    watch: {
      key () {
        this.onSubmit()
      }
    },
  }
</script>

<style lang="scss">
@import '../assets/scss/components/header.scss';
@import '../assets/scss/index.scss';
</style>
<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
