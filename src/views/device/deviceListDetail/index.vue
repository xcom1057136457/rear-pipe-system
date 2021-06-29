<template>
  <div class="detail-wrapper" v-loading="loading">
    <table>
      <tr>
        <td class="label">设备编码</td>
        <td>{{ detailInfo.deviceCode }}</td>
        <td class="label">设备名称</td>
        <td>{{ detailInfo.deviceName }}</td>
        <td class="label">设备SN码</td>
        <td>{{ detailInfo.sn }}</td>
      </tr>

      <tr>
        <td class="label">所属产品</td>
        <td>{{ detailInfo.deviceTypeName }}</td>
        <td class="label">设备专责</td>
        <td>{{ detailInfo.equipSpecialist }}</td>
        <td class="label">IEME卡号</td>
        <td>{{ detailInfo.ieme }}</td>
      </tr>

      <tr>
        <td class="label">安装位置</td>
        <td>{{ detailInfo.installPosition }}</td>
        <td class="label">联系厂家</td>
        <td>{{ detailInfo.manufactor }}</td>
        <td class="label">电网专责</td>
        <td>{{ detailInfo.powergridSpecialist }}</td>
      </tr>

      <tr>
        <td class="label">备注</td>
        <td colspan="5">{{ detailInfo.remark }}</td>
      </tr>
    </table>

    <!-- 设备不是EMS设备时 -->
    <template v-if="deviceData && deviceType == 0">
      <!-- S 设备实时数据 -->
      <div class="top-title">设备实时数据</div>
      <div class="deivice-data">
        <el-row>
          <el-col
            :span="8"
            v-for="(value, key, index) in deviceData"
            :key="index"
          >
            <span for="" class="label">{{ key + "：" }}</span>
            <span>{{ value }}</span>
          </el-col>
        </el-row>
      </div>
      <!-- E 设备实时数据 -->
    </template>
    <!-- 设备不是EMS设备时 -->

    <!-- 设备是EMS设备时 -->
    <template v-if="loadChart && peakChart && deviceType == 1">
      <div class="top-title">24小时储能功率曲线</div>
      <div class="chart-wrapper">
        <line-chart :loadChart="loadChart" :peakChart="peakChart"></line-chart>
      </div>
    </template>
    <!-- 设备是EMS设备时 -->

    <div class="back-bar">
      <el-button size="small" type="primary" @click="() => { $router.back() }">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getDeiveDetail } from "@/api/monitor/device";
import lineChart from "../deviceList/components/line-chart.vue";
export default {
  data() {
    return {
      dialogVisible: false,
      detailInfo: {},
      loading: false,
      deviceData: null,
      deviceType: 0,
      loadChart: [],
      peakChart: []
    };
  },
  components: {
    lineChart
  },
  created() {
    this.getDetailInfo();
  },
  methods: {
    getDetailInfo() {
      this.loading = true;
      getDeiveDetail({
        deviceId: this.$route.query.deviceId
      })
        .then(res => {
          if (res.code == 200) {
            this.detailInfo = res.data;
            let deviceData = null;
            res.data.deviceData
              ? (deviceData = JSON.parse(res.data.deviceData))
              : (deviceData = null);
            if (deviceData && !deviceData.loadChart) {
              this.deviceData = deviceData;
              this.deviceType = 0;
            } else if (deviceData && deviceData.loadChart) {
              this.deviceData = null;
              this.$nextTick(() => {
                this.loadChart = deviceData.loadChart;
                this.peakChart = deviceData.peakChart;
              });
              this.deviceType = 1;
            } else {
              this.deviceData = null;
            }
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-wrapper {
  padding: 20px;
  padding-bottom: 50px;
  position: relative;
  min-height: calc(100vh - 84px);
}

table {
  width: 100%;
  border-left: 1px solid #dedede;
  border-bottom: 1px solid #dedede;
  border-collapse: collapse;
  tr > td {
    border-top: 1px solid #dedede;
    border-right: 1px solid #dedede;
    padding: 10px 0 10px 10px;
  }
}

.label {
  background-color: #f0f0f0;
  width: 180px;
}

.top-title {
  font-size: 16px;
  margin: 10px 0;
  font-weight: bold;
}

.deivice-data {
  border-left: 1px solid #dedede;
  border-top: 1px solid #dedede;
  > .el-row {
    > .el-col {
      line-height: 40px;
      display: flex;
      border-right: 1px solid #dedede;
      border-bottom: 1px solid #dedede;
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        padding: 0 10px;
        &:last-child {
          flex: 1;
        }
      }
    }
  }
}

.chart-wrapper {
  height: 350px;
  width: 100%;
}

.back-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: right;
  line-height: 50px;
  padding: 0 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
</style>
