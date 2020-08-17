
if (!window.VueRouter) Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'Index',
        component: () => import('@/views/Index')
    }, {
        path: '/index/:page/:size',
        name: 'Index1',
        component: () => import('@/views/Index1')
    }, {
        path: '/timelines',
        name: 'Timelines',
        component: () => import('@/views/Timelines')
    }, {
        path: '/timeline/:id',
        name: 'timeline',
        component: () => import('@/views/Timeline')
    }, {
        path: '/private',
        name: 'PrivateArticle',
        component: () => import('@/views/PrivateArticle')
    },  {
        path: '/like',
        name: 'LikeArticles',
        component: () => import('@/views/LikeArticles')
    }, {
        path: '/article/:id',
        name: 'article',
        component: () => import('@/views/Article')
    }, {
        path: '/user/:id',
        name: 'user',
        component: () => import('@/views/User')
    },  {
        path: '/tags',
        name: 'tags',
        component: () => import('@/views/Tags')
    }, {
        path: '/tags/:tag_id/:page/:size',
        name: 'tags',
        component: () => import('@/views/Tags')
    }, {
        path: '/about',
        name: 'about',
        component: () => import('@/views/About')
    }, {
        path: '/albums',
        name: 'Albums',
        component: () => import('@/views/Albums')
    }, {
        path: '/album/:id',
        name: 'Album',
        component: () => import('@/views/Album')
    }, {
        path: '/hello',
        name: 'Hello',
        component: () => import('@/views/Hello')
    }, {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/Search')
    }, {
        path: '/search1',
        name: 'Search1',
        component: () => import('@/views/Search1')
    }, {
        path: '/search2',
        name: 'Search2',
        component: () => import('@/views/Search2')
    }, {
        path: '/search3',
        name: 'Search3',
        component: () => import('@/views/Search3')
    }, {
        path: '/post_timeline/add',
        name: 'addtimeline',
        component: () => import('@/views/AddTimeline')
    }, {
        path: '/post_timeline/edit/:id?',
        name: 'updatetimeline',
        component: () => import('@/views/UpdateTimeline')
    }, {
        path: '/post/add',
        name: 'addarticle',
        component: () => import('@/views/AddArticle')
        // meta: {
        //   requiresAuth: true
        // }
    }, {
        path: '/post/add1',
        name: 'addarticle1',
        component: () => import('@/views/AddArticle1')
    }, {
        path: '/post/edit/:id?',
        name: 'editarticle',
        component: () => import('@/views/EditArticle')
        // meta: {
        //   requiresAuth: true
        // }
    }, {
        path: '/post/edit1/:id?',
        name: 'editarticle1',
        component: () => import('@/views/EditArticle1')
        // meta: {
        //   requiresAuth: true
        // }
    }, {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login')
    }, {
        path: '/register',
        name: 'register',
        component: () => import('@/views/Register')
    }, {
      path: '/home',
      name: 'home',
      component: () => import('@/views/pages/Index')
    }, {
      path: '/test',
      name: 'test',
      component: () => import('@/views/Test')
    }, {
      path: '/checklist',
      name: 'Checklist',
      component: () => import('@/views/Checklist')
    }, {
      path: '/mind/:id',
      name: 'mind',
      component: () => import('@/views/Mind')
    }],

    scrollBehavior(to, from, savedPosition) {
        // return 期望滚动到哪个的位置
        // 路由切换时滚动到顶部
        if (savedPosition) {
            return savedPosition
        } else {
            return {  y: 0 }
        }
    }
})
