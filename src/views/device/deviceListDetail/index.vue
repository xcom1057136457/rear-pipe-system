<template>
  <div class="detail-wrapper" v-loading="loading">
    <div class="top-title">设备信息</div>
    <table style="margin-bottom: 30px">
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

      <template v-if="$route.query.deviceType != 17">
        <tr>
          <td class="label">设备状态</td>
          <td>{{ statusFormatter(detailInfo.status) }}</td>
          <td class="label">备注</td>
          <td colspan="3">{{ detailInfo.remark }}</td>
        </tr>
      </template>

      <template v-if="$route.query.deviceType == 17">
        <tr>
          <td class="label">设备状态</td>
          <td>{{ statusFormatter(detailInfo.status) }}</td>
          <td class="label">经纬度</td>
          <td>
            {{
              "经度: " +
                detailInfo.longitude +
                "°" +
                "，" +
                "纬度: " +
                detailInfo.latitude +
                "°"
            }}
          </td>
          <td class="label">备注</td>
          <td>{{ detailInfo.remark }}</td>
        </tr>
      </template>
    </table>

    <!-- 设备不是EMS设备时 -->
    <template v-if="deviceData && deviceType == 0">
      <!-- S 设备实时数据 -->
      <div class="top-title">设备实时数据</div>
      <div class="deivice-data">
        <el-row :gutter="20">
          <el-col
            :span="6"
            v-for="(value, key, index) in deviceData"
            :key="index"
          >
            <div class="top-item">
              <div class="top-text">{{ labelFormat(key) }}</div>
              <div class="bottom-detail">
                <template v-if="key != 'Switch1'">
                  {{ value || value == "0" ? value : "-" }}
                  <span v-if="!key.indexOf('Temp')">℃</span>
                </template>

                <template v-else>
                  <el-switch
                    v-model="deviceData[key]"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :inactive-text="deviceData[key] == 0 ? '断开' : '闭合'"
                    active-value="1"
                    inactive-value="0"
                    @change="switchChange"
                  >
                  </el-switch>
                </template>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- E 设备实时数据 -->
    </template>
    <!-- 设备不是EMS设备时 -->

    <!-- 设备是EMS设备时 -->
    <template v-if="loadChart && peakChart && deviceType == 1">
      <div class="top-title">
        24小时储能功率曲线
        <span>(数据更新时间: {{ detailInfo.updateTime }})</span>
      </div>
      <div class="chart-wrapper">
        <line-chart :loadChart="loadChart" :peakChart="peakChart"></line-chart>
      </div>
    </template>
    <!-- 设备是EMS设备时 -->

    <div class="back-bar">
      <el-button
        size="small"
        type="primary"
        @click="
          () => {
            $router.back();
          }
        "
        >返回</el-button
      >
    </div>
  </div>
</template>

<script>
import { getDeiveDetail, deviceControl } from "@/api/monitor/device";
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
      peakChart: [],
      deviceStatus: [],
      deviceWordsName: [],
      topDetail: [
        {
          label: "设备编码",
          value: "deviceCode"
        },
        {
          label: "设备名称",
          value: "deviceName"
        },
        {
          label: "所属产品",
          value: "deviceTypeName"
        },
        {
          label: "设备专责",
          value: "equipSpecialist"
        },
        {
          label: "IEME卡号",
          value: "ieme"
        },
        {
          label: "安装位置",
          value: "installPosition"
        },
        {
          label: "联系厂家",
          value: "manufactor"
        },
        {
          label: "电网专责",
          value: "powergridSpecialist"
        },
        {
          label: "设备状态",
          value: "status"
        },
        {
          label: "备注",
          value: "remark"
        }
      ]
    };
  },
  components: {
    lineChart
  },
  created() {
    this.getDeviceStatus();
    this.$nextTick(() => {
      this.getDetailInfo();
    });
  },
  methods: {
    async getDetailInfo() {
      this.loading = true;
      this.$route.query.deviceType != 17 && (await this.getDiceDict());
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
                this.detailInfo.updateTime = deviceData.updatetime;
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
    },
    // 获取设备状态
    async getDeviceStatus() {
      let { code, data } = await this.getDicts("device_status");
      if (code == 200) {
        this.deviceStatus = data.map(item => {
          return {
            value: item.dictValue,
            label: item.dictLabel
          };
        });
      }
    },
    statusFormatter(value) {
      let temp = this.deviceStatus.filter(item => item.value == value);
      return temp.length ? temp[0].label : "";
    },
    // 查设备字段字典
    getDiceDict() {
      return new Promise(resolve => {
        let deviceType = null;
        if (this.$route.query.deviceType == 19) {
          deviceType = "4g4Device_dataFormat";
        } else if (this.$route.query.deviceType == 18) {
          deviceType = "2kwDevice_dataFormat";
        }
        this.getDicts(deviceType).then(res => {
          if (res.code == 200) {
            this.deviceWordsName = res.data.map(item => {
              return {
                value: item.dictValue,
                label: item.dictLabel
              };
            });
          }
          resolve();
        });
      });
    },
    labelFormat(val) {
      let temp = this.deviceWordsName.filter(item => item.value == val);
      return temp.length ? temp.shift().label : val;
    },
    switchChange(val) {
      this.$confirm("此操作将更改开关数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deviceControl({
            item: "Switch1",
            productKey: this.detailInfo.productKey,
            sn: this.detailInfo.sn,
            val
          })
            .then(res => {
              if (res.code == 200) {
                this.$message.success("修改成功!");
                // this.getDetailInfo();
              }
            })
            .catch(() => {
              this.deviceData["Switch1"] = val == "0" ? "1" : "0";
            });
        })
        .catch(() => {
          this.deviceData["Switch1"] = val == "0" ? "1" : "0";
          this.$message.info("已取消修改!");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-wrapper {
  padding: 20px;
  position: relative;
  margin-bottom: 50px;
}

::v-deep .el-switch__label {
  &.is-active {
    color: black;
  }
  font-weight: bold;
  font-size: 16px;
}

.el-row {
  display: flex;
  flex-wrap: wrap;
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
    font-size: 14px;
  }
}

.label {
  background-color: #f0f0f0;
  width: 180px;
  color: #666;
}

.top-title {
  font-size: 18px;
  margin: 10px 0;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid #dedede;
  display: flex;
  align-items: flex-end;
  > span {
    font-size: 14px;
    color: #666;
    margin-left: 10px;
    font-weight: normal;
  }
}

.chart-wrapper {
  height: 350px;
  width: 100%;
}

.back-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: right;
  line-height: 50px;
  padding: 0 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.top-item {
  padding: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
  transition-property: all;
  transition-duration: 0.2s;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  > div {
    &:first-child {
      margin-bottom: 10px;
      font-size: 14px;
      color: #666;
    }

    &:last-child {
      font-weight: bold;
    }
  }
}
</style>
