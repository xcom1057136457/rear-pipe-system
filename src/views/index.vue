<template>
  <div class="container">
    <div class="top-nav">
      <div class="top-nav-inner">
        <div>
          <div>绿色</div>
          <div>威克</div>
        </div>

        <div>
          <div>
            <span class="top-label">累计排放量:</span>
            <span>423445kWh</span>
          </div>
          <div>
            <span class="top-label">累计减排CO2约:</span>
            <span>2342吨</span>
          </div>
        </div>

        <div>累计减排SO2约：2342吨</div>
      </div>
    </div>

    <div class="select-device">
      <el-checkbox-group v-model="deviceSelect">
        <el-checkbox
          v-for="(item, index) in deviceList"
          :key="index"
          :label="item.deviceTypeName"
          :value="item.deviceType"
          @change="deviceChange"
        ></el-checkbox>
      </el-checkbox-group>
    </div>
    <div id="container"></div>
  </div>
</template>

<script>
import { getAllDevice, getDeviceList } from "@/api/monitor/device";
import { getAllProduct } from "@/api/monitor/product";
export default {
  name: "index",
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
      deviceList: []
    };
  },
  methods: {
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
    // 获取产品列表
    async getAllProductHandler() {
      let { code, rows } = await getAllProduct();
      if (code == 200) {
        this.deviceType = rows.map(item => {
          return {
            label: item.productName,
            value: item.productId
          };
        });
      }
    },
    createMap() {
      return new Promise(resolve => {
        this.map = new AMap.Map("container", {
          zoom: 5, //级别
          center: [
            Number(this.deviceInfo[0].longitude),
            Number(this.deviceInfo[0].latitude)
          ], //中心点坐标
          viewMode: "3D" //使用3D视图
        });

        let that = this;
        // 同时引入工具条插件，比例尺插件和鹰眼插件
        AMap.plugin(
          [
            "AMap.ToolBar",
            "AMap.Scale",
            "AMap.OverView",
            "AMap.MapType",
            "AMap.Geolocation"
          ],
          function() {
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
    /**
     * https://i.loli.net/2021/07/27/8IpceAPmVL4gNTz.png 蓝箱子
     https://i.loli.net/2021/07/27/TKXzNU5EkbjolMI.png 黄箱子
     https://i.loli.net/2021/07/27/5NCSxJq6lfMY91O.png click黄箱子
     https://i.loli.net/2021/07/27/SBwTivEZzrDnPhW.png
     * */
    async initMap() {
      await this.getAllDeviceHandler();
      await this.createMap();
      var lnglats = this.deviceInfo;
      this.infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -35) });
      this.markers = [];
      for (var i = 0, marker; i < lnglats.length; i++) {
        if (lnglats[i].deviceType == 18) {
          var marker = new AMap.Marker({
            position: [
              Number(lnglats[i].longitude),
              Number(lnglats[i].latitude)
            ],
            map: this.map,
            icon: "https://i.loli.net/2021/07/19/lkqTbOmCudxrsXJ.png"
          });
          this.markers.push(marker);
        } else if (lnglats[i].deviceType == 17) {
          var marker = new AMap.Marker({
            position: [
              Number(lnglats[i].longitude),
              Number(lnglats[i].latitude)
            ],
            map: this.map,
            icon: "https://i.loli.net/2021/07/27/8IpceAPmVL4gNTz.png"
          });
          this.markers.push(marker);
        } else if (lnglats[i].deviceType == 19) {
          var marker = new AMap.Marker({
            position: [
              Number(lnglats[i].longitude),
              Number(lnglats[i].latitude)
            ],
            map: this.map,
            icon: "https://i.loli.net/2021/07/27/TKXzNU5EkbjolMI.png"
          });
          this.markers.push(marker);
        } else {
          var marker = new AMap.Marker({
            position: [
              Number(lnglats[i].longitude),
              Number(lnglats[i].latitude)
            ],
            map: this.map
          });
          this.markers.push(marker);
        }

        let content = ''
        if (lnglats[i].deviceType == 19) {
          content = `
            <div class="info-wrapper">
              <div class="info-title">
                设备信息
              </div>
              <div class="info-detail">
                <div class="info-item">
                  <span>设备编码：</span>
                  <span>${lnglats[i].deviceCode}</span>
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
                  <span>正常</span>
                </div>

                <div class="info-item">
                  <span>电压检测状态：</span>
                  <span>闭合</span>
                </div>

                <div class="info-item">
                  <span>温度：</span>
                  <span>32.1°C</span>
                </div>

                <div class="info-item">
                  <span>触电检测1：</span>
                  <span>通</span>
                </div>

                <div class="info-item">
                  <span>触电检测2：</span>
                  <span>通</span>
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
                <div class="info-item">
                  <span>设备编码：</span>
                  <span>${lnglats[i].deviceCode}</span>
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
                  <span>正常</span>
                </div>

                <div class="info-item">
                  <span>电池总压：</span>
                  <span>36.0V</span>
                </div>

                <div class="info-item">
                  <span>直流功率：</span>
                  <span>0.43kW</span>
                </div>

                <div class="info-item">
                  <span>温度：</span>
                  <span>27.1°C</span>
                </div>

                <div class="info-item">
                  <span>SOC：</span>
                  <span>90%</span>
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
                <div class="info-item">
                  <span>设备编码：</span>
                  <span>${lnglats[i].deviceCode}</span>
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
                  <span>正常</span>
                </div>

                <div class="info-item">
                  <span>储能交流有功功率：</span>
                  <span>-/+1.3kW</span>
                </div>

                <div class="info-item">
                  <span>温度：</span>
                  <span>36.1°C</span>
                </div>

                <div class="info-item">
                  <span>单体最高/低电压：</span>
                  <span>3.328/3.324V</span>
                </div>

                <div class="info-item">
                  <span>相电压：</span>
                  <span>221.5/216.8/225.3V</span>
                </div>

                <div class="info-item">
                  <span>SOC：</span>
                  <span>90%</span>
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
            offset: new AMap.Pixel(-16, -30)
          },
          {
            url: "imgs/2.png",
            size: new AMap.Size(32, 32),
            offset: new AMap.Pixel(-16, -30)
          },
          {
            url: "imgs/3.png",
            size: new AMap.Size(48, 48),
            offset: new AMap.Pixel(-24, -45),
            textColor: "#CC0066"
          }
        ];

        let that = this;

        //添加聚合组件
        that.map.plugin(["AMap.MarkerClusterer"], function() {
          let cluster = new AMap.MarkerClusterer(
            that.map, // 地图实例
            that.markers, // 海量点组成的数组
            {
              maxZoom: 10
            }
          );
        });
      }
    },
    markerClick(e) {
      this.resetIcon();
      let click2kwIcon = new AMap.Icon({
        image: "https://i.loli.net/2021/07/19/eWwrOMcHSGTsZ7E.png",
        size: new AMap.Size(40, 62), //图标大小
        imageSize: new AMap.Size(40, 62)
      });

      let clickEmsIcon = new AMap.Icon({
        image: "https://i.loli.net/2021/07/27/5NCSxJq6lfMY91O.png",
        size: new AMap.Size(40, 62), //图标大小
        imageSize: new AMap.Size(40, 62)
      });

      let click4g4Icon = new AMap.Icon({
        image: "https://i.loli.net/2021/07/27/SBwTivEZzrDnPhW.png",
        size: new AMap.Size(40, 62), //图标大小
        imageSize: new AMap.Size(40, 62)
      });

      if (e.target.content.indexOf("2KW移动电源") != -1) {
        e.target.setIcon(click2kwIcon);
      } else if (e.target.content.indexOf("EMS设备") != -1) {
        e.target.setIcon(clickEmsIcon);
      } else if (e.target.content.indexOf("4G4远控设备") != -1) {
        e.target.setIcon(click4g4Icon);
      }
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(this.map, e.target.getPosition());
      this.infoWindow.on("close", this.closeInfo);
    },
    resetIcon() {
      let click2kwIcon = new AMap.Icon({
        image: "https://i.loli.net/2021/07/19/lkqTbOmCudxrsXJ.png",
        size: new AMap.Size(40, 62), //图标大小
        imageSize: new AMap.Size(40, 62)
      });

      let clickEmsIcon = new AMap.Icon({
        image: "https://i.loli.net/2021/07/27/5NCSxJq6lfMY91O.png",
        size: new AMap.Size(40, 62), //图标大小
        imageSize: new AMap.Size(40, 62)
      });

      let click4g4Icon = new AMap.Icon({
        image: "https://i.loli.net/2021/07/27/SBwTivEZzrDnPhW.png",
        size: new AMap.Size(40, 62), //图标大小
        imageSize: new AMap.Size(40, 62)
      });

      this.markers.map(item => {
        if (item.content.indexOf("2KW移动电源") != -1) {
          item.setIcon(click2kwIcon);
        } else if (item.content.indexOf("EMS设备") != -1) {
          item.setIcon(clickEmsIcon);
        } else if (item.content.indexOf("4G4远控设备") != -1) {
          item.setIcon(click4g4Icon);
        }
      });
    },
    // 获取设备数据
    getAllDeviceHandler() {
      return new Promise(resolve => {
        getDeviceList({
          pageNum: 1,
          pageSize: 100000,
          ...this.searchParams
        }).then(res => {
          if (res.code == 200) {
            this.deviceInfo = res.rows;
            let arr = [];
            for (let item of res.rows) {
              if (
                this.deviceList.filter(
                  actItem => actItem.deviceType == item.deviceType
                ).length == 0
              ) {
                this.deviceList.push(item);
              }
            }
            this.deviceSelect = this.deviceList.map(
              item => item.deviceTypeName
            );
            resolve();
          }
        });
      });
    },
    // 设备更改
    deviceChange() {
      let params = [];
      this.deviceSelect.forEach(item1 => {
        this.deviceList.forEach(item2 => {
          if (item2.deviceTypeName == item1) {
            params.push(item2);
          }
        });
      });
      console.log("params", params);
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
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
    this.getAllProductHandler();
    this.getDeviceStatus();
    let that = this;
    window.doDetail = (val, type, e) => {
      that.$router.push({
        name: "DeviceListDetail",
        query: {
          deviceId: val,
          deviceType: type
        }
      });
    };
  }
};
</script>

<style scoped lang="scss">
$detailHeight: 60px;

#container {
  width: 100%;
  height: calc(100vh - 34px - 50px - 120px);
}

.container {
  position: relative;
}

.top-nav {
  padding: 10px;
  height: 80px;
  overflow: hidden;
  font-size: 14px;
  background-color: #f0f0f0;
  box-sizing: border-box;
  .top-nav-inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background-color: #fff;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.top-label {
  width: 120px;
  display: inline-block;
}

.select-device {
  padding: 10px;
  background-color: #dedede;
  height: 40px;
  overflow: hidden;
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
      &:nth-child(2) {
        display: flex;
        align-items: flex-start;
        > span {
          &:first-child {
            flex: 0 0 60px;
          }

          &:last-child {
            flex: 1;
          }
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
