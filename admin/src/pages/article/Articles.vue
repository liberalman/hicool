<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="8" :xs="24">
          <head-info title="文章总数" :content="total" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="。。。" content="。。。" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="。。。" content="。。。"/>
        </a-col>
      </a-row>
    </a-card>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="文章列表"
    >
      <div slot="extra" @click="fetchData">
        <a-input-search style="margin-left: 16px; width: 272px;" v-model="filter_title" />
      </div>
      <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, page: page, pageSize: size, total: total, onChange: updateSelect}">
        <a-list-item :key="item.Id" v-for="(item,index) in list">
          <a-list-item-meta
            :description="item.description"
          >
            <a-avatar slot="avatar" size="large" shape="square" :src="item.author_id.avatar"/>
            <a slot="title" @click="showDetail(item)">{{item.title}}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a>编辑</a>
          </div>
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
          <div class="list-content">
            <div class="list-content-item">
              <span>浏览</span>
              <p>{{item.visit_count}}</p>
            </div>
            <div class="list-content-item">
              <span>收藏</span>
              <p>{{item.like_count}}</p>
            </div>
            <div class="list-content-item">
              <span>发布日期</span>
              <p>{{item.publish_time | dateFormat}}</p>
            </div>
            <div class="list-content-item">
              <span>更新日期</span>
              <p>{{item.updated | dateFormat}}</p>
            </div>
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
import HeadInfo from '../../components/tool/HeadInfo'
export default {
  name: 'StandardList',
  components: { HeadInfo },
  data: function () {
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
      list: state => {
        const dataSource = []
        if (state.articles.list) {
          for (let i = 0; i < state.articles.list.length; i++) {
            dataSource.push({
              key: i,
              _id: state.articles.list[i]._id,
              title: state.articles.list[i].title,
              description: state.articles.list[i].description,
              like_count: state.articles.list[i].like_count,
              updated: state.articles.list[i].updated,
              publish_time: state.articles.list[i].publish_time,
              visit_count: state.articles.list[i].visit_count,
              type: state.articles.list[i].type,
              editor: state.articles.list[i].editor,
              status: state.articles.list[i].status,
              pubtype: state.articles.list[i].pubtype,
              author_id: state.articles.list[i].author_id
            })
          }
        }
        return dataSource
      }
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
  }
}
</script>

<style lang="less" scoped>
  .ant-avatar-lg{
    width: 48px;
    height: 48px;
    line-height: 48px;
  }
  .list-content-item{
    color: rgba(0,0,0,.45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span{
      line-height: 20px;
    }
    p{
      margin-top: 4px;
      margin-bottom: 0;
      line-height: 22px;
    }
  }
</style>
