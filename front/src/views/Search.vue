<template lang="html">
  <div class="">
    <header>
      <vNav></vNav>
      <div class="img-wrap">
        <img :src="imgSrc" />
      </div>
      <div class="text-wrap">
        <h1 class="shaddow">{{headline}}</h1>
        <p class="shadow-light">{{subline}}</p>
        <br/>
        <iframe src="https://www.hicool.top/libertyblog-search/search.php" width="1180" height="580" frameborder=0 scrolling=auto></iframe>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: 'Search',
  components: {
    'vNav': () => import('./components/Nav.vue'),
  },
  data() {
    return {
      headline: 'Hicool Search', // 用户名
      subline: 'The thought of independence and freedom.', // 副标题
      value: '',
      suggestionAttribute: 'original_title',
      suggestions: [],
      selectedEvent: ""
    }
  },
  computed: Vuex.mapState({
    imgSrc: state => state.tip.cover,
  }),
  created() {

  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$store.dispatch('tip/getTipIndex')
    },
    clickInput () {
      this.selectedEvent = 'click input'
    },
    clickButton () {
      this.selectedEvent = 'click button'
    },
    selected () {
      this.selectedEvent = 'selection changed'
    },
    enter () {
      this.selectedEvent = 'enter'
    },
    keyUp: function() {
      this.selectedEvent = 'keyup pressed'
    },
    keyDown: function() {
      this.selectedEvent = 'keyDown pressed'
    },
    keyRight: function() {
      this.selectedEvent = 'keyRight pressed'
    },
    clear: function() {
      this.selectedEvent = 'clear input'
    },
    escape: function() {
      this.selectedEvent = 'escape'
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/components/header.scss';
</style>
