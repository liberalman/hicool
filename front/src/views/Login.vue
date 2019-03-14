<template>
    <div class="main-container" style="background: url(static/3.png);">
        <div class="formWrap">
            <h1>HICOOL</h1>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
                <el-form-item label="用户名" prop="email">
                    <el-input type="text" v-model="ruleForm.email" auto-complete="off" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" auto-complete="off" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="captcha">
                    <el-input type="captcha" v-model="ruleForm.captcha" auto-complete="off" style="width: 70px;"></el-input>
                    <component >
                    <img :src="imgSrc" style="width: 100px;"  @click="getCaptcha"/>
                    </component>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" @keyup.enter="submitForm('ruleForm')" style="width: 200px;">提交</el-button>
                </el-form-item>
                <el-form-item>
                    <a href="/#/register">注册</a> | <a href="/">首页</a>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { API_ROOT } from '../config'
import router from '../router'
export default {
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
        this.imgSrc = `${API_ROOT}/auth/local/captcha?${Math.random()}`
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
                      });
              })
              .catch((error) => { // 这里的error，输出的是个string类型
                _this.$message({
                  message: error,
                  type: 'warning'
                });
              })
          } else {
              alert('err')
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
