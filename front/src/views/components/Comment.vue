<template>
  <div class="comment">
    <!--回复输入栏-->
    <h1>回复</h1>
    <div class="comment-form">
      <el-input class="form-content" type="textarea" :rows="8" :cols="30" placeholder="欢迎发表你的评论-……-" v-model="inputComment"></el-input>
      <div class="comment-reply">
        <a @click="commitComment()" class="reply reply-submit">提交</a>
      </div>
    </div>
    <div class="container">
      <div class="comment" v-for="item in list" :key="item.articleId">
        <div class="info">
          <img class="avatar" :src="item.userId.avatar" width="36" height="36" />
          <div class="right">
            <div class="name">{{item.userId.nickname}}</div>
            <div class="date">{{item.created | handleDateFormat}}</div>
          </div>
        </div>
        <div class="content">{{item.content}}</div>
        <div class="control">
          <span class="like" :class="{active: item.likeNum}" @click="likeClick(item)">
            <i class="iconfont icon-like"></i>
            <span class="like-num">{{item.likeNum > 0 ? item.likeNum + '人赞' : '赞'}}</span>
          </span>
          <span class="comment-reply" @click="showReplyInput(item)">
            <i class="iconfont icon-comment"></i>
            <span>回复</span>
          </span>
          &nbsp;
          <span class="comment-reply" @click="deleteCommentConfirm(item._id)">
            <i class="iconfont icon-comment"></i>
            <span>删除</span>
          </span>
        </div>
        <div class="reply">
          <div class="item" v-for="reply in item.replys">
            <div class="reply-content">
              <span class="from-name">{{reply.fromUserId.nickname}}</span><span>: </span>
              <span class="to-name">@{{reply.toUserId.nickname}}</span>
              <span>{{reply.content}}</span>
            </div>
            <div class="reply-bottom">
              <span>{{reply.created | handleDateFormat}}</span>
              <span class="reply-text" @click="showReplyInput(item)">
                <i class="iconfont icon-comment"></i>
                <span>回复</span>
              </span>
              <span class="reply-text" @click="deleteReplyConfirm(item._id, reply._id)">
                <i class="iconfont icon-comment"></i>
                <span>删除</span>
              </span>
            </div>
          </div>
          <transition name="fade">
            <div class="input-wrapper" v-if="showReplyItemId === item._id">
              <el-input class="gray-bg-input" v-model="inputReply" type="textarea" :rows="3" autofocus placeholder="写下你的评论">
              </el-input>
              <div class="btn-control">
                <span class="cancel" @click="cancelReply">取消</span>
                <el-button class="btn" type="success" round @click="commitReply(item._id)">确定</el-button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        inputComment: '',
        showItemId: '',

        showReplyItemId: '',
        inputReply: '',

        replyId: '',
        formUserId: '',
        toUserId: '',
        articleId: this.$route.params.id,
      }
    },
    created() {
      this.$store.dispatch('comments/getComments', this.articleId)
    },
    computed: {
      list() {
        return [].slice.call(this.$store.state.comments.list).map((item, index, arr) => {
          //console.log(item)
          return item
        })
      }
    },
    methods: {
      alertWarn(msg) {
        this.$message({
          message: msg,
          type: 'warning'
        });
      },
      /**
       * 点赞
       */
      likeClick(item) {
        if(item.isLike === null) {
          Vue.$set(item, "isLike", true);
          item.likeNum++
        } else {
          if(item.isLike) {
            item.likeNum--
          } else {
            item.likeNum++
          }
          item.isLike = !item.isLike;
        }
      },
      ///////////////////////////// Comment /////////////////////////////
      /**
       * 提交评论
       */
      commitComment() {
        if(!this.inputComment.trim()) {
          this.alertWarn('内容不可为空!');
          return
        }
        let _this = this

        //是回复本文
        this.$store.dispatch('comments/create', { articleId: this.articleId, content: this.inputComment })
          .then(res => {
            _this.inputComment = ''
            _this.fromUserId = ''
            _this.$store.dispatch('comments/getComments', _this.articleId)
            _this.$message({
              message: '感谢您的宝贵评论!',
              type: 'success'
            });
          })
          /*.catch(error => {
            _this.alertWarn(error.response.data.message + " " + error.response.status);
          })*/
          .catch((error) => { // 这里的error，输出的是个string类型
            _this.$message({
              message: error,
              type: 'warning'
            });
          })
      },
      /**
       * 点击取消按钮
       */
      cancel() {
        this.showItemId = ''
      },
      deleteCommentConfirm(commentId) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _this = this
          this.$store.dispatch('comments/delete', commentId)
          .then(res => {
            _this.$store.dispatch('comments/getComments', _this.articleId)
            _this.$message({
              message: '已删除!',
              type: 'success'
            });
          })
          .catch((error) => { // 这里的error，输出的是个string类型
            _this.$message({
              message: error,
              type: 'warning'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      ///////////////////////////// Reply /////////////////////////////
      deleteReplyConfirm(commentId, replyId) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _this = this
          this.$store.dispatch('comments/deleteReply', { commentId: commentId, replyId: replyId })
          .then(res => {
            _this.$store.dispatch('comments/getComments', _this.articleId)
            _this.$message({
              message: '已删除!',
              type: 'success'
            });
          })
          .catch((error) => { // 这里的error，输出的是个string类型
            _this.$message({
              message: error,
              type: 'warning'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /**
       * 点击回复按钮显示输入框
       * item: 当前大评论
       * reply: 当前回复的评论
       */
      showReplyInput(item) {
        this.inputReplay = "@" + item.userId.nickname + " "
        this.replyId = item._id
        this.toUserId = item.userId._id
        this.showReplyItemId = item._id
      },
      /**
       * 提交回复
       */
      commitReply(commentId) {
        if(!this.inputReply.trim()) {
          this.alertWarn('内容不可为空!');
          return
        }
        let _this = this
        //是回复某个评论
        const replyData = {
          "commentId": commentId,
          "content": this.inputReply,
          "toUserId": this.toUserId,
        }
        this.$store.dispatch('comments/createReply', replyData)
          .then(res => {
            _this.inputReply = ''
            _this.replyId = ''
            _this.fromUserId = ''
            _this.showReplyItemId = ''
            _this.$store.dispatch('comments/getComments', _this.articleId)
            _this.$message({
              message: '成功!',
              type: 'success'
            });
          })
          .catch((error) => { // 这里的error，输出的是个string类型
            _this.$message({
              message: error,
              type: 'warning'
            });
          })
      },
      /**
       * 点击取消按钮
       */
      cancelReply() {
        this.showReplyItemId = ''
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/scss/predefine.scss";
  @import '../../assets/scss/components/comment.scss';
</style>
