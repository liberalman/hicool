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
      title="列表"
    >
      <div slot="extra" @click="fetchData">
        <a-input-search style="margin-left: 16px; width: 272px;" v-model="filter_title" />
      </div>
      <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, page: page, pageSize: size, total: total, onChange: updateSelect}">
        <a-list-item :key="item.Id" v-for="(item,index) in list">
          <a-list-item-meta
            :description="item.content"
          >
            <a-avatar slot="avatar" size="large" shape="square" :src="item.cover"/>
            <a slot="title" @click="showDetail(item)">{{item._id}}</a>
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
        </a-list-item>
      </a-list>
    </a-card>
    <a-modal
      width="60%"
      style="top: 2%"
      :visible="visible"
      @ok="_handleCancel"
      @cancel="_handleCancel">
      <p>
        <table border="1">
          <tr>
            <th>id</th> <td>{{detail._id}}</td>
          </tr>
          <tr>
            <th>cover</th>
            <td>
              <img :src="detail.cover" width="100%"/>
              <a-input v-model="detail.cover" />
            </td>
          </tr>
          <tr>
            <th>描述</th> <td><a-input v-model="detail.content"/></td>
          </tr>
        </table>
      </p>
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
      total: state => state.tips.total,
      list: state => {
        const dataSource = []
        if (state.tips.list) {
          for (let i = 0; i < state.tips.list.length; i++) {
            dataSource.push({
              key: i,
              _id: state.tips.list[i]._id,
              content: state.tips.list[i].content,
              cover: state.tips.list[i].cover,
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
      this.$store.dispatch('tips/getTips', {
        page: this.page,
        size: this.size,
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
          this.$store.commit('tips/setTotal', this.total - 1) // 更改total值。
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
