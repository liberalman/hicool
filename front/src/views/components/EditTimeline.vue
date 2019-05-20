<template>
  <div class="article-wrapper" style="margin: 2em auto;">
    <div class="content">
    </br>
    <el-form :model="timeline" :rules="rules" ref="timeline" label-width="80px">
      <el-form-item label="标题" prop="title">
        <div class="title-section">
          <el-input type="text" class="title-input" v-model="timeline.title" placeholder="Your Post Title"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="简述" prop="description">
        <el-input type="textarea" v-model="timeline.description" placeholder="文章简介"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-input type="text" v-model="timeline.cover" placeholder="background image url">
          <template slot="prepend"><img :src="timeline.cover" height="30m" @click="showCover"></template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('timeline')" :disabled="!isLogin">发布</el-button>
        <el-button @click="resetForm('timeline')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="model" v-show="model" @click="model = false">
      <div class="model-show">
        <img :src="modelSrc" alt="">
      </div>
    </div>
    </div>
  </div>
</template>

<script>
  import router from '../../router'

  export default {
    name: 'EditTimeline',
    props: {
      timeline: {
        type: Object,
        default: {
          _id: '',
          title: '',
          cover: '',
          description: '',
        }
      },
    },
    data() {
      let ret = {
        model: false,
        modelSrc: '',
        rules: {
          title: [{
              required: true,
              message: '请输入标题',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 50,
              message: '长度在 1 到 50 个字符',
              trigger: 'blur'
            }
          ],
          description: [{
              required: false,
              message: '请输入简述',
              trigger: 'blur'
            },
            {
              min: 0,
              max: 200,
              message: '长度在 3 到 200 个字符',
              trigger: 'blur'
            }
          ],
          cover: [{
            required: false,
            message: '请选择封面图像',
            trigger: 'change'
          }],
        },
        timeline: this.$props.timeline
      }
      return ret
    },
    computed: Vuex.mapState({
      isLogin() {
        return this.utils.isLogin()
      },
      options: state => state.tags.list, //标签key和显示的文本描述的对照表
    }),
    created() {
      //this.alertWarn('当前只有登录用户可以发布文章');
      this.$store.dispatch('third/getQiniuToken')
    },
    methods: {
      alertWarn(msg) {
        this.$message({
          message: msg,
          type: 'warning'
        });
      },
      // 绑定@imgAdd event
      async $imgAdd(pos, file) {
        let save_dir = 'hicool/timelines'
        if('' != this.timeline._id) { // 如果是修改文章，说明已经传入了文章id，则放到对应文章id的目录下
          save_dir = save_dir + '/' + this.timeline._id
        } else {
          save_dir = save_dir + '/tmp'
        }
        let {
          res,
          message
        } = await this.utils.uploadImgToQiniu(file, save_dir, this.$store.state.third.qiniuToken)
        //} = await this.utils.uploadImgToUpyun(file)
        if(!res) {
          this.$message({
            message: message,
            type: 'error'
          });
        } else {
          // 替换掉当前的url
          this.$refs.md.$img2Url(pos, message)
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(!this.timeline.title.trim()) {
              this.alertWarn('标题不可为空！');
              return
            }

            const data = {
              "title": this.timeline.title,
              "cover": this.timeline.cover,
              "description": this.timeline.description,
            }
            let ret = {}
            let id = this.timeline._id
            if('' != id) {
              ret = this.$store.dispatch('timeline/update', { id: id, data: data})
            } else {
              ret = this.$store.dispatch('timeline/create', data)
            }
            let _this = this
            ret.then(function(response) {
                _this.$message({
                  message: '发布成功!',
                  type: 'success'
                })
                if(id !== '') {
                  router.push('/timeline/' + id)
                } else {
                  router.push('/timelines')
                }
              })
              .catch(error => { // 这里的error返回的是个string类型
                _this.$message({
                  message: error,
                  type: 'error'
                });
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      showCover(event) {
        this.model = true
        this.modelSrc = event.target.src
      },
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/article.scss';
</style>
