<template lang="html">
  <div>
    <header class="a-header" :style="{background: 'url('+ (fitness.cover ? fitness.cover : 'http://image.hicool.top/static/album/5ac0a43f7c0636267ed49b91/1503658700339782278.jpg') +')' + 'center center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
      <div class="text-wrap">
        <h3 class="shadow">{{fitness.title}}</h3>
        <p class="shadow-light">{{fitness.description}}</p>
      </div>
    </header>
    <div class="fitness-wrapper" style="margin: 2em auto;">
      <div id="chartLineBox" style="height: 70vh;"> </div>
      <div id="chartLineBox1" style="width: 90%;height: 70vh;"> </div>
    </div>
    <CopyRight />
  </div>
</template>

<script>
  import router from '../router'
  import Avatar from 'vue-avatar'
  import echarts from 'echarts'

  export default {
    props: ['headline', 'subline', 'mySrc'],
    components: {
      'CopyRight': () =>
        import('./components/CopyRight.vue'),
      'vNav': () =>
        import('./components/Nav.vue'),
      'avatar' : Avatar,
    },
    data(){
      return {
        page: 1,
        size: 10
      }
    },
    computed: Vuex.mapState({
      fitness: state => state.fitness,
      list: state => state.fitnesses.list,
      total: state => state.fitnesses.total
    }),
    mounted () {
      this.fetchData()
      this.draw()
    },
    methods: {
      draw() {
        console.log(this.list)
        let xdata = []
        let ydata = []
        for (let i = 0; i < this.list.length; i++) {
          xdata.push(this.list[i].examination_time.substring(0, 10))
          ydata.push(this.list[i].weight.current)
        }
        this.chartLine = echarts.init(document.getElementById('chartLineBox'));

        // 指定图表的配置项和数据
        var option = {
            tooltip: {              //设置tip提示
                trigger: 'axis'
            },

            legend: {               //设置区分（哪条线属于什么）
                data:['上限','下限','Weight']
            },
            color: ['#8AE09F', '#FA6F53'],       //设置区分（每条线是什么颜色，和 legend 一一对应）
            xAxis: {                //设置x轴
                type: 'category',
                boundaryGap: false,     //坐标轴两边不留白
                //data: ['2019-1-1', '2019-2-1', '2019-3-1', '2019-4-1', '2019-5-1', '2019-6-1', '2019-7-1',],
                data: xdata,
                name: 'Date',           //X轴 name
                nameTextStyle: {        //坐标轴名称的文字样式
                    color: '#FA6F53',
                    fontSize: 16,
                    padding: [0, 0, 0, 20]
                },
                axisLine: {             //坐标轴轴线相关设置。
                    lineStyle: {
                        color: '#FA6F53',
                    }
                }
            },
            yAxis: {
                name: 'Weight',
                nameTextStyle: {
                    color: '#FA6F53',
                    fontSize: 16,
                    padding: [0, 0, 10, 0]
                },
                axisLine: {
                    lineStyle: {
                        color: '#FA6F53',
                    }
                },
                type: 'value'
            },
            series: [
              {
                name: '上限',
                data:  [71.4, 71.4, 71.4, 71.4, 71.4, 71.4, 71.4],
                type: 'line',               // 类型为折线图
                smooth:false,   //关键点，为true是不支持虚线，实线就用true
                lineStyle: {                // 线条样式 => 必须使用normal属性
                    normal: {
                        color: '#0AE99F',
                        type:'dotted'  //'dotted'虚线 'solid'实线
                    }
                },
              },
              {
                name: '下限',
                data:  [52.8, 52.8, 52.8, 52.8, 52.8, 52.8, 52.8],
                type: 'line',               // 类型为折线图
                smooth:false,   //关键点，为true是不支持虚线，实线就用true
                lineStyle: {                // 线条样式 => 必须使用normal属性
                    normal: {
                        color: '#8AE090',
                        type:'dotted'  //'dotted'虚线 'solid'实线
                    }
                },
              },
              {
                name: 'Weight',
                //data: [120, 200, 150, 80, 70, 110, 130],
                data:  ydata,
                type: 'line',
                lineStyle: {
                    normal: {
                        color: '#FA6F53',
                    }
                },
              }
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        this.chartLine.setOption(option);
      },
      fetchData() {
        this.$store.dispatch('fitnesses/getFitnesses', { page: this.page, size: this.size })
      },
    },
  }
</script>

<style lang="scss">
  @import '../assets/scss/article.scss';
  @import '../assets/scss/components/header.scss';
</style>
