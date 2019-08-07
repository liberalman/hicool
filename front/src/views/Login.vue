<template>
  <div class="main-container" style="background: url(static/img/background-1.png);">
    <div class="formWrap">
      <h1>HICOOL</h1>
      <el-form :model="ruleForm" :rules="rules" class="ruleForm" label-width="100px" ref="ruleForm">
        <el-form-item label="用户名" prop="email">
          <el-input auto-complete="off" style="width: 200px;" type="text" v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input auto-complete="off" style="width: 200px;" type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <el-input auto-complete="off" style="width: 70px;" type="captcha" v-model="ruleForm.captcha"></el-input>
          <component>
            <img :src="imgSrc" @click="getCaptcha" style="width: 100px;"/>
          </component>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="submitForm('ruleForm')"
            @keyup.enter="submitForm('ruleForm')"
            style="width: 200px;"
            type="primary">
            提交
          </el-button>
        </el-form-item>
        <el-form-item>
          <a href="/register">注册</a> | <a href="/">首页</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import router from '../router'
  import {API_ROOT} from "../config";

  export default {
    components: {
      'Captcha': () => import('vue-social-captcha')
    },
    data() {
      var checkemail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("用户名不可为空！"))
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
      return {
        value1: 0,
        ruleForm: {
          email: '',
          password: '',
          captcha: ''
        },
        rules: {
          email: [
            {validator: checkemail, trigger: 'blur'}
          ],
          password: [
            {validator: checkPassword, trigger: 'blur'}
          ]
        },
        imgSrc: '',
      }
    },
    computed: Vuex.mapState({
      imgSrc: state => state.user.captcha
    }),
    mounted() {
      this.getCaptcha()
    },
    methods: {
      getCaptcha() {
        //this.imgSrc = `${API_ROOT}/api/1/front/user/captcha?${Math.random()}`
        this.$store.dispatch('user/getCaptcha')
          .then(res => {
            this.imgsrc = res.img_src
          })
      },
      submitForm(formName) {
        let _this = this
        this.$refs[formName].validate(vaild => {
          if (vaild) {
            this.$store.dispatch('user/login', this.ruleForm)
              .then(res => {
                /* response example:
                 HTTP status 403: {message: "账户名或密码错误（admin/888888）"}
                 HTTP status 200: {
                 "token": "kODBlNGRkMzE2MmIij6KkYyD4UOFyM_nyNtb0X1hb9o",
                 "email": "XXXX@XXX.com",
                 "username": "Tom",
                 "avatar": "http://www.xx.com/KkYyD4UOFyM_nyNtb0X1hb9o.jpg"}
                */
                /* sessionStorage.setItem('email', this.$store.state.user.email)
                      sessionStorage.setItem('username', this.$store.state.user.username)
                      sessionStorage.setItem('token', this.$store.state.user.token)
                      sessionStorage.setItem('avatar', this.$store.state.user.avatar) */

                this.utils.saveCookie('email', res.user.email)
                this.utils.saveCookie('username', res.user.name)
                this.utils.saveCookie('avatar', res.user.avatar)
                this.utils.saveCookie('token', res.accessToken)

                this.ruleForm.password = ''

                setTimeout(() => {
                  router.push('/')
                }, 400)
                _this.$message({
                  message: '登录成功!',
                  type: 'success'
                })
              })
              .catch((error) => { // 这里的error，输出的是个string类型
                _this.$message({
                  message: error,
                  type: 'warning'
                })
              })
          } else {
            alert('something err')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/login.scss';
</style>
