<template lang="html">
  <div>
    <header>
      <vNav></vNav>
      <div class="img-wrap">
        <img :src="imgSrc" />
      </div>
      <div class="text-wrap">
        <h1 class="shaddow">{{headline}}</h1>
        <p class="shadow-light">{{subline}}</p>
        <div style="margin: 2em;"></div>
        <el-form>
          <el-form-item>
            <el-input placeholder="请输入内容" v-model="key" class="input-with-select">
              <el-select v-model="scope" slot="prepend" placeholder="请选择">
                <el-option v-for="item in scope_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="onSubmit"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="模糊搜索"></el-checkbox>
              <el-checkbox label="同义"></el-checkbox>
            </el-checkbox-group>
            </el-col>
            <el-col :span="12">
            按
            <el-select v-model="sort" size="mini">
              <el-option v-for="item in sort_options" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
            排序
            </el-col>
          </el-form-item>
          <el-form-item>
          <p>
            大约有 {{count}} 项符合查询结果。（搜索耗时：{{search_cost}} 秒）
          </p>
          <p>(C)opyright 2016 - Hicool search - 页面处理总时间：{{total_cost}} 秒<br>
            Powered by <a href="https://www.hicool.top/" target="_blank" title="Hicool 博客">hicool</a></p>
          </el-form-item>
        </el-form>
      </div>
    </header>

    <ul class="main-wrapper" id="content">
      <li v-for="item in list" :key="item._id" class="main-item">
        <router-link :to="{name: 'article', params: {id: item._id}}" target="_blank" class="item">
          <section class="list-title" v-text="item.title"></section>
        </router-link>

        <section class="list-abstract">
          <div v-if="item.images[0]">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="2" style="text-align:center">
                <el-carousel :interval="4000" height="8em" indicator-position="none">
                  <el-carousel-item v-for="images in item.images" :key="images.url">
                    <img v-bind:src="images.url" class="img-responsive" alt="photo" />
                  </el-carousel-item>
                </el-carousel>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="22">
              <div v-if="item.description">
                {{item.description}}
                <router-link :to="{name: 'article', params: {id: item._id}}">»</router-link>
              </div>
            </el-col>
          </el-row>
          </div>
          <div v-else>
            <div v-if="item.description">
              {{item.description}}
              <router-link :to="{name: 'article', params: {id: item._id}}">»</router-link>
            </div>
          </div>
        </section>

        <section class="list-info">
          <section class="list-author">
            <el-tooltip class="item" effect="dark" :content="item.author_id.nickname" placement="top-start">
              <avatar :username="item.author_id.nickname" :src="item.author_id.avatar" :size="20"></avatar>
            </el-tooltip>
          </section>
          <section class="list-author" v-text="item.author_id.nickname"></section>
          <section class="list-created">{{item.publish_time | handleDateFormat}}</section>
          <section class="list-created"><i class="el-icon-view"></i> {{item.visit_count}}</section>
          <section class="list-created"><i class="el-icon-star-off"></i> {{item.like_count}}</section>
          <section class="list-created" v-if="item.tags[0]">{{item.tags[0].name}}</section>
        </section>
      </li>
    </ul>

    <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
        count: 0,
        total_cost: 0.0000,
        page: 1,
        size: 10,
      }
    },
    computed: Vuex.mapState({
      list: state => {
        for(let i = 0; i < state.articles.list.length; i++) {
          if(state.articles.list[i].images && state.articles.list[i].images.length > 5) {
            state.articles.list[i].images.splice(5, state.articles.list[i].images.length - 5)
          }
        }
        return state.articles.list
      },
      total: state => state.articles.total,
    }),
    methods: {
      fetchData() {
        this.$store.dispatch('articles/search', {
          page: this.page,
          size: this.size,
          key: this.key
        })
      },
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.size = val
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.page = val
        this.onSubmit()
      },
      onSubmit() {
        this.fetchData()
      },
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
