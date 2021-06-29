<template>
  <div id="alarmChart" class="alarmChart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      option: {
        title: {
          text: "能量系统告警占比",
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          top: "13%",
          left: "center"
        },
        textStyle: {
          fontFamily: 'PiHuiTi'
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "60%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "16",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: "搜索引擎" },
              { value: 735, name: "直接访问" },
              { value: 580, name: "邮件营销" },
              { value: 484, name: "联盟广告" },
              { value: 300, name: "视频广告" }
            ]
          }
        ]
      },
      myChart: null
    };
  },
  props: {
    chartData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    chartData(val) {
      this.initData(val);
    }
  },
  methods: {
    initData(val) {
      if (val.length) {
        val.forEach(e => {
          if (e.alarmtype === "1001") {
            e.types = "逆变器";
          } else if (e.alarmtype === "1002") {
            e.types = "电池系统";
          } else if (e.alarmtype === "1003") {
            e.types = "电表";
          } else if (e.alarmtype === "1004") {
            e.types = "环境";
          } else if (e.alarmtype === "1005") {
            e.types = "消防";
          } else if (e.alarmtype === "1006") {
            e.types = "门禁";
          } else {
            e.types = e.alarmtype;
          }
        });
        this.option.series[0].data = [];
        val.forEach(k => {
          this.option.series[0].data.push({
            value: k.alarmsum,
            name: k.types
          });
        });
        this.myChart = echarts.init(
          document.getElementById("alarmChart"),
          null,
          { type: "svg" }
        );
        this.myChart.setOption(this.option, true);
      }
    }
  }
};
</script>

<style lang="scss" scoepd>
.alarmChart {
  // height: 250px;
  height: 100%;
  width: 100%;
}
</style>
