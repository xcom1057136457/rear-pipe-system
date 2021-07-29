<template>
  <div class="detail-wrapper" v-loading="loading">
    <div class="base-info">
      <div class="top-title">
        <span class="bar-title">设备信息</span>
      </div>

      <template v-if="$route.query.deviceType == 19">
        <div class="top-detail-info">
          <div class="top-detail-item">
            <label for="">设备编码:</label>
            <span>{{ detailInfo.deviceCode }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">设备名称:</label>
            <span>{{ detailInfo.deviceName }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">设备状态:</label>
            <span>{{ detailInfo.status == "1" ? "在线" : "离线" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">最后在线时间:</label>
            <span> {{ detailInfo.onlineTime || "暂无数据" }} </span>
          </div>

          <div class="top-detail-item">
            <label for="">运行状态:</label>
            <span>{{ yxztFormate(detailInfo.yxzt) || "暂无数据" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">电压检测状态:</label>
            <span>{{ dyjcztFormate(detailInfo.dyjczt) }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">温度:</label>
            <span>{{ detailInfo.temp || "暂无数据" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">触电检测1:</label>
            <span>{{ cdjcFormate(detailInfo.cdjc1) }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">触电检测2:</label>
            <span>
              {{ cdjcFormate(detailInfo.cdjc2) }}
            </span>
          </div>
        </div>
      </template>

      <template v-if="$route.query.deviceType == 18">
        <div class="top-detail-info">
          <div class="top-detail-item">
            <label for="">设备编码:</label>
            <span>{{ detailInfo.deviceCode }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">设备名称:</label>
            <span>{{ detailInfo.deviceName }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">设备状态:</label>
            <span>{{ detailInfo.status == "1" ? "在线" : "离线" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">最后在线时间:</label>
            <span> {{ detailInfo.onlineTime || "暂无数据" }}} </span>
          </div>

          <div class="top-detail-item">
            <label for="">运行状态:</label>
            <span>{{ yxztFormate(detailInfo.yxzt) || "暂无数据" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">电池总压:</label>
            <span>{{ detailInfo.dczy || "暂无数据" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">直流功率:</label>
            <span>{{ detailInfo.zlgl || "暂无数据" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">温度:</label>
            <span>{{ detailInfo.temp || "暂无数据" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">SOC:</label>
            <span>{{ detailInfo.soc || "暂无数据" }}</span>
          </div>
        </div>
      </template>

      <template v-else-if="$route.query.deviceType == 17">
        <div class="top-detail-info">
          <div class="top-detail-item">
            <label for="">设备编码:</label>
            <span>{{ detailInfo.deviceCode }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">设备名称:</label>
            <span>{{ detailInfo.deviceName }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">设备状态:</label>
            <span>{{ detailInfo.status == "1" ? "在线" : "离线" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">最后在线时间:</label>
            <span> {{ detailInfo.onlineTime || "暂无数据" }}} </span>
          </div>

          <div class="top-detail-item">
            <label for="">运行状态:</label>
            <span>{{ yxztFormate(detailInfo.yxzt) || "暂无数据" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">储能交流有功功率:</label>
            <span>{{ detailInfo.cnjlyggl || "暂无数据" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">温度:</label>
            <span>{{ detailInfo.temp || "暂无数据" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">单体最高/低电压:</label>
            <span>{{ detailInfo.dtdy || "暂无数据" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">相电压:</label>
            <span>{{ detailInfo.xdy || "暂无数据" }}</span>
          </div>

          <div class="top-detail-item">
            <label for="">SOC:</label>
            <span>{{ detailInfo.soc || "暂无数据" }}</span>
          </div>
        </div>
      </template>
    </div>

    <div class="extra-info">
      <!-- 设备不是EMS设备时 -->
      <template v-if="deviceData && deviceType == 0">
        <!-- S 设备实时数据 -->
        <div class="top-title">
          <span class="bar-title">设备实时数据</span>
        </div>
        <div class="deivice-data">
          <el-row :gutter="20">
            <el-col
              :span="6"
              v-for="(value, key, index) in deviceData"
              :key="index"
            >
              <div class="top-item">
                <div class="top-text">
                  {{ labelFormat(key) }}
                </div>
                <div class="bottom-detail">
                  <template v-if="$route.query.deviceType == 19">
                    <template v-if="key == 'GeoLocation'">
                      {{
                        "经度：" +
                          value[0].Latitude +
                          " 纬度：" +
                          value[0].Longitude
                      }}
                    </template>

                    <template v-else-if="key != 'Switch1'">
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
                        @change="switchChange($event, key)"
                      >
                      </el-switch>
                    </template>
                  </template>

                  <template v-if="$route.query.deviceType == 18">
                    <template
                      v-if="
                        key == 'PRSwitch' ||
                          key == 'LSwitch' ||
                          key == 'HTState' ||
                          key == 'BeepState' ||
                          key == 'FanState'
                      "
                    >
                      {{ value == "0" ? "关" : "开" }}
                    </template>

                    <template v-else-if="key == 'GeoLocation'">
                      {{
                        "经度：" + value.Latitude + " 纬度：" + value.Longitude
                      }}
                    </template>

                    <template
                      v-else-if="key != 'ContactorState' && key != 'BMSState'"
                    >
                      {{ value || value == "0" ? value : "-" }}
                      <span v-if="!key.indexOf('Temp')">℃</span>
                    </template>

                    <template v-else>
                      <el-switch
                        v-model="deviceData[key]"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :inactive-text="deviceData[key] == 0 ? '断开' : '闭合'"
                        :active-value="1"
                        :inactive-value="0"
                        @change="switchChange($event, key)"
                      >
                      </el-switch>
                    </template>
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
          <span class="bar-title">
            24小时储能功率曲线
          </span>
          <span>(数据更新时间: {{ detailInfo.updateTime }})</span>
        </div>
        <div class="chart-wrapper">
          <line-chart
            :loadChart="loadChart"
            :peakChart="peakChart"
          ></line-chart>
        </div>
      </template>
      <!-- 设备是EMS设备时 -->
    </div>

    <div class="back-bar">
      <!--      <el-switch-->
      <!--        v-model="version"-->
      <!--        active-text="新版"-->
      <!--        inactive-text="旧版"-->
      <!--        active-value="new"-->
      <!--        inactive-value="old"-->
      <!--        style="margin-right: 20px"-->
      <!--        active-color="#1890ff"-->
      <!--        inactive-color="rgb(255, 73, 73)"-->
      <!--      ></el-switch>-->
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
import { getPositionByLonLats } from "@/utils";
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
      version: "old",
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
      ],
      addressInfo: ""
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
    // 获取地址
    getPositionByLonLats(longitude, latitude) {
      getPositionByLonLats(longitude, latitude, res => {
        this.addressInfo = res;
      });
    },
    dyjcztFormate(val) {
      if (!val) return "暂无数据";
      return val == 0 ? "断开" : "闭合";
    },
    cdjcFormate(val) {
      if (!val) return "暂无数据";
      return val == 0 ? "断" : "通";
    },
    yxztFormate(val) {
      switch (val) {
        case "wait": {
          return "待机";
        }

        case "charge": {
          return "充电";
        }

        case "discharge": {
          return "放电";
        }

        case "offline": {
          return 故障;
        }

        default: {
          return val;
        }
      }
    },
    async getDetailInfo() {
      this.loading = true;
      this.$route.query.deviceType != 17 && (await this.getDiceDict());
      getDeiveDetail({
        deviceId: this.$route.query.deviceId
      })
        .then(async res => {
          if (res.code == 200) {
            this.detailInfo = res.data;
            let deviceData = {};
            if (res.data.deviceData && this.$route.query.deviceType != 17) {
              deviceData = res.data.deviceData;
            } else if (
              res.data.deviceData &&
              this.$route.query.deviceType == 17
            ) {
              deviceData = JSON.parse(res.data.deviceData);
            } else {
              deviceData = null;
            }

            if (deviceData && !deviceData.loadChart) {
              let dataObj = {};
              if (this.$route.query.deviceType == 18) {
                dataObj = await this.getDictObj("2kwDevice_dataFormat");
              } else if (this.$route.query.deviceType == 19) {
                dataObj = await this.getDictObj("4g4Device_dataFormat");
              }
              let saveObj = {};
              dataObj.map(item => {
                saveObj[item.dictValue] = null;
              });
              for (let key in saveObj) {
                saveObj[key] = deviceData[key];
              }
              this.deviceData = saveObj;
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
    // 查字典
    getDictObj(type) {
      return new Promise(async (resolve, reject) => {
        try {
          let { code, data } = await this.getDicts(type);
          code == 200 && resolve(data);
        } catch (err) {
          reject(err);
          console.log(err);
        }
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
    switchChange(val, key) {
      let temp = this.deviceWordsName.filter(item => item.value == key);
      temp = temp.length ? temp.shift().label : key;
      this.$confirm(`此操作将更改${temp}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deviceControl({
            item: key,
            productKey: this.detailInfo.productKey,
            sn: this.detailInfo.sn,
            val
          })
            .then(res => {
              if (res.code == 200) {
                this.$message.success("修改成功!");
                // setTimeout(() => {
                //   this.getDetailInfo();
                // }, 2000);
              }
            })
            .catch(() => {
              this.deviceData[key] = val == 0 ? 1 : 0;
            });
        })
        .catch(() => {
          this.deviceData[key] = val == 0 ? 1 : 0;
          this.$message.info("已取消修改!");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-wrapper {
  position: relative;
  margin-bottom: 50px;
  > div.base-info,
  div.extra-info {
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &.base-info {
      margin-bottom: 20px;
    }
  }
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

.top-detail-info {
  > div.top-detail-item {
    line-height: 40px;
    label {
      font-size: 16px;
      width: 150px;
      display: inline-block;
      color: black;
      font-weight: bold;
    }
    span {
      color: #666;
    }
  }
  > .double-item {
    line-height: 40px;
    display: flex;
    align-items: center;
    > div {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
      label {
        font-size: 16px;
        width: 120px;
        display: inline-block;
        color: black;
        font-weight: bold;
      }
      span {
        color: #666;
      }
    }
  }
}

.line-vertical {
  width: 100%;
  height: 1px;
  border-top: 1px dotted #dedede;
  margin: 5px 0;
}

.top-title {
  margin: 10px 0;
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
  .bar-title {
    position: relative;
    font-size: 18px;
    font-weight: bold;
    display: inline-block;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: -10px;
      width: 5px;
      background-color: #1890ff;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
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
</style>
