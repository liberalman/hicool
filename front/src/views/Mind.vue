<template lang="html">
  <div>
    <div style="height:200em;">
      <mindmap
        v-model="article.mind"
      ></mindmap>
    </div>
    <span>
      <el-button type="primary" @click="submitForm">Save</el-button>
    </span>
  </div>
</template>

<script>
  import router from '../router'
  // https://github.com/hellowuxin/mindmap
  import mindmap from '@hellowuxin/mindmap'

  export default {
    components: {
      mindmap,
    },
    data() {
      return {
        /*content:
[{"name":"Apollo","children":[{"name":"Basic","children":[{"name":"Toolbox","children":[{"name":"Bazel"},{"name":"Protobuf"},{"name":"Docker"},{"name":"ROS(before Apollo3.1)/Cyber RT"},{"name":"OpenCV"}]},{"name":"Language","children":[{"name":"C++"},{"name":"Bash"},{"name":"Python"},{"name":"JavaScript","children":[{"name":"Node.js"},{"name":"React"}]}]},{"name":"Machine Learnning Frameworks","children":[{"name":"Caffe"},{"name":"Keras"},{"name":"TensorFlow"}]}]},{"name":"V2X","children":[{"name":"RSU/OBU Device"},{"name":"V2X Data interaction protocol"},{"name":"V2X Data Fusion"}]},{"name":"Hardware","children":[{"name":"Computing Unit"},{"name":"Sensor","children":[{"name":"Camera(single eyes/multi eyes)"},{"name":"LiDAR"},{"name":"Radar"},{"name":"GPS/IMU"},{"name":"Other Sensors"}]},{"name":"CAN Card"},{"name":"HMI Device"},{"name":"Black Box"},{"name":"ASU"},{"name":"AXU"}]},{"name":"Cyber RT","children":[{"name":"High Performance Parallel Computing","children":[{"name":"Coroutine"},{"name":"Scheduling"}]},{"name":"Adaptive Communication System","children":[{"name":"Service Discovery"},{"name":"Data Abstraction"}]},{"name":"Atomic Programing"},{"name":"Runtime System"}]},{"name":"Open Modules(Apollo)","children":[{"name":"RSU/OBU Device"},{"name":"V2X Data interaction protocol"},{"name":"V2X Data Fusion"}]},{"name":"Vehicle(Apollo)","children":[{"name":"Drive-by-wire Vehicle"},{"name":"Vehicle electronic control system","children":[{"name":"RSU/OBU Device"},{"name":"V2X Data interaction protocol"},{"name":"V2X Data Fusion"}]},{"name":"Vehicle voice interaction system"},{"name":"AUTOSAR"}]}]}] */
      }
    },
    computed: Vuex.mapState({
      article: state => {
        state.article.mind = JSON.parse(state.article.content)
        return state.article
      },
      loading: state => state.article.loading,
      isMine() {
        return this.utils.isMine(this.article)
      },
    }),
    mounted () {
      this.fetchData()
    },
    methods: {
      fetchData() {
        // db.getCollection('articles').find({_id: ObjectId("5e9ec647d74e37c7419656b1")})
        this.$store.dispatch('article/getArticle', { id: this.$route.params.id, isAuthed: this.utils.isLogin() })
      },
      submitForm() {
        const data = {
          "title": this.article.title,
          "content": JSON.stringify(this.article.mind),
          "cover": this.article.cover,
          "description": this.article.description,
          "top": this.article.top,
          "type": this.article.type,
          "editor": this.article.editor,
          "status": this.article.status,
          "isRePub": this.article.isRePub,
          "tags": this.article.tags,
          "reprint_url": this.article.reprint_url,
        }
        console.log(data)
        let ret = {}
        //let id = "5e9ec647d74e37c7419656b1"
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
              router.push('/mind/' + id)
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
      }
    },
    watch: {
      '$route'(to, from) {
        this.fetchData()
      }
    }
  }
</script>
