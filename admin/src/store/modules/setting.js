export default {
  namespaced: true,
  state: {
    isMobile: false,
    theme: 'dark',
    layout: 'side',
    systemName: 'Hicool Admin',
    copyright: '2019 Liberalman出品',
    footerLinks: [
      { link: 'https://pro.ant.design', name: 'Pro首页' },
      { link: 'https://github.com/iczer/vue-antd-admin', icon: 'github' },
      { link: 'https://ant.design', name: 'Ant Design' },
      { link: 'http://www.beian.miit.gov.cn/', name: '京ICP备16013925号-2' }
    ],
    multipage: true
  },
  mutations: {
    setDevice (state, isMobile) {
      state.isMobile = isMobile
    },
    setTheme (state, theme) {
      state.theme = theme
    },
    setLayout (state, layout) {
      state.layout = layout
    },
    setMultipage (state, multipage) {
      state.multipage = multipage
    }
  }
}
