<template>
  <div class="detail-wrapper" v-loading="loading">
    <div class="base-info">
      <div class="top-title">
        <span class="bar-title">设备信息</span>
      </div>

      <template v-if="$route.query.deviceType == 19">
        <table>
          <tr>
            <td rowspan="2">
              <div class="text-label">2021-08-10</div>
              <div class="text-value">17:22</div>
            </td>
            <td class="text-value">dev004</td>
            <td colspan="2" class="text-value">威克电力光储充微电网系统</td>
            <td class="text-value">2323小时</td>
          </tr>
          <tr>
            <td class="text-label">设备编码</td>
            <td colspan="2" class="text-label">湖南省长沙市雨花区总部基地</td>
            <td class="text-label">累计投运时间</td>
          </tr>

          <tr>
            <td rowspan="2" class="text-value">负载</td>
            <td class="text-value">115 kW</td>
            <td class="text-value">1150 kWh</td>
            <td class="text-value">220/211/244 VAC</td>
            <td class="text-value">11/23/12 A</td>
          </tr>
          <tr>
            <td class="text-label">实时需求功率</td>
            <td class="text-label">累计用电量</td>
            <td class="text-label">相电压</td>
            <td class="text-label">相电流</td>
          </tr>

          <tr>
            <td rowspan="2" class="text-value">电网</td>
            <td class="text-value">15 kW</td>
            <td class="text-value">150 kW</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td class="text-label">实时供电功率</td>
            <td class="text-label">累计供电量</td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td rowspan="2" class="text-value">光伏</td>
            <td class="text-value">75 kW</td>
            <td class="text-value">750 kW</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td class="text-label">实时发电功率</td>
            <td class="text-label">累计发电量</td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td rowspan="4" class="text-value">储能</td>
            <td class="text-value">25 kW 放电</td>
            <td class="text-value">250 kW</td>
            <td class="text-value">220 kW</td>
            <td class="text-value">86.98%</td>
          </tr>
          <tr>
            <td class="text-label">设备实时功率</td>
            <td class="text-label">累计储电量</td>
            <td class="text-label">累计发电量</td>
            <td class="text-label">系统效率</td>
          </tr>
          <tr>
            <td class="text-value">77%</td>
            <td class="text-value">27 ℃</td>
            <td class="text-value">3.53/3.63 VDC</td>
            <td class="text-value">7/122</td>
          </tr>
          <tr>
            <td class="text-label">储能SOC</td>
            <td class="text-label">系统温度</td>
            <td class="text-label">最低最高电压</td>
            <td class="text-label">最低最高节数</td>
          </tr>

          <tr>
            <td rowspan="2" class="text-value">双碳贡献</td>
            <td class="text-value">3234 kg</td>
            <td class="text-value">233 kg</td>
            <td class="text-value"></td>
            <td class="text-value"></td>
          </tr>
          <tr>
            <td class="text-label">减少CO2排放量</td>
            <td class="text-label">减少SO2排放量</td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </template>

      <template v-if="$route.query.deviceType == 18">
        <table>
          <tr>
            <td rowspan="2" class="text-value">设备信息</td>
            <td class="text-value">{{ detailInfo.deviceCode }}</td>
            <td colspan="2" class="text-value">工业户外电源</td>
            <td class="text-value">-- kW</td>
          </tr>
          <tr>
            <td class="text-label">设备编码</td>
            <td colspan="2" class="text-label">设备名称</td>
            <td class="text-label">额定功率</td>
          </tr>

          <tr>
            <td rowspan="4" class="text-value">实时</td>
            <td class="text-value">{{ statusFormatter(detailInfo.status) }}</td>
            <td class="text-value">{{ detailInfo.dczy || "暂无数据" }}</td>
            <td class="text-value">{{ detailInfo.soc || "暂无数据" }}</td>
            <td class="text-value">{{ detailInfo.temp || "暂无数据" }}</td>
          </tr>

          <tr>
            <td class="text-label">实时状态</td>
            <td class="text-label">实时电池电压</td>
            <td class="text-label">电池SOC</td>
            <td class="text-label">设备温度</td>
          </tr>
          <tr>
            <td>--</td>
            <td>--</td>
            <td class="text-value">{{ statusFormatter(detailInfo.status) }}</td>
            <td class="text-value">{{ detailInfo.onlineTime || "暂无数据" }}</td>
          </tr>
          <tr>
            <td class="text-label">直流功率</td>
            <td class="text-label">交流功率</td>
            <td class="text-label">设备状态</td>
            <td class="text-label">在线时间</td>
          </tr>

          <tr>
            <td rowspan="2" class="text-value">累计</td>
            <td class="text-value">-- kW</td>
            <td class="text-value">--</td>
            <td></td>
            <td class="text-value">ON/OFF</td>
          </tr>
          <tr>
            <td class="text-label">累计放电量</td>
            <td class="text-label">累计运行天数</td>
            <td></td>
            <td class="text-label">一键离线</td>
          </tr>

          <tr>
            <td rowspan="2" class="text-value">位置</td>
            <td colspan="4" class="text-value">湖南省长沙市天心区湘府路2231号</td>
          </tr>
          <tr>
            <td colspan="4">
              <div id="map-container"></div>
            </td>
          </tr>

          <tr>
            <td rowspan="2" class="text-value">运维</td>
            <td class="text-value">0731-86281319</td>
            <td class="text-value">13974864753</td>
            <td class="text-value"></td>
            <td class="text-value">E32</td>
          </tr>

          <tr>
            <td class="text-label">威克电力</td>
            <td class="text-label">运维人微信</td>
            <td class="text-label">购买人</td>
            <td class="text-label">故障代码</td>
          </tr>
        </table>
      </template>

      <template v-else-if="$route.query.deviceType == 17">
        <table>
          <tr>
            <td colspan="5" style="text-align: center; fontWeight: bold">
              威克电力配网智能储能装置-设备详情
            </td>
          </tr>
          <tr>
            <td rowspan="4" class="text-value">设备信息</td>
            <td rowspan="2">
              <div>2021-08-10</div>
              <div class="text-value">17:22</div>
            </td>
            <td colspan="2" class="text-value">{{ detailInfo.deviceName }}</td>
            <td class="text-value">-- 小时</td>
          </tr>
          <tr>
            <td colspan="2" class="text-label">
              实时位置：湖南省长沙市雨花区总部基地
            </td>
            <td class="text-label">累计投运时间</td>
          </tr>
          <tr>
            <td class="text-value">{{ detailInfo.deviceCode }}</td>
            <td class="text-value">--</td>
            <td class="text-value">-- kVA</td>
            <td class="text-value">ON/OFF</td>
          </tr>
          <tr>
            <td class="text-label">设备编码</td>
            <td class="text-label">工作模式</td>
            <td class="text-label">变压器容量</td>
            <td class="text-label">一键脱网</td>
          </tr>

          <tr>
            <td rowspan="2" class="text-value">负载</td>
            <td class="text-value">-- kW</td>
            <td class="text-value">-- kWh</td>
            <td class="text-value">{{ detailInfo.xdy || "--" }}</td>
            <td class="text-value">-- A</td>
          </tr>
          <tr>
            <td class="text-label">实时需求功率</td>
            <td class="text-label">累计用电量</td>
            <td class="text-label">相电压</td>
            <td class="text-label">相电流</td>
          </tr>

          <tr>
            <td rowspan="2" class="text-value">电网</td>
            <td class="text-value">-- kW</td>
            <td class="text-value">-- kW</td>
            <td class="text-value"></td>
            <td class="text-value"></td>
          </tr>
          <tr>
            <td class="text-label">实时供电功率</td>
            <td class="text-label">累计供电量</td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td rowspan="4" class="text-value">储能</td>
            <td class="text-value">-- kW 放电</td>
            <td class="text-value">-- kW</td>
            <td class="text-value">-- kW</td>
            <td class="text-value">--.98%</td>
          </tr>
          <tr>
            <td class="text-label">设备实时功率</td>
            <td class="text-label">累计储电量</td>
            <td class="text-label">累计发电量</td>
            <td class="text-label">系统效率</td>
          </tr>
          <tr>
            <td class="text-value">{{ detailInfo.soc || "--" }}</td>
            <td class="text-value">{{ detailInfo.temp || "--" }}</td>
            <td class="text-value">{{ detailInfo.dtdy || "暂无数据" }}</td>
            <td class="text-value">--</td>
          </tr>
          <tr>
            <td class="text-label">储能SOC</td>
            <td class="text-label">系统温度</td>
            <td class="text-label">最低最高电压</td>
            <td class="text-label">最低最高节数</td>
          </tr>

          <tr>
            <td rowspan="2" class="text-value">双碳贡献</td>
            <td class="text-value">-- kg</td>
            <td class="text-value">-- kg</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td class="text-label">减少CO2排放量</td>
            <td class="text-label">减少SO2排放量</td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </template>
    </div>

    <template v-if="loadChart && peakChart && deviceType == 1">
      <div class="info-dom" style="padding: 0">
        <div class="top-title" style="padding: 20px 10px 10px">
          <span class="bar-title"> 24小时储能功率曲线 </span>
          <span>(数据更新时间: {{ detailInfo.updateTime }})</span>
        </div>
        <div class="chart-wrapper">
          <line-chart
            :loadChart="loadChart"
            :peakChart="peakChart"
          ></line-chart>
        </div>
      </div>
    </template>

    <template v-if="$route.query.deviceType == 19">
      <div class="info-dom" style="padding: 0">
        <div class="top-title" style="padding: 20px 10px 10px">
          <span class="bar-title"> 光储充24小时曲线 </span>
        </div>
        <div class="chart-wrapper"></div>
      </div>
    </template>

    <!-- START EMS -->
    <template v-if="$route.query.deviceType == 17">
      <div class="info-dom" id="map-container"></div>

      <div class="info-dom">
        <div class="top-title">
          <span class="bar-title">项目简介</span>
        </div>
        <div :style="{ textIndent: '2em' }">
          ****台区配网智能储能项目于2021年11月3日部署在**位置，主要目的是为用户提供更可靠的电能供应，同时对末端电压偏差、三相不平衡和变压器过载进行治理。该项目上端变压器的容量为**kVA，储能容量为**kW/**kWh，主要工作模式为并网模式；项目图片为：
        </div>
      </div>

      <div class="info-dom">
        <table>
          <tr>
            <td rowspan="2" class="text-value">运维</td>
            <td class="text-value">0731-86281319</td>
            <td class="text-value">13974864753</td>
            <td></td>
            <td class="text-value">E32</td>
          </tr>

          <tr>
            <td class="text-label">威克电力</td>
            <td class="text-label">运维人微信</td>
            <td class="text-label">购买人</td>
            <td class="text-label">故障代码</td>
          </tr>
        </table>
      </div>
    </template>
    <!-- END EMS -->

    <!-- START 光储充微电网系统 -->
    <template v-if="$route.query.deviceType == 19">
      <div class="info-dom" id="map-container"></div>

      <div class="info-dom">
        <div class="top-title">
          <span class="bar-title">项目简介</span>
        </div>
        <div :style="{ textIndent: '2em' }">
           威克电力光储充微电网项目于2021年11月3日部署在**位置，主要目的是为用户提供更低的用电成本、更可靠的电能供应。该项目光伏装机量为**kW，储能容量为**kW/**kWh，主要工作模式为并网模式；项目图片为：
        </div>
      </div>

      <div class="info-dom">
        <table>
          <tr>
            <td rowspan="2" class="text-value">运维</td>
            <td class="text-value">0731-86281319</td>
            <td class="text-value">13974864753</td>
            <td></td>
            <td class="text-value">E32</td>
          </tr>

          <tr>
            <td class="text-label">威克电力</td>
            <td class="text-label">运维人微信</td>
            <td class="text-label">购买人</td>
            <td class="text-label">故障代码</td>
          </tr>
        </table>
      </div>
    </template>
    <!-- END 光储充微电网系统 -->

    <!-- START  -->

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
      runingDict: [],
      deviceStatus: [],
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
  async created() {
    this.getDeviceStatus();
    await this.getRuningStatus();
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
    // 初始化地图
    createMap(longitude, latitude) {
      console.log("longitude", longitude);
      console.log("latitude", latitude);
      return new Promise(resolve => {
        let map = new AMap.Map("map-container", {
          zoom: 11, //级别
          center: [Number(longitude), Number(latitude)], //中心点坐标
          viewMode: "3D" //使用3D视图
        });
        new AMap.Marker({
          position: [Number(longitude), Number(latitude)],
          map: map
        });
        resolve();
      });
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
            if (res.data.deviceData) {
              deviceData = res.data.deviceData;
              console.log("deviceData", deviceData);
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
              this.$nextTick(() => {
                this.createMap(
                  this.detailInfo.longitude,
                  this.detailInfo.latitude
                );
              });
              this.deviceType = 0;
            } else if (deviceData && deviceData.loadChart) {
              this.deviceData = null;
              this.$nextTick(() => {
                this.loadChart = deviceData.loadChart;
                this.peakChart = deviceData.peakChart;
                this.detailInfo.updateTime = deviceData.updatetime;
                this.createMap(
                  this.detailInfo.longitude,
                  this.detailInfo.latitude
                );
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
    // 获取运行状态
    getRuningStatus() {
      return new Promise(async resolve => {
        let { code, data } = await this.getDicts("runing_status");
        if (code == 200) {
          this.runingDict = data;
          resolve();
        }
      });
    },
    // 获取设备状态
    async getDeviceStatus() {
      return new Promise(async resolve => {
        let { code, data } = await this.getDicts("device_status");
        if (code == 200) {
          this.deviceStatus = data.map(item => {
            return {
              value: item.dictValue,
              label: item.dictLabel
            };
          });
          resolve();
        }
      });
    },
    // 数据状态格式化
    statusFormatter(value) {
      let temp = this.deviceStatus.filter(item => item.value == value);
      return temp.length ? temp[0].label : "";
    },
    // 获取字段数据
    getLabelDictValue(value) {
      let temp = this.runingDict.filter(item => item.dictValue == value);
      return temp && temp.length ? temp[0].dictLabel : "暂无数据";
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

.info-dom {
  background-color: #fff;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 20px;
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
    margin-bottom: 20px;
    > span {
      margin-bottom: 5px;
    }
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

.label {
  background-color: #f0f0f0;
  width: 180px;
  color: #666;
}

.long-item-detail {
  display: flex;
  flex-wrap: wrap;
  > div {
    flex: 0 0 25%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    > span {
      display: flex;
      align-items: flex-end;
      > span {
        &:first-child {
          font-size: 18px;
          font-weight: bold;
          margin-right: 10px;
        }

        &:last-child {
          font-size: 14px;
          color: #a3a3a3;
        }
      }
    }
    > label {
      width: 220px !important;
      // color: #a3a3a3 !important;
      // font-weight: normal !important;
    }
  }
}

table {
  width: 100%;
  border-collapse: collapse;
  border-right: 1px solid #dedede;
  border-bottom: 1px solid #dedede;
  td {
    text-align: center;
    padding: 8px 0;
    border-left: 1px solid #dedede;
    border-top: 1px solid #dedede;
  }
  .text-label {
    color: #a3a3a3;
    font-size: 14px;
    font-weight: bold;
  }
  .text-value {
    color: #333;
    font-size: 14px;
    font-weight: bold;
  }
}

#map-container {
  width: 100%;
  height: 300px;
}
</style>
