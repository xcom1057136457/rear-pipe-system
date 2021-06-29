<template>
  <div id="container"></div>
</template>

<script>
import { getAllDevice } from "@/api/monitor/device";
export default {
  name: "index",
  data() {
    return {
      map: null,
      infoWindow: null,
      deviceInfo: []
    };
  },
  methods: {
    createMap() {
      return new Promise(resolve => {
        this.map = new AMap.Map("container", {
          zoom: 15, //级别
          center: [Number(this.deviceInfo[0].longitude), Number(this.deviceInfo[0].latitude)], //中心点坐标
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
    async initMap() {
      await this.getAllDeviceHandler();
      await this.createMap();
      var lnglats = this.deviceInfo;
      this.infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -35) });
      for (var i = 0, marker; i < lnglats.length; i++) {
        var marker = new AMap.Marker({
          position: [Number(lnglats[i].longitude), Number(lnglats[i].latitude)],
          map: this.map
        });
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
                <span>所属产品：</span>
                <span>${lnglats[i].deviceTypeName}</span>
              </div>

              <div class="info-item">
                <span>联系厂家：</span>
                <span>${lnglats[i].manufactor || "暂无数据"}</span>
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
              <a href="javascript:;" onClick="doDetail(${lnglats[i].deviceId})">进入详情</a>
            </div>
          </div>
        `;
        marker.content = content;
        marker.on("click", this.markerClick);
      }
    },
    markerClick(e) {
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(this.map, e.target.getPosition());
    },
    // 获取设备数据
    getAllDeviceHandler() {
      return new Promise(resolve => {
        getAllDevice().then(res => {
          if (res.code == 200) {
            this.deviceInfo = res.rows;
            resolve();
          }
        });
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
    let that = this
    window.doDetail = (val) => {
      that.$router.push({
        name: 'DeviceListDetail',
        query: {
          deviceId: val
        }
      })
    }
  }
};
</script>

<style scoped lang="scss">
#container {
  width: 100%;
  height: calc(100vh - 34px - 50px);
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
}

::v-deep .info-wrapper {
  background-color: #fff;
  width: 200px;
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
</style>
