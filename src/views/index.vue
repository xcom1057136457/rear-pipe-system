<template>
  <div class="container">
    <div class="top-nav">
      <div class="top-nav-inner">
        <div
          class="top-title"
          @click="isCollapse = !isCollapse"
          :style="isCollapse ? 'marginBottom: 0' : 'marginBottom: 10px'"
        >
          <span
            class="el-icon-arrow-down"
            :class="isCollapse ? 'collapseIcon' : ''"
          ></span>
          绿色威克
        </div>
        <el-collapse-transition>
          <div class="bottom-details" v-show="!isCollapse">
            <div v-for="(item, index) in topInfoDetail" :key="index">
              <div>
                <span>{{ topInfo[item.value] || '暂无数据' }}</span>
                <span>{{ item.unit }}</span>
              </div>
              <div class="top-label">{{ item.name }}</div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>

    <div class="select-device">
      <el-checkbox-group v-model="deviceSelect" :min="1">
        <el-checkbox
          v-for="(item, index) in deviceType"
          :key="index"
          :label="item.label"
          :value="item.value"
          @change="deviceChange"
        ></el-checkbox>
      </el-checkbox-group>
    </div>
    <div
      id="container"
      :class="isCollapse ? 'collapseHeight' : 'notCollapseHeight'"
    ></div>
  </div>
</template>

