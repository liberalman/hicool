<template>
  <div>
    <search-form />
    <a-card :bordered="false">
      <a-list itemLayout="vertical" size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, page: page, pageSize: size, total: total, onChange: updateSelect}">
        <a-list-item :key="item._id" v-for="(item,index) in list">
          <a-list-item-meta :title="item.title" @click="showDetail(item)">
            <div slot="description">
              <a-tag :key="tag._id" v-for="(tag) in item.tags">{{tag.name}}</a-tag>
            </div>
          </a-list-item-meta>
          <div class="content">
            <div class="detail">
              {{item.description}}
            </div>
            <div class="author">
              <a-avatar size="small" :src="item.author_id.avatar" />
              <a>{{item.author_id.nickname}}</a>
              发布日期<em>{{moment(item.publish_time).format('YYYY-MM-DD')}}</em>
              更新日期<em>{{moment(item.updated).format('YYYY-MM-DD')}}</em>
              <a :href="'https://www.hicool.top/article/'.concat(item._id)" target="_blank">show...</a>
            </div>
          </div>
          <span slot="actions"><a-icon style="margin-right: 8px" type="star-o" />{{item.like_count}}</span>
          <span slot="actions"><a-icon style="margin-right: 8px" type="view-o" />{{item.visit_count}}</span>
          <span slot="actions"><a-icon style="margin-right: 8px" type="like-o" />1435</span>
          <span slot="actions"><a-icon style="margin-right: 8px" type="message" />{{item.comment_count}}</span>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-popconfirm title="确定要删除吗？"
                    @confirm="_confirmDel(index, item._id)">
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
    <a-modal title="详情"
      :visible="visible"
      @ok="_handleCancel"
      @cancel="_handleCancel">
      <p>
        <table border="1">
          <tr>
            <th>标题</th> <td>{{detail.title}}</td>
          </tr>
          <tr>
            <th>描述</th> <td>{{detail.description}}</td>
          </tr>
          <tr>
            <th>发布日期</th> <td>{{detail.publish_time | dateFormat}}</td>
          </tr>
          <tr>
            <th>更新日期</th> <td>{{detail.updated | dateFormat}}</td>
          </tr>
          <tr>
            <th>被收藏数</th> <td>{{detail.like_count}}</td>
          </tr>
          <tr>
            <th>浏览数量</th> <td>{{detail.visit_count}}</td>
          </tr>
          <tr>
            <th>作者</th> <td>{{detail.author_id}}</td>
          </tr>
          <tr>
            <th>文章类型</th> <td>{{detail.type}}</td>
          </tr>
          <tr>
            <th>编辑器</th> <td>{{detail.editor}}</td>
          </tr>
          <tr>
            <th>文章状态</th> <td><font color="red">{{detail.status}}</font></td>
          </tr>
        </table>
      </p>
      <p>接口参数：<br/><font color="blue">{{detail.pubtype}}</font></p>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import SearchForm from './SearchForm'
export default {
  name: 'ArticleList',
  components: {SearchForm},
  data () { 
    return {
      page: 1,
      size: 10,
      sortOrder: 'false', // true 按updated字段顺序排序，false 则是倒序
      filter_title: '',
      visible: false,
      detail: {}
    }
  },
  computed: {
    ...mapState({
      total: state => state.articles.total,
      list: state => state.articles.list
    })
  },
  mounted () {
    // 1，我一直以为在created里定义方法然后使用，其实这里的getCustomerInfo只是调用
    // 2，所有的方法都应该在methods里定义，然后在created或者mounted里 使用this调用方法，用这种方式实现初始化
    this.fetchData()                                                                                                  
  },
  methods: {                                                                                                          
    fetchData: function () {
      this.$store.dispatch('articles/getArticles', {
        page: this.page,
        size: this.size,
        sortOrder: this.sortOrder,
        filterTitle: this.filter_title
      })
    },
    moment,
    updateSelect: function (value) {
      this.page = value
      this.fetchData() // 刷新数据
    },
    showDetail: function (value) {
      this.visible = true
      this.detail = value
    },
    _handleCancel: function () {
      this.visible = false
      this.detail = {}
    },
    _confirmDel: function (index, id) {
      this.$store.dispatch('article/delete', id)
        .then(res => {
          this.list.splice(index, 1) // 删除list中对应的行
          this.$store.commit('articles/setTotal', this.total - 1) // 更改total值。
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  },
  filters: {
    FmtDate: function (el) { // 自定义过滤器，时间处理函数。
      return moment(el).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="less" scoped>
  .extra{
    width: 272px;
    height: 1px;
  }
  .content {
    .detail {
      line-height: 22px;
      max-width: 720px;
    }
    .author {
      color: rgba(0,0,0,.45);
      margin-top: 16px;
      line-height: 22px;
      & > :global(.ant-avatar) {
          vertical-align: top;
          margin-right: 8px;
          width: 20px;
          height: 20px;
          position: relative;
          top: 1px;
        }
      & > em {
          color: rgba(0,0,0,.25);
          font-style: normal;
          margin-left: 16px;
        }
    }
  }
</style>
