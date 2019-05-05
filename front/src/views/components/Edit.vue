<template>
  <div class="my-post">
    <br />
    <el-form :model="article" :rules="rules" ref="article" label-width="100px">
      <el-form-item label="标题" prop="title">
        <div class="title-section">
          <el-input type="text" class="title-input" v-model="article.title" placeholder="Your Post Title"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="简述" prop="description">
        <el-input type="textarea" v-model="article.description" placeholder="文章简介"></el-input>
      </el-form-item>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="封面" prop="cover">
            <el-input type="text" v-model="article.cover" placeholder="background image url">
              <template slot="prepend"><img :src="article.cover" height="30m" @click="showCover"></template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="转载于" prop="reprint_url">
            <el-input type="text" v-model="article.reprint_url" placeholder="url"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="6" :md="4" :lg="4" :xl="4">
          <el-form-item label="标签" prop="tags">
            <el-select v-model="article.tags" value-key="_id" filterable multiple placeholder="请选择标签">
              <el-option v-for="item in options" :key="item._id" :label="item.name" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="6" :md="8" :lg="4" :xl="6">
          <el-form-item prop="status">
            <el-switch v-model="article.status" :active-value="1" :inactive-value="0" active-text="发布" inactive-text="草稿"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="6" :md="8" :lg="2" :xl="4">
          <el-form-item prop="top">
            <el-checkbox v-model="article.top" :label="true" name="top">置顶</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="5" :xl="5">
          <el-form-item label="可见性" prop="type">
            <el-radio-group v-model="article.type">
              <el-radio :label="1">公开</el-radio>
              <el-radio :label="2">私密</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="5" :xl="5">
          <el-form-item>
            <el-button type="primary" @click="submitForm('article')" :disabled="!isLogin">发布</el-button>
            <el-button @click="resetForm('article')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <mavonEditor prop="content" style="min-height: 900px" v-model="article.content" ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel" placeholder="Markdown" :subfield="true"></mavonEditor>
    </el-form>

    <div class="model" v-show="model" @click="model = false">
      <div class="model-show">
        <img :src="modelSrc" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import router from '../../router'
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import { API_ROOT } from '../../config'

  export default {
    name: 'Edit',
    components: {
      mavonEditor
    },
    props: {
      article: {
        type: Object,
        default: {
          _id: '',
          title: '',
          cover: '',
          content: '',
          description: '',
          top: false,
          type: 1,
          editor: 1, // 1 markdown编辑器，0 富文本编辑器
          status: 1,
          isRePub: false,
          tags: [], //["5a4ca9c1623bf51b5e326f68"] 我当前的文章有哪些标签key
          reprint_url: '',
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
          top: [{
            required: true,
            message: '您选择了置顶',
            trigger: 'change'
          }],
          status: [{
            required: true,
            message: '请选择发布还是保存草稿',
            trigger: 'change'
          }],
          content: [{
              required: true,
              message: '请填写文章内容',
              trigger: 'blur'
            },
            {
              min: 0,
              message: '内容不能为空',
              trigger: 'blur'
            }
          ]
        },
        article: this.$props.article
      }
      return ret
    },
    computed: Vuex.mapState({
      words() {
        const reg = /(\w)|[\u4e00-\u9fa5]/g
        if(this.content) return this.content.match(reg).length
        return 0
      },
      isLogin() {
        return this.utils.isLogin()
      },
      options: state => state.tags.list, //标签key和显示的文本描述的对照表
    }),
    created() {
      //this.alertWarn('当前只有登录用户可以发布文章');
      this.$store.dispatch('third/getQiniuToken')
      this.$store.dispatch('tags/getTags')
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
        let save_dir = 'hicool/articles'
        if('' != this.article._id) { // 如果是修改文章，说明已经传入了文章id，则放到对应文章id的目录下
          save_dir = save_dir + '/' + this.article._id
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
            if(!this.article.content.trim()) {
              this.alertWarn('内容不可为空！');
              return
            }

            const data = {
              "title": this.article.title,
              "content": this.article.content,
              "cover": this.article.cover,
              "description": this.article.description,
              "top": this.article.top,
              "type": this.article.type,
              "editor": this.article.editor,
              "status": this.article.status,
              "isRePub": this.article.isRepub,
              "tags": this.article.tags,
              "reprint_url": this.article.reprint_url,
            }
            let ret = {}
            let id = this.article._id
            if('' != id) {
              ret = this.$store.dispatch('article/update', { id: id, data: data})
            } else {
              ret = this.$store.dispatch('article/create', data)
            }
            let _this = this
            ret.then(function(response) {
                _this.$message({
                  message: '发布成功!',
                  type: 'success'
                })
                if(id !== '') {
                  router.push('/article/' + id)
                } else {
                  router.push('/')
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
  @import '../../../node_modules/github-markdown-css/github-markdown.css';
  @import '../../assets/scss/post.scss';
  @import '../../assets/scss/components/preview.scss';
</style>
