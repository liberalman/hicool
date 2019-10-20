<template>
  <div>
    <ul :class="['nav', { 'nav-fixed': !isTop, 'nav-invisible': !isVisible }]">
      <li>
        <router-link class="item" :to="{name: 'Index'}">主页</router-link>
      </li>
      <li>
        <router-link class="item" :to="{name: 'Search'}">搜索</router-link>
      </li>
      <li>
        <router-link class="item" :to="{name: 'tags'}">标签</router-link>
      </li>
      <li>
        <el-dropdown class="item">
          <span class="el-dropdown-link">发布</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link class="item" :to="{name: 'addarticle1'}">富文本编辑器</router-link>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <router-link class="item" :to="{name: 'addarticle'}">markdown 编辑器</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li>
        <router-link class="item" :to="{path: '/user/me'}"><avatar :src="avatar" :size="25"></avatar></router-link>
      </li>
      <li v-if="!isLogin">
        <router-link class="item" :to="{name: 'login'}">登录</router-link>
      </li>
      <li v-else>
        <el-dropdown class="item" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link class="item" :to="{path:'/albums'}">相册</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link class="item" :to="{path:'/map'}">map</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link class="item" :to="{path:'/user/me'}">个人详情</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link class="item" :to="{name: 'PrivateArticle'}">私文</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link class="item" :to="{name: 'Checklist'}">Checklist</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link class="item" :to="{path:'/like'}">我的收藏</router-link>
            </el-dropdown-item>
            <el-dropdown-item disabled>设置</el-dropdown-item>
            <el-dropdown-item>
              <router-link class="item" :to="{name: 'Timelines'}">时间轴</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link class="item" :to="{name: 'Fitness'}">Fitness</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link class="item" :to="{name: 'about'}">关于</router-link>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
    <goTop></goTop>
  </div>
</template>

<script>
import router from '../../router'
import Avatar from 'vue-avatar'
export default {
  inject: ['reload'],
  components: {
    'goTop': () =>
      import('./goTop.vue'),
    'avatar': Avatar,
  },
  data() {
    return {
      username: this.utils.getCookie('username'),
      avatar: this.utils.getCookie('avatar') ? this.utils.getCookie('avatar') : '../../static/img/avatar@3x.png',
      nav: 'nav',
      isTop: true,
      isVisible: true
    }
  },
  created() {
    this.scroll()
  },
  computed: {
    isLogin() {
      return this.utils.isLogin()
    }
  },
  methods: {
    scroll() {
      let beforeScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      window.onscroll = () => {
        const afterScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        const delta = afterScrollTop - beforeScrollTop
        this.isTop = afterScrollTop === 0
        if(delta === 0) return false
        beforeScrollTop = afterScrollTop
        this.isVisible = delta <= 0
        if(afterScrollTop < 48) {
          this.isVisible = true
        }
      }
    },
    handleCommand(command) {
      switch(command) {
        case 'logout':
          {
            this.$store.dispatch('user/logout')
            //移除cookie
            this.utils.removeCookie('username')
            this.utils.removeCookie('email')
            this.utils.removeCookie('token')
            this.utils.removeCookie('avatar')
            this.$message({
              message: '登出成功!',
              type: 'success'
            })
            setTimeout(() => {
              this.reload()
            }, 400)
            break;
          }
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/scss/components/nav.scss';
</style>