<script>
import { getAllDevice, getDeviceList } from "@/api/monitor/device";
import { getDeviceStatistics } from "@/api/tool/carbonEmissions"
import { getAllProduct } from "@/api/monitor/product";
import image1 from "@/assets/images/1.png";
import image1_1 from "@/assets/images/1-1.png";
import image2 from "@/assets/images/2.png";
import image2_2 from "@/assets/images/2-2.png";
import image3 from "@/assets/images/3.png";
import image3_3 from "@/assets/images/3-3.png";
export default {
  name: "Dashbords",
  data() {
    return {
      map: null,
      infoWindow: null,
      deviceInfo: [],
      searchParams: {},
      deviceType: [],
      deviceStatus: [],
      markers: [],
      deviceSelect: [],
      deviceList: [],
      selectData: [],
      isCollapse: false,
      topInfo: {},
      topInfoDetail: [
        {
          name: '累计供电量',
          unit: 'kWh',
          value: 'ljgdl'
        },
        {
          name: '累计减排CO2约',
          unit: '吨',
          value: 'ljjpco2'
        },
        {
          name: '累计减排SO2约',
          unit: '吨',
          value: 'ljjpso2'
        },
        {
          name: '设备总数',
          unit: '台',
          value: 'sbzs'
        },
        {
          name: '设备在线数',
          unit: '台',
          value: 'sbzxs'
        },
        {
          name: '设备离线数',
          unit: '台',
          value: 'sblxs'
        }
      ]
    };
  },
  methods: {
    // 获取设备状态
    async getDeviceStatus() {
      let { code, data } = await this.getDicts("device_status");
      if (code == 200) {
        this.deviceStatus = data.map((item) => {
          return {
            value: item.dictValue,
            label: item.dictLabel,
          };
        });
      }
    },
    // 获取碳排放数据
    async getDeviceStatisticsHandler() {
      let { code, data } = await getDeviceStatistics()
      if (code == 200) {
        this.topInfo = data
      }
    },
    // 获取产品列表
    getAllProductHandler() {
      return new Promise(async (resolve) => {
        let { code, rows } = await getAllProduct();
        if (code == 200) {
          this.deviceType = rows.map((item) => {
            return {
              label: item.productName,
              value: item.productId,
            };
          });
          this.deviceSelect = this.deviceType.map((item) => item.label);
          this.selectData = this.deviceType;
          resolve();
        }
      });
    },
    createMap() {
      return new Promise((resolve) => {
        this.map = new AMap.Map("container", {
          zoom: 5, //级别
          center: [
            Number(this.deviceInfo[0].longitude),
            Number(this.deviceInfo[0].latitude),
          ], //中心点坐标
          viewMode: "3D", //使用3D视图
        });

        let that = this;
        // 同时引入工具条插件，比例尺插件和鹰眼插件
        AMap.plugin(
          [
            "AMap.ToolBar",
            "AMap.Scale",
            "AMap.OverView",
            "AMap.MapType",
            "AMap.Geolocation",
          ],
          function () {
            // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
            that.map.addControl(new AMap.ToolBar());

            // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
            that.map.addControl(new AMap.Scale());

            // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
            that.map.addControl(new AMap.OverView({ isOpen: true }));

            // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
            that.map.addControl(new AMap.MapType());

            // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
            that.map.addControl(new AMap.Geolocation());
          }
        );

        resolve();
      });
    },
    async initMap() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      await this.getAllDeviceHandler();
      await this.createMap();
      var lnglats = this.deviceInfo;
      this.infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -35) });
      this.markers = [];

      let clickPwzncndy = new AMap.Icon({
        image: image1_1,
        size: new AMap.Size(50, 55), //图标大小
        imageSize: new AMap.Size(50, 55),
      });

      let clickGyhwdy = new AMap.Icon({
        image: image2_2,
        size: new AMap.Size(50, 55), //图标大小
        imageSize: new AMap.Size(50, 55),
      });

      let click4g4Icon = new AMap.Icon({
        image: image3_3,
        size: new AMap.Size(50, 55), //图标大小
        imageSize: new AMap.Size(50, 55),
      });

      for (var i = 0, marker; i < lnglats.length; i++) {
        if (lnglats[i].deviceType == 18) {
          var marker = new AMap.Marker({
            position: [
              Number(lnglats[i].longitude),
              Number(lnglats[i].latitude),
            ],
            map: this.map,
            icon: clickGyhwdy,
          });
          this.markers.push(marker);
        } else if (lnglats[i].deviceType == 17) {
          var marker = new AMap.Marker({
            position: [
              Number(lnglats[i].longitude),
              Number(lnglats[i].latitude),
            ],
            map: this.map,
            icon: clickPwzncndy,
          });
          this.markers.push(marker);
        } else if (lnglats[i].deviceType == 19) {
          var marker = new AMap.Marker({
            position: [
              Number(lnglats[i].longitude),
              Number(lnglats[i].latitude),
            ],
            map: this.map,
            icon: click4g4Icon,
          });
          this.markers.push(marker);
        } else {
          var marker = new AMap.Marker({
            position: [
              Number(lnglats[i].longitude),
              Number(lnglats[i].latitude),
            ],
            map: this.map,
          });
          this.markers.push(marker);
        }

        let content = "";
        if (lnglats[i].deviceType == 19) {
          content = `
            <div class="info-wrapper">
              <div class="info-title">
                设备信息
              </div>
              <div class="info-detail">
                <div class="info-item" style="display: none">
                  <span>设备类型：</span>
                  <span>${"光储充微电网系统"}</span>
                </div>

                <div class="info-item">
                  <span>设备名称：</span>
                  <span>台区</span>
                </div>

                <div class="info-item">
                  <span>当前光伏功率：</span>
                  <span>-kW</span>
                </div>

                <div class="info-item">
                  <span>当前负载功率：</span>
                  <span>-kW</span>
                </div>

                <div class="info-item">
                  <span>系统运行状态：</span>
                  <span>运行/充电/馈网/故障</span>
                </div>

                <div class="info-item">
                  <span>今日发电量：</span>
                  <span>-kWh</span>
                </div>

                <div class="info-item">
                  <span>累计减少二氧化碳排放量：</span>
                  <span>-t</span>
                </div>

              </div>

              <div class="info-foot">
                <a href="javascript:;" onClick="doDetail(${
                  lnglats[i].deviceId
                }, ${lnglats[i].deviceType})">进入详情</a>
              </div>
            </div>
          `;
        } else if (lnglats[i].deviceType == 18) {
          content = `
            <div class="info-wrapper">
              <div class="info-title">
                设备信息
              </div>
              <div class="info-detail">
                <div class="info-item" style="display: none">
                  <span>设备类型：</span>
                  <span>${"工业户外电源"}</span>
                </div>

                <div class="info-item">
                  <span>设备名称：</span>
                  <span>${lnglats[i].deviceName}</span>
                </div>

                <div class="info-item">
                  <span>设备状态：</span>
                  <span>${lnglats[i].status == "1" ? "在线" : "离线"}</span>
                </div>

                <div class="info-item">
                  <span>最后在线时间：</span>
                  <span>${lnglats[i].onlineTime || "暂无数据"}</span>
                </div>

                <div class="info-item">
                  <span>运行状态：</span>
                  <span>${yxztFormate(lnglats[i].yxzt) || "暂无数据"}</span>
                </div>

                <div class="info-item">
                  <span>电池总压：</span>
                  <span>${lnglats[i].dczy || "暂无数据"}</span>
                </div>

                <div class="info-item">
                  <span>直流功率：</span>
                  <span>${lnglats[i].zlgl || "暂无数据"}</span>
                </div>

                <div class="info-item">
                  <span>温度：</span>
                  <span>${lnglats[i].temp || "暂无数据"}</span>
                </div>

                <div class="info-item">
                  <span>SOC：</span>
                  <span>${lnglats[i].soc || "暂无数据"}</span>
                </div>

              </div>

              <div class="info-foot">
                <a href="javascript:;" onClick="doDetail(${
                  lnglats[i].deviceId
                }, ${lnglats[i].deviceType})">进入详情</a>
              </div>
            </div>
          `;
        } else if (lnglats[i].deviceType == 17) {
          content = `
            <div class="info-wrapper">
              <div class="info-title">
                设备信息
              </div>
              <div class="info-detail">
                <div class="info-item" style="display: none">
                  <span>设备类型：</span>
                  <span>${"配网智能储能电源"}</span>
                </div>

                <div class="info-item">
                  <span>设备名称：</span>
                  <span>${lnglats[i].deviceName}</span>
                </div>

                <div class="info-item">
                  <span>设备状态：</span>
                  <span>${lnglats[i].status == "1" ? "在线" : "离线"}</span>
                </div>

                <div class="info-item">
                  <span>最后在线时间：</span>
                  <span>${lnglats[i].onlineTime || "暂无数据"}</span>
                </div>

                <div class="info-item">
                  <span>运行状态：</span>
                  <span>${yxztFormate(lnglats[i].yxzt) || "暂无数据"}</span>
                </div>

                <div class="info-item">
                  <span>储能交流有功功率：</span>
                  <span>${lnglats[i].cnjlyggl || "暂无数据"}</span>
                </div>

                <div class="info-item">
                  <span>温度：</span>
                  <span>${lnglats[i].temp || "暂无数据"}</span>
                </div>

                <div class="info-item">
                  <span>单体最高/低电压：</span>
                  <span>${lnglats[i].dtdy || "暂无数据"}</span>
                </div>

                <div class="info-item">
                  <span>相电压：</span>
                  <span>${lnglats[i].xdy || "暂无数据"}</span>
                </div>

                <div class="info-item">
                  <span>SOC：</span>
                  <span>${lnglats[i].soc || "暂无数据"}</span>
                </div>

              </div>

              <div class="info-foot">
                <a href="javascript:;" onClick="doDetail(${
                  lnglats[i].deviceId
                }, ${lnglats[i].deviceType})">进入详情</a>
              </div>
            </div>
          `;
        }

        marker.content = content;
        marker.on("click", this.markerClick);

        // 利用styles属性修改点聚合的图标样式
        var styles = [
          {
            url: "imgs/1.png",
            size: new AMap.Size(32, 32),
            offset: new AMap.Pixel(-16, -30),
          },
          {
            url: "imgs/2.png",
            size: new AMap.Size(32, 32),
            offset: new AMap.Pixel(-16, -30),
          },
          {
            url: "imgs/3.png",
            size: new AMap.Size(48, 48),
            offset: new AMap.Pixel(-24, -45),
            textColor: "#CC0066",
          },
        ];

        let that = this;

        //添加聚合组件
        that.map.plugin(["AMap.MarkerClusterer"], function () {
          let cluster = new AMap.MarkerClusterer(
            that.map, // 地图实例
            that.markers, // 海量点组成的数组
            {
              maxZoom: 10,
            }
          );
        });
        loading.close();
      }
    },

    markerClick(e) {
      this.resetIcon();
      let clickPwzncndy = new AMap.Icon({
        image: image1,
        size: new AMap.Size(50, 55), //图标大小
        imageSize: new AMap.Size(50, 55),
      });

      let clickGyhwdy = new AMap.Icon({
        image: image2,
        size: new AMap.Size(50, 55), //图标大小
        imageSize: new AMap.Size(50, 55),
      });

      let click4g4Icon = new AMap.Icon({
        image: image3,
        size: new AMap.Size(50, 55), //图标大小
        imageSize: new AMap.Size(50, 55),
      });
      if (e.target.content.indexOf("工业户外电源") != -1) {
        e.target.setIcon(clickGyhwdy);
      } else if (e.target.content.indexOf("配网智能储能电源") != -1) {
        e.target.setIcon(clickPwzncndy);
      } else if (e.target.content.indexOf("光储充微电网系统") != -1) {
        e.target.setIcon(click4g4Icon);
      }
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(this.map, e.target.getPosition());
      this.infoWindow.on("close", this.closeInfo);
    },
    resetIcon() {
      let clickPwzncndy = new AMap.Icon({
        image: image1_1,
        size: new AMap.Size(50, 55), //图标大小
        imageSize: new AMap.Size(50, 55),
      });

      let clickGyhwdy = new AMap.Icon({
        image: image2_2,
        size: new AMap.Size(50, 55), //图标大小
        imageSize: new AMap.Size(50, 55),
      });

      let click4g4Icon = new AMap.Icon({
        image: image3_3,
        size: new AMap.Size(50, 55), //图标大小
        imageSize: new AMap.Size(50, 55),
      });

      this.markers.map((item) => {
        if (item.content.indexOf("工业户外电源") != -1) {
          item.setIcon(clickGyhwdy);
        } else if (item.content.indexOf("配网智能储能电源") != -1) {
          item.setIcon(clickPwzncndy);
        } else if (item.content.indexOf("光储充微电网系统") != -1) {
          item.setIcon(click4g4Icon);
        }
      });
    },
    // 获取设备数据
    getAllDeviceHandler() {
      return new Promise(async (resolve) => {
        getDeviceList({
          pageNum: 1,
          pageSize: 100000,
          ...this.searchParams,
          deviceType: this.selectData.map((item) => item.value).join(","),
        }).then((res) => {
          if (res.code == 200) {
            this.deviceInfo = res.rows;
            resolve();
          }
        });
      });
    },
    // 设备更改
    deviceChange() {
      let params = [];
      this.deviceSelect.forEach((item1) => {
        this.deviceType.forEach((item2) => {
          if (item2.label == item1) {
            params.push(item2);
          }
        });
      });
      this.selectData = params;
      this.initMap();
    },
    // 刷新
    refresh() {
      this.searchParams = {};
      this.initMap();
    },
    search() {
      this.initMap();
    },
    closeInfo() {
      this.resetIcon();
    },
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getAllProductHandler();
      this.initMap();
    });
    this.getDeviceStatus();
    this.getDeviceStatisticsHandler()
    let that = this;
    window.doDetail = (val, type, e) => {
      that.$router.push({
        name: "DeviceListDetail",
        query: {
          deviceId: val,
          deviceType: type,
        },
      });
    };
    window.yxztFormate = (val) => {
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
    };
  },
};
</script>

