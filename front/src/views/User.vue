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
          <el-card :body-style="{ padding: '0px' }">
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
      <el-collapse>
        <!--
        <el-collapse-item title="修改头像">
          <Avatar></Avatar>
        </el-collapse-item>
        -->
        <el-collapse-item title="修改头像">
          <AvatarQiniu></AvatarQiniu>
        </el-collapse-item>
      </el-collapse>

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
    computed: Vuex.mapState({
      user: state => state.user
    }),
    created() {
      this.$store.dispatch('user/getUser', this.$route.params.id)
    },
    beforeDestroy() {
      this.$store.dispatch('clearUser')
    },
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
