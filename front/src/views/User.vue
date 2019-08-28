<template lang="html">
  <div class="" 
       v-loading.fullscreen.lock="loading">
    <header class="a-header" 
            :style="{background: 'url(http://image.hicool.top/static/album/2/1505056171190783772.jpeg)' + 'center center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
    </header>
    <div class="article-wrapper">

      <el-row>
        <el-col :span="8">
          <el-card :body-style="{ padding: '0px', margin: '1em' }">
            <img :src="user.avatar" class="image">
            <div style="padding: 14px;">
              <span>Hicool</span>
              <div class="bottom clearfix">
                <time class="time">{{ user.createdAt | handleDateFormat}}</time>
                <el-button type="text" class="button">@</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <div :style="{ padding: '20px' }">
            <div class="title" v-text="user.nickname"></div>
            <div class="create">{{user.createdAt | handleDateFormat}}</div>
            <div class="create">{{user.email}}</div>
            <div class="content">{{user.description}}</div>
            
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-collapse>
            <!--
            <el-collapse-item title="修改头像">
              <Avatar></Avatar>
            </el-collapse-item>
            -->
            <el-collapse-item title="修改头像">
              <AvatarQiniu></AvatarQiniu>
            </el-collapse-item>
            <el-collapse-item title="修改个人信息">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="昵称" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="生日" required>
                  <el-form-item prop="date1">
                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="个人描述" prop="desc">
                  <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-collapse-item>
            <el-collapse-item title="修改密码">
              <el-form :model="ruleForm1" status-icon :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
                <el-form-item label="旧密码" prop="pass">
                  <el-input type="password" v-model="ruleForm1.passwordOld" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                  <el-input type="password" v-model="ruleForm1.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                  <el-input type="password" v-model="ruleForm1.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm1')">提交</el-button>
                  <el-button @click="resetForm('ruleForm1')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </div>
    <CopyRight />
  </div>
</template>

<script>
  export default {
    components: {
      'CopyRight': () => import('./components/CopyRight.vue'),
      'vNav': () => import('./components/Nav.vue'),
      //'Avatar': () => import('./components/Avatar.vue'),
      'AvatarQiniu': () => import('./components/AvatarQiniu.vue'),
    },
    data() {
      var checkPasswordOld = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm1: {
          pass: '',
          checkPass: '',
          passwordOld: ''
        },
        rules1: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          passwordOld: [
            { validator: checkPasswordOld, trigger: 'blur' }
          ]
        },
        ruleForm: {
          name: '',
          date1: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      };
    },
    computed: Vuex.mapState({
      user: state => state.user
    }),
    created() {
      this.$store.dispatch('user/getUser', this.$route.params.id)
    },
    beforeDestroy() {
      this.$store.dispatch('clearUser')
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/scss/article.scss';
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