<style scoped lang="scss">
$detailHeight: 60px;

#container {
  width: 100%;
}

.collapseHeight {
  height: calc(100vh - 34px - 50px - 62px - 40px);
}

.notCollapseHeight {
  height: calc(100vh - 34px - 50px - 157px);
}

.container {
  position: relative;
}

.el-icon-arrow-down {
  transition-property: all;
  transition-duration: 0.3s;
  margin-right: 10px;
}

.collapseIcon {
  transform: rotate(180deg);
}

.top-nav {
  background-color: #f9f9f9;
  box-sizing: border-box;
}

.top-nav-inner {
  padding: 10px 20px;
  background-color: #fff;
  margin: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  cursor: pointer;
}

.bottom-details {
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    > div {
      &:first-child {
        > span {
          &:first-child {
            font-size: 18px;
            font-weight: bold;
            margin-right: 4px;
          }

          &:last-child {
            font-size: 14px;
            color: #a3a3a3;
          }
        }
      }
    }
  }
}

.top-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.top-label {
  font-size: 14px;
  color: #a3a3a3;
}

::v-deep .select-device {
  padding: 10px;
  background-color: #dedede;
  height: 40px;
  overflow: hidden;
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #1890ff;
    border-color: #1890ff;
  }
  .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #1890ff;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    color: #fff;
    border-color: #fff;
  }
}

.label {
  background-color: #f0f0f0;
}

::v-deep .info-wrapper {
  background-color: #fff;
  width: 250px;
  font-size: 12px;

  .info-title {
    background-color: #25a5f7 !important;
    padding: 5px 5px;
    color: #fff;
    border-bottom: 1px solid #fff;
  }

  .info-detail {
    > div {
      padding: 5px;
      display: flex;
      align-items: flex-start;
      > span {
        &:first-child {
          flex: 0 0 110px;
        }

        &:last-child {
          flex: 1;
        }
      }
    }
  }

  .info-foot {
    padding: 5px;
    border-top: 1px solid #f0f0f0;
    text-align: right;
    > a {
      color: #25a5f7;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

::v-deep .amap-info-content {
  padding: 0;
  border-radius: 5px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

::v-deep .amap-info-close {
  color: #fff !important;
  font-size: 12px;
}

.search-ball {
  position: absolute;
  right: 150px;
  bottom: 80px;
  background-color: rgb(24, 144, 255);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
}

.el-select {
  width: 100%;
}
</style>
