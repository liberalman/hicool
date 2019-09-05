<template>
  <div class="card-list">
    <a-list
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="list"
      :pagination="{showSizeChanger: true, showQuickJumper: true, page: page, pageSize: size, total: total, onChange: updateSelect}"
    >
      <a-list-item slot="renderItem" slot-scope="item, index">
        <template v-if="item === null">
          <a-button class="new-btn" type="dashed">
            <a-icon type="plus" />新增用户
          </a-button>
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <a-card-meta >
              <div style="margin-bottom: 3px" slot="title"><router-link :to="{ path: '/user/' + item._id }">{{item.nickname}}</router-link></div>
              <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large" />
              <div class="meta-content" slot="description">{{item.description}} email：{{item.email}} 状态：{{item.status == 1 ? '已验证' : '未验证'}} 通知：{{item.notifyCount}} birthday：{{item.birthday}} role：{{item.role}}
              </div>
            </a-card-meta>
            <a slot="actions"><router-link :to="{ path: '/user/edit/' + item._id }">修改</router-link></a>
            <a slot="actions"><router-link :to="{ path: '/user/' + item._id }">详情</router-link></a>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserList',
  data () {
    return {
      desc: '包括管理员用户和普通用户，授权操作。',
      linkList: [
        {icon: 'rocket', href: '/#/', title: '快速开始'},
        {icon: 'info-circle-o', href: '/#/', title: '产品简介'},
        {icon: 'file-text', href: '/#/', title: '产品文档'}
      ],
      page: 1,
      size: 10
    }
  },
  computed: {
    ...mapState({
      total: state => state.users.total,
      list: state => state.users.list
    })
  },
  mounted () {
    // 1，我一直以为在created里定义方法然后使用，其实这里的getCustomerInfo只是调用
    // 2，所有的方法都应该在methods里定义，然后在created或者mounted里 使用this调用方法，用这种方式实现初始化
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.$store.dispatch('users/getUsers', {
        page: this.page,
        size: this.size
      })
    },
    updateSelect: function (value) {
      this.page = value
      this.fetchData() // 刷新数据
    },
    Edit: function (id) {
      alert('edit')
    }
  }
}
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }
  .new-btn{
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 188px;
  }
  .meta-content{
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

</style>
