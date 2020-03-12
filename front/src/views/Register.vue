<template>
  <div class="main-container" style="background: url(static/images/background-1.png);">
    <div class="formWrap">
      <h1>HICOOL</h1>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm.nickname" auto-complete="off" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="ruleForm.email" auto-complete="off" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" auto-complete="off" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input type="password" v-model="ruleForm.confirm_password" auto-complete="off"
                    style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <el-input type="captcha" v-model="ruleForm.captcha" auto-complete="off" style="width: 70px;"></el-input>
          <img :src="imgSrc" style="width: 100px;"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" @keyup.enter="submitForm('ruleForm')"
                     style="width: 200px;">注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <a href="/#/login">登录</a> | <a href="/">首页</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {API_ROOT} from '../config'
  import router from '../router'

  export default {
    components: {
      //'Captcha': () => import('vue-social-captcha'),
    },
    data() {
      var checkeUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("用户名不可为空！"))
        } else {
          callback();
        }
      }
      var checkemail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("邮箱不可为空！"))
        } else {
          callback();
        }
      }
      var checkPassword = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("密码不可为空！"))
        } else {
          callback();
        }
      }
      var checkConfirmPassword = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("确认密码不可为空！"))
        } else if (this.ruleForm.password != this.ruleForm.confirm_password) {
          return callback(new Error("两个密码不一致！"))
        } else {
          callback();
        }
      }
      return {
        captchaOption: {
          // 各平台的参数，具体请参阅个平台文档
          // 以下为腾讯验证码的参数
          // appid: '',
          // 以下为极验验证码的参数
          product: 'bind',
        },
        ruleForm: {
          nickname: '',
          email: '',
          password: '',
          confirm_password: '',
          captcha: ''
        },
        rules: {
          nickname: [
            {validator: checkeUsername, trigger: 'blur'}
          ],
          email: [
            {validator: checkemail, trigger: 'blur'}
          ],
          password: [
            {validator: checkPassword, trigger: 'blur'}
          ],
          confirm_password: [
            {validator: checkConfirmPassword, trigger: 'blur'}
          ]
        },
        imgSrc: '',
      }
    },
    mounted() {
      this.getCaptcha()
    },
    methods: {
      getCaptcha() {
        this.imgSrc = `${API_ROOT}/api/1/front/user/captcha?${Math.random()}`
      },
      submitForm(formName) {
        let _this = this
        this.$refs[formName].validate(vaild => {
          if (vaild) {
            this.$store.dispatch('user/register', this.ruleForm)
              .then(res => {
                this.utils.saveCookie('token', res.token)
                this.utils.saveCookie('username', res.username)
                this.utils.saveCookie('token', res.token)
                this.ruleForm.password = ''
                setTimeout(() => {
                  router.push('/')
                }, 400)
                this.$message({
                  message: '注册成功!',
                  type: 'success'
                });
              })
              .catch((error) => { // 这里的error，输出的是个string类型
                _this.$message({
                  message: error,
                  type: 'warning'
                });
              })
          } else {
            console.log('something err')
            return false;
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/login.scss';
</style>
