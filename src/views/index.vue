<template>
  <div class="container">
    <div id="container"></div>

    <el-popover placement="top" width="350" trigger="click">
      <div class="search-wrapper">
        <el-form label-width="80px" label-position="left" size="small">
          <el-form-item label="设备编码">
            <el-input
              v-model="searchParams.deviceCode"
              placeholder="请输入设备编码"
            ></el-input>
          </el-form-item>

          <el-form-item label="设备名称">
            <el-input
              v-model="searchParams.deviceName"
              placeholder="请输入设备名称"
            ></el-input>
          </el-form-item>

          <el-form-item label="所属产品">
            <el-select
              v-model="searchParams.deviceType"
              placeholder="请选择所属产品"
            >
              <el-option label="全部产品" :value="null"></el-option>
              <el-option
                v-for="(item, index) in deviceType"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="设备状态">
            <el-select
              v-model="searchParams.status"
              placeholder="请选择设备状态"
            >
              <el-option label="全部状态" :value="null"></el-option>
              <el-option
                v-for="(item, index) in deviceStatus"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="btns-wrapper" style="text-align: center">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="search"
            >搜索</el-button
          >
          <el-button
            type="default"
            icon="el-icon-refresh"
            size="mini"
            @click="refresh"
            >重置</el-button
          >
        </div>
      </div>
      <div class="search-ball" slot="reference">
        <span class="el-icon-search"></span>
      </div>
    </el-popover>
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
      markers: []
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
     * https://i.loli.net/2021/07/27/8IpceAPmVL4gNTz.png
     https://i.loli.net/2021/07/27/TKXzNU5EkbjolMI.png
     https://i.loli.net/2021/07/27/5NCSxJq6lfMY91O.png
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
        let content = `
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

            </div>

            <div class="info-foot">
              <a href="javascript:;" onClick="doDetail(${
                lnglats[i].deviceId
              }, ${lnglats[i].deviceType})">进入详情</a>
            </div>
          </div>
        `;
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

      // let clickEmsIcon =  new AMap.Icon({
      //   image: "https://i.loli.net/2021/07/19/eWwrOMcHSGTsZ7E.png",
      //   size: new AMap.Size(40, 62), //图标大小
      //   imageSize: new AMap.Size(40, 62)
      // });
      if (e.target.content.indexOf("2KW移动电源") != -1) {
        e.target.setIcon(click2kwIcon);
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
      this.markers.map(item => {
        if (item.content.indexOf("2KW移动电源") != -1) {
          item.setIcon(click2kwIcon);
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
            resolve();
          }
        });
      });
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
#container {
  width: 100%;
  height: calc(100vh - 34px - 50px);
}

.container {
  position: relative;
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
