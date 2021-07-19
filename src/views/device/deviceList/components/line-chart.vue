<template>
  <div class="line-chart-wrapper">
    <!-- {{ loadChart }} -->
    <div id="main"></div>
    <div class="no-data" v-show="!loadChart.length">暂无数据...</div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis'
        },
        color: ['#FF0000', '#2E8B57', '#0000FF'],
        legend: {
          data: ['负载电表曲线', '储能pcs曲线', '配变供电曲线']
        },
        textStyle: {
          fontFamily: 'PiHuiTi'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '45',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          name: '功率(kw)',
          type: 'value'
        },
        series: [
          {
            name: '负载电表曲线',
            type: 'line',
            // stack: '总量',
            data: []
          },
          {
            name: '储能pcs曲线',
            type: 'line',
            // stack: '总量',
            data: []
          },
          {
            name: '配变供电曲线',
            type: 'line',
            // stack: '总量',
            data: []
          }
        ],
        dataZoom: [
          {
            show: true,
            // realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: [0, 1]
          },
          {
            type: 'inside',
            // realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: [0, 1]
          }
        ]
      },
      myChart: null
    };
  },
  props: {
    loadChart: {
      type: Array,
      default: () => {
        return [];
      }
    },
    peakChart: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    loadChart(val) {
      this.draw(this.loadChart, this.peakChart);
    }
  },
  methods: {
    draw(loadChart, peakChart) {
      this.option.xAxis.data = [];
      this.option.series[0].data = [];
      this.option.series[1].data = [];
      this.option.series[2].data = [];
      loadChart.forEach(k => {
        this.option.xAxis.data.push(
          dayjs(k[0] * 1000 - 8 * 3600 * 1000).format('MM/DD HH:mm')
        );
        this.option.series[0].data.push(k[1].toFixed(2));
      });
      peakChart.forEach((e, idx) => {
        this.option.series[1].data.push(e[1].toFixed(2));
        this.option.series[2].data.push((loadChart[idx][1] - e[1]).toFixed(2));
      });
      this.myChart = echarts.init(document.getElementById('main'), null, {
        renderer: 'svg'
      });
      this.myChart.setOption(this.option, true);
    },
    resizeHandler() {
      setTimeout(() => {
        this.myChart.resize();
      }, 300);
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler);
  }
};
</script>

<style lang="scss" scoped>
.line-chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  #main {
    height: 100%;
    width: 100%;
  }
  .no-data {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    background-color: #fff;
  }
}
</style>
