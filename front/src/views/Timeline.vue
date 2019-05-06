<template lang="html">
  <div v-loading.fullscreen.lock="loading">
    <header class="a-header" :style="{background: 'url('+ (timeline.cover ? timeline.cover : 'http://image.hicool.top/static/album/5ac0a43f7c0636267ed49b91/1503658700339782278.jpg') +')' + 'center center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
      <div class="text-wrap">
        <h2 class="shaddow">{{timeline.title}}</h2>
        <p class="shadow-light">{{timeline.description}}</p>
      </div>
    </header>
    <div class="article-wrapper" style="margin: 2em auto;">
      <div class="create">
        {{timeline.publish_time | handleDateFormat}}
        <el-button :disabled="!isMine" @click="editTimeline()" type="text"><i class="el-icon-edit"></i></el-button>
        <el-button :disabled="!isMine" @click="deleteTimeline()" type="text"><i class="el-icon-delete"></i></el-button>
      </div>
      <div class="content">
      <el-timeline>
        <el-timeline-item>
          <el-card>
            <el-button @click="showAddPoint()">add</el-button>
          </el-card>
        </el-timeline-item>
        <el-timeline-item
          v-for="(activity, index) in timeline.points"
          placement="top"
          :key="_id"
          :timestamp="activity.publish_time | handleDateFormat">
          <el-card>
            <h4>{{activity.title}}</h4>
            <p>{{activity.content}}</p>
            <el-button :disabled="!isMine" @click="showEditPoint(activity)" type="text"><i class="el-icon-edit"></i></el-button>
            <el-button :disabled="!isMine" @click="deletePoint(activity._id)" type="text"><i class="el-icon-delete"></i></el-button>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-divider></el-divider>
      </div>
    </div>
    <CopyRight />
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="point">
        <el-form-item label="名称">
          <el-input v-model="point.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="point.content" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="point.publish_time"
            type="datetime"
            placeholder="选择时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddPoint()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import router from '../router'

  export default {
    props: ['headline', 'subline', 'mySrc'],
    components: {
      'Comment': () =>
        import('./components/Comment.vue'),
      'CopyRight': () =>
        import('./components/CopyRight.vue'),
      'vNav': () =>
        import('./components/Nav.vue'),
    },
    data(){
      return {
        dialogVisible: false,
        point: {
          _id: '',
          title: '',
          timeline_id: this.$route.params.id,
          content: '',
          publish_time: ''
        }
      }
    },
    computed: Vuex.mapState({
      timeline: state => state.timeline,
      loading: state => state.timeline.loading,
      isMine() {
        return this.utils.isMine(this.timeline)
      },
    }),
    mounted () {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.$store.dispatch('timeline/getTimeline', { id: this.$route.params.id, isAuthed: this.utils.isLogin() })
      },
      deleteTimeline() {
        this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          this.$store.dispatch('timeline/delete', this.$route.params.id)
            .then(function(response) {
                _this.$message({
                  message: '操作成功!',
                  type: 'success'
                })
                router.push('/timelines')
              })
              .catch(error => { // 这里的error返回的是个string类型
                _this.$message({
                  message: error,
                  type: 'error'
                });
              })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      editTimeline() {
        router.push('/post_timeline/edit/' + this.$route.params.id)
      },
      showEditPoint(data) {
        this.point.publish_time = data.publish_time
        this.point.content = data.content
        this.point.title = data.title
        this.point._id = data._id
        this.dialogVisible = true
      },
      showAddPoint() {
        this.clear()
        delete this.point._id
        this.dialogVisible = true
      },
      deletePoint(pointId) {
        this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          this.$store.dispatch('timeline/deletePoint', { timelineId: this.point.timeline_id, pointId: pointId })
            .then(function(response) {
                _this.$message({
                  message: '操作成功!',
                  type: 'success'
                })
                router.push(`/timeline/${_this.point.timeline_id}`)
              })
              .catch(error => { // 这里的error返回的是个string类型
                _this.$message({
                  message: error,
                  type: 'error'
                });
              })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleClose(done) {
        /*this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});*/
        this.dialogVisible = false
      },
      handleAddPoint() {
        var _this = this
        var method = 'timeline/createPoint'
        if (this.point._id && this.point._id !== '') {
          method = 'timeline/updatePoint'
        }
        this.$store.dispatch(method, this.point)
          .then(function(response) {
              _this.$message({
                message: '操作成功!',
                type: 'success'
              })
            })
            .catch(error => { // 这里的error返回的是个string类型
              _this.$message({
                message: error,
                type: 'error'
              });
            })
        this.dialogVisible = false
      },
      clear() {
        this.point._id = ''
        this.point.publish_time = ''
        this.point.content = ''
        this.point.title = ''
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/scss/article.scss';
  @import '../assets/scss/components/header.scss';
</style>
