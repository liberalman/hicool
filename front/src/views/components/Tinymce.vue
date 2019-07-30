<template>
  <div class="my-post">
    <br />
    <el-form :model="article" :rules="rules" ref="article" label-width="50px">
      <el-form-item label="标题" prop="title">
        <div class="title-section">
          <el-input class="title-input" v-model="article.title" placeholder="Your Post Title"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="简述" prop="description">
        <el-input type="textarea" v-model="article.description" placeholder="文章简介"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="type">
        <el-input v-model="article.cover" placeholder="background image url">
          <template slot="prepend"><img :src="article.cover" height="30m" @click="showCover"></template>
        </el-input>
      </el-form-item>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="6" :md="6" :lg="8" :xl="8">
          <el-form-item label="标签" prop="tags">
            <el-select v-model="article.tags" value-key="_id" filterable multiple placeholder="请选择标签">
              <el-option v-for="item in options" :key="item._id" :label="item.name" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="6" :md="8" :lg="6" :xl="6">
          <el-form-item prop="status">
            <el-switch v-model="article.status" :active-value="1" :inactive-value="0" active-text="发布" inactive-text="草稿"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="6" :md="8" :lg="4" :xl="4">
          <el-form-item prop="top">
            <el-checkbox v-model="article.top" :label="true" name="top">置顶</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <el-form-item label="权限" prop="type">
            <el-radio-group v-model="article.type">
              <el-radio :label="1">公开</el-radio>
              <el-radio :label="2">私密</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <el-form-item>
            <el-button type="primary" @click="submitForm('article')" :disabled="!isLogin">发布</el-button>
            <el-button @click="resetForm('article')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <textarea :id='id' :value='value'></textarea>
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
  // Import TinyMCE
  import tinymce from 'tinymce/tinymce'
  import 'tinymce/themes/silver'
  import 'tinymce/plugins/advlist' // 这几条引入是因为我的导入不了，不知道为啥
  import 'tinymce/plugins/link'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/code'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/textcolor'
  import 'tinymce/plugins/paste'
  import 'tinymce/plugins/textcolor'
  import 'tinymce/plugins/colorpicker'
  const INIT = 0
  const CHANGED = 2
  // var EDITOR = null
  export default {
    name: 'TinymceEditor',
    props: {
      value: {
        type: String,
        editor: null,
        required: true
      },
      setting: {},
      url: { // 接口
        default: '',
        type: String
      },
      accept: { // 文件类型
        default: 'image/jpeg, image/png, image/gif, image/webp',
        type: String
      },
      maxSize: { // 大小
        default: 2097152, // 图片最大2M
        type: Number
      },
      withCredentials: {
        default: false,
        type: Boolean
      },
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
          editor: 0, // 0代表富文本编辑器，1代表markdown编辑器
          status: 1,
          isRePub: false,
          tags: [], //["5a4ca9c1623bf51b5e326f68"] 我当前的文章有哪些标签key
          reprint_url: '',
        }
      },
    },
    watch: {
      value: function(val) {
        //console.log('watch init: ' + val)
        if (this.status === INIT || tinymce.activeEditor.getContent() !== val) {
          tinymce.activeEditor.setContent(val)
        }
        this.status = CHANGED
      }
    },
    data() {
      let ret = {
        status: INIT,
        id: 'editor-' + new Date().getMilliseconds(),
        
        
        editor: null,
        article: this.$props.article,
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
              max: 100,
              message: '长度在 3 到 100 个字符',
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
          /*content: [{
              required: true,
              message: '请填写文章内容',
              trigger: 'blur'
            },
            {
              min: 0,
              message: '内容不能为空',
              trigger: 'blur'
            }
          ]*/
        },
        options: this.$store.state.tags.tagList, //标签key和显示的文本描述的对照表

        model: false,
        modelSrc: ''
      }
      return ret
    },
    created() {
      //this.alertWarn('当前只有登录用户可以发布文章');
      //this.$store.dispatch('getQiniuToken')
      this.$store.dispatch('getTags')
    },
    computed: {
      isLogin() {
        return this.utils.isLogin()
      },
      options: state => state.tags.tagList, //标签key和显示的文本描述的对照表
    },
    methods: {
      // 绑定@imgAdd event
      async $imgAdd(pos, file) {
        let {
          res,
          message
          //} = await this.utils.uploadImgToQiniu(file, this.$store.state.third.qiniuToken)
        } = await this.utils.uploadImgToUpyun(file)
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
            if(!tinymce.activeEditor.getContent().trim()) {
              this.alertWarn('内容不可为空！');
              return
            }

            const data = {
              "title": this.article.title,
              "content": tinymce.activeEditor.getContent().trim(),
              "cover": this.article.cover,
              "description": this.article.description,
              "top": this.article.top,
              "type": this.article.type,
              "editor": this.article.editor,
              "status": this.article.status,
              "isRePub": this.article.isRepub,
              "tags": this.article.tags,
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
      alertWarn(msg) {
        this.$message({
          message: msg,
          type: 'warning'
        })
      },
    },
    mounted() {
      const _this = this
      const setting =
      {
        selector: '#' + _this.id,
        upload_image_url: '/upload/cloud', // 配置的上传图片的路由
        language: 'zh_CN',
        init_instance_callback: function(editor) {
          // EDITOR = editor
          console.log('Editor: ' + editor.id + ' is now initialized.')
          editor.on('input change undo redo', () => {
            var content = editor.getContent()
            _this.$emit('show', content)
          })
        },
        content_style: `
    *                         { padding:0; margin:0; }
    html, body                { height:100%; }
    img                       { max-width:100%; display:block;height:auto; }
    a                         { text-decoration: none; }
    iframe                    { width: 100%; }
    p                         { line-height:1.6; margin: 0px; }
    table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
    .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
    ul,ol                     { list-style-position:inside; }
  `,
        insert_button_items: 'image link | inserttable',
        paste_retain_style_properties: 'all',
        paste_word_valid_elements: '*[*]', // word需要它
        paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: false, // 插入word文档需要该属性
        paste_webkit_styles: 'all',
        paste_merge_formats: true,
        nonbreaking_force_tab: false,
        paste_auto_cleanup_on_paste: false,
        'plugins': [
          'advlist link image',
          'code',
          'table textcolor paste textcolor colorpicker'
        ], // 配置
        'toolbar_items_size': 'small',
        'block_formats': 'Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;',
        'toolbar1': 'table |insertfile undo redo | formatselect | link unlink | uploadimg image media', // 工具栏1
        'toolbar2': ' fontsizeselect | forecolor backcolor | fontselect bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | removeformat', // 工具栏2
        // 图片上传
        images_upload_handler: function(blobInfo, success, failure) {
          // failure(blobInfo)
          // _this.$emit('on-ready', blobInfo.blob().size, blobInfo.blob())
          if (blobInfo.blob().size > _this.maxSize) {
            failure('文件体积过大')
          }
          if (_this.accept.indexOf(blobInfo.blob().type) >= 0) {
            uploadPic()
          } else {
            failure('图片格式错误')
          }
          function uploadPic() { // 发送请求
            const xhr = new XMLHttpRequest()
            const formData = new FormData()
            xhr.withCredentials = _this.withCredentials
            xhr.open('POST', _this.url)
            xhr.onload = function() {
              failure('上传---' + xhr.status)
              if (xhr.status !== 200) {
                // 抛出 'on-upload-fail' 钩子
                _this.$emit('on-upload-fail')
                failure('上传失败: ' + xhr.status)
                return
              }
              const json = JSON.parse(xhr.responseText)
              // 抛出 'on-upload-success' 钩子
              _this.$emit('on-upload-success', [
                json, success, failure
              ])
            }
            xhr.onerror = function() {
              _this.$emit('on-ready', '上传失败')
            }
            formData.append('file', blobInfo.blob())
            xhr.send(formData)
          }
        }
      }
      Object.assign(setting, _this.setting)

      tinymce.init(setting)
    },
    beforeDestroy: function() {
      tinymce.get(this.id).destroy()
    }
  }
</script>
