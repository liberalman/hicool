<template>
    <page-layout title="基础详情页">
      <template slot="action">
        <a-button-group style="margin-right: 4px;">
          <a-popconfirm placement="bottom" title="删除?" @confirm="confirmDelete" @cancel="cancelDelete">
            <a-button>删除</a-button>
          </a-popconfirm>
          <a-button>激活</a-button>
          <a-button>封号</a-button>
          <a-button><a-icon type="ellipsis"/></a-button>
        </a-button-group>
        <a-button type="primary" ><router-link :to="{ path: '/detail/user/' + user._id }">编辑</router-link></a-button>
      </template>
      <a-card :bordered="false">
        <detail-list title="主要信息">
          <detail-list-item><a-avatar size="large" shape="square" :src="user.avatar"/></detail-list-item>
          <detail-list-item term="用户编码">{{user._id}}</detail-list-item>
          <detail-list-item term="用户名">{{user.nickname}}</detail-list-item>
          <detail-list-item term="email">{{user.email}}</detail-list-item>
          <detail-list-item term="生日">{{user.birthday | dateFormat}}</detail-list-item>
        </detail-list>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list title="其他信息">
          <detail-list-item term="更新日期">{{user.updated | dateFormat}}</detail-list-item>
          <detail-list-item term="注册日期">{{user.created | dateFormat}}</detail-list-item>
          <detail-list-item term="角色">{{user.role}}</detail-list-item>
          <detail-list-item term="描述">{{user.description}}</detail-list-item>
        </detail-list>
        <a-divider style="margin-bottom: 32px"/>
        <div class="title">收藏列表</div>
        <a-table
          style="margin-bottom: 24px"
          :columns="goodsColumns"
          :dataSource="likeList"
          :pagination="false"
        >
        </a-table>
      </a-card>
    </page-layout>
</template>

<script>
import { mapState } from 'vuex'
import DetailList from '../../components/tool/DetailList'
import PageLayout from '../../layouts/PageLayout'

const DetailListItem = DetailList.Item

const goodsColumns = [
  {
    title: '文章id',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '标题',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '商品条码',
    dataIndex: 'barcode',
    key: 'barcode'
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    align: 'right'
  },
  {
    title: '数量（件）',
    dataIndex: 'num',
    key: 'num',
    align: 'right'
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    align: 'right'
  }
]

const goodsData = [
  {
    id: '1234561',
    name: '矿泉水 550ml',
    barcode: '12421432143214321',
    price: '2.00',
    num: '1',
    amount: '2.00'
  },
  {
    id: '1234562',
    name: '凉茶 300ml',
    barcode: '12421432143214322',
    price: '3.00',
    num: '2',
    amount: '6.00'
  },
  {
    id: '1234563',
    name: '好吃的薯片',
    barcode: '12421432143214323',
    price: '7.00',
    num: '4',
    amount: '28.00'
  },
  {
    id: '1234564',
    name: '特别好吃的蛋卷',
    barcode: '12421432143214324',
    price: '8.50',
    num: '3',
    amount: '25.50'
  }
]

export default {
  name: 'User',
  components: { PageLayout, DetailListItem, DetailList },
  data () {
    return {
      goodsColumns,
      goodsData
    }
  },
  mounted () {
    // 1，我一直以为在created里定义方法然后使用，其实这里的getCustomerInfo只是调用
    // 2，所有的方法都应该在methods里定义，然后在created或者mounted里 使用this调用方法，用这种方式实现初始化
    this.fetchData(this.$route.params.id)
  },
  watch: { // 监听路由跳转。因为跳转为了提高效率，复用已经生成的组件，这样就达不到刷新数据的效果了。所以监听路由方向，以确定何时刷新。
    '$route' (to, from) {
      if (to.path.indexOf('/detail/user/') >= 0) {
        this.fetchData(to.params.id)
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      likeList: state => {
        const dataSource = []
        for (let i = 0; i < state.user.likeList.length; i++) {
          dataSource.push({
            key: i,
            id: state.user.likeList[i],
            name: '特别好吃的蛋卷',
            barcode: '12421432143214324',
            price: '8.50',
            num: '3',
            amount: '25.50'
          })
        }
        return dataSource
      }
    })
  },
  methods: {
    fetchData: function (id) {
      this.$store.dispatch('user/getUser', id)
    },
    confirmDelete: function () {
      console.log(1)
    },
    cancelDelete: function () {
      this.$message.success('您已经取消删除', 3)
    }
  }
}
</script>

<style lang="less" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
</style>
