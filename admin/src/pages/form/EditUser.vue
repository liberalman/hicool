<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :autoFormCreate="(form) => this.form = form" class="form">
      <a-form-item>
        <a-input type="hidden"
          v-decorator="[
            '_id',
            {rules: [{ required: true }], initialValue: user._id },
          ]"
          />
      </a-form-item>
      <a-form-item
        label="头像"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-avatar size="large" shape="square" :src="user.avatar"/>
      </a-form-item>
      <a-form-item
        label="email"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
        :required="false"
      >
        <a-input placeholder="xxxx@163.com"
          v-decorator="[
            'email',
            {rules: [{ required: true, message: 'Please input your email!' }], initialValue: user.email },
          ]"
          />
      </a-form-item>
      <a-form-item
        label="用户昵称"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
        :validateStatus="userNameError() ? 'error' : ''"
        :help="userNameError() || ''"
      >
        <a-input placeholder="请输入您的昵称"
          v-decorator="[
            'nickname',
            {rules: [{ required: true, message: 'Please input your nickname!' }], initialValue: user.nickname },
          ]"
          >
          <a-icon slot="prefix" type='user' style="color:rgba(0,0,0,.25)"/>
        </a-input>
      </a-form-item>
      <a-form-item
        label="生日"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-date-picker style="width: 100%"
          v-decorator="[
            'birthday',
            {rules: [{ required: false }] }
          ]"
          :defaultValue="moment(user.birthday, dateFormat)" :format="dateFormat" />
      </a-form-item>
      <a-form-item
        label="描述"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-textarea rows="4" placeholder="请输入您的个性签名"
          v-decorator="[
            'description',
            {rules: [{ required: false, message: 'Please input your description!' }], initialValue: user.description },
          ]"
          />
      </a-form-item>
      <a-form-item
        label="角色"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
        :required="false"
      >
        <a-input placeholder="user"
          v-decorator="[
            'role',
            {rules: [{ required: true, message: 'Please input your description!' }], initialValue: user.role },
          ]"
          />
      </a-form-item>
      <a-form-item
        label="权重"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
        :required="false"
      >
        <a-input-number :min="0" :max="100"/>
        <span>%</span>
      </a-form-item>
      <a-form-item
        label="状态"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
        :required="false"
        help="客户、邀评人默认被分享"
      >
        <a-radio-group v-model="user.status">
          <a-radio :value="1">Authenticated</a-radio>
          <a-radio :value="2">Unverified</a-radio>
          <a-radio :value="3">Blocked</a-radio>
        </a-radio-group>
        <a-form-item>
          <a-select mode="multiple" v-if="user.status === 2">
            <a-select-option value="4">同事一</a-select-option>
            <a-select-option value="5">同事二</a-select-option>
            <a-select-option value="6">同事三</a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary" htmlType='submit'>提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

export default {
  name: 'EditUser',
  data () {
    console.log(this.$store.state.user)
    return {
      dateFormat: 'YYYY-MM-DD',
      desc: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
      hasErrors
      // form: this.$form.createForm(this)
    }
  },
  mounted () {
    // 1，我一直以为在created里定义方法然后使用，其实这里的getCustomerInfo只是调用
    // 2，所有的方法都应该在methods里定义，然后在created或者mounted里 使用this调用方法，用这种方式实现初始化
    this.fetchData(this.$route.params.id)
    /* this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields()
    }) */
  },
  watch: { // 监听路由跳转。因为跳转为了提高效率，复用已经生成的组件，这样就达不到刷新数据的效果了。所以监听路由方向，以确定何时刷新。
    '$route' (to, from) {
      if (to.path.indexOf('/form/edituser/') >= 0) {
        this.fetchData(to.params.id)
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    fetchData: function (id) {
      this.$store.dispatch('user/getUser', id)
    },
    moment,
    // Only show error after a field is touched.
    userNameError () {
      return true
    },
    // Only show error after a field is touched.
    passwordError () {
      return true
    },
    handleSubmit: function (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.$store.dispatch('user/updateUser', values)
            .then(res => {
              this.$message.success('修改成功', 3)
              this.$router.push({'path': '/detail/user/' + values._id})
            })
            .catch((error) => {
              // {"error_msg":"用户名或密码错误."}
              this.$message.error(`${error.response.status} ${error.response.statusText}, ${error.response.data.message}`)
            })
        }
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
  .form{
    .form-row{
      margin: 0 -8px
    }
    .ant-col-md-12,
    .ant-col-sm-24,
    .ant-col-lg-6,
    .ant-col-lg-8,
    .ant-col-lg-10,
    .ant-col-xl-8,
    .ant-col-xl-6{
      padding: 0 8px
    }
  }
</style>
