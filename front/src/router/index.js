import Hello from '@/views/Hello'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'Index',
        component: function(resolve) {
            require(['@/views/Index'], resolve)
        }
    }, {
        path: '/timelines',
        name: 'Timelines',
        component: function(resolve) {
            require(['@/views/Timelines'], resolve)
        }
    }, {
        path: '/timeline/:id',
        name: 'timeline',
        component: function(resolve) {
            require(['@/views/Timeline'], resolve)
        }
    }, {
        path: '/private',
        name: 'PrivateArticle',
        component: function(resolve) {
            require(['@/views/PrivateArticle'], resolve)
        }
    },  {
        path: '/like',
        name: 'LikeArticles',
        component: function(resolve) {
            require(['@/views/LikeArticles'], resolve)
        }
    }, {
        path: '/article/:id',
        name: 'article',
        component: function(resolve) {
            require(['@/views/Article'], resolve)
        }
    }, {
        path: '/user/:id',
        name: 'user',
        component: function(resolve) {
            require(['@/views/User'], resolve)
        }
    },  {
        path: '/tags',
        name: 'tags',
        component: function(resolve) {
            require(['@/views/Tags'], resolve)
        }
    }, {
        path: '/about',
        name: 'about',
        component: function(resolve) {
            require(['@/views/About'], resolve)
        }
    }, {
        path: '/albums',
        name: 'Albums',
        component: function(resolve) {
            require(['@/views/Albums'], resolve)
        }
    }, {
        path: '/album/:id',
        name: 'Album',
        component: function(resolve) {
            require(['@/views/Album'], resolve)
        }
    }, {
        path: '/hello',
        name: 'Hello',
        component: Hello
    }, {
        path: '/search',
        name: 'Search',
        component: function(resolve) {
            require(['@/views/Search'], resolve)
        }
    }, {
        path: '/search1',
        name: 'Search',
        component: function(resolve) {
            require(['@/views/Search1'], resolve)
        }
    }, {
        path: '/search2',
        name: 'Search',
        component: function(resolve) {
            require(['@/views/Search2'], resolve)
        }
    }, {
        path: '/post_timeline/add',
        name: 'addtimeline',
        component: function(resolve) {
            require(['@/views/AddTimeline'], resolve)
        }
    }, {
        path: '/post_timeline/edit/:id?',
        name: 'updatetimeline',
        component: function(resolve) {
            require(['@/views/UpdateTimeline'], resolve)
        }
    }, {
        path: '/post/add',
        name: 'addarticle',
        component: function(resolve) {
            require(['@/views/AddArticle'], resolve)
        },
        // meta: {
        //   requiresAuth: true
        // }
    }, {
        path: '/post/add1',
        name: 'addarticle1',
        component: function(resolve) {
            require(['@/views/AddArticle1'], resolve)
        }
    }, {
        path: '/post/edit/:id?',
        name: 'editarticle',
        component: function(resolve) {
            require(['@/views/EditArticle'], resolve)
        },
        // meta: {
        //   requiresAuth: true
        // }
    }, {
        path: '/post/edit1/:id?',
        name: 'editarticle1',
        component: function(resolve) {
            require(['@/views/EditArticle1'], resolve)
        },
        // meta: {
        //   requiresAuth: true
        // }
    }, {
        path: '/login',
        name: 'login',
        component: function(resolve) {
            require(['@/views/Login'], resolve)
        }
    }, {
        path: '/register',
        name: 'register',
        component: function(resolve) {
            require(['@/views/Register'], resolve)
        }
    }, {
        path: '/map',
        name: 'map',
        component: function(resolve) {
            require(['@/views/Map'], resolve)
        }
    }, {
      path: '/home',
      name: 'home',
      component: function (resolve) {
        require(['@/views/pages/Index'], resolve)
      }
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
