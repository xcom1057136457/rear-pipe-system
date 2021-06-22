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
          center: [this.deviceInfo[0].longitude, this.deviceInfo[0].latitude], //中心点坐标
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
      this.infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
      for (var i = 0, marker; i < lnglats.length; i++) {
        var marker = new AMap.Marker({
          position: [lnglats[i].longitude, lnglats[i].latitude],
          map: this.map
        });
        let content = `
          <table style="width: 720px;border-left: 1px solid #dedede;border-bottom: 1px solid #dedede;border-collapse: collapse;">
            <tr>
              <td class="label" style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;background-color: #f0f0f0;width:110px">设备编码</td>
              <td style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;">${ lnglats[i].deviceCode}</td>
              <td class="label" style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;background-color: #f0f0f0;width:110px">设备名称</td>
              <td style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;">${ lnglats[i].deviceName}</td>
              <td class="label" style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;background-color: #f0f0f0;width:110px">设备SN码</td>
              <td style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;">${ lnglats[i].sn}</td>
            </tr>

            <tr>
              <td class="label" style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;background-color: #f0f0f0;width:110px">所属产品</td>
              <td style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;">${ lnglats[i].deviceType}</td>
              <td class="label" style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;background-color: #f0f0f0;width:110px">设备专责</td>
              <td style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;">${ lnglats[i].equipSpecialist}</td>
              <td class="label" style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;background-color: #f0f0f0;width:110px">IEME卡号</td>
              <td style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;">${ lnglats[i].ieme}</td>
            </tr>

            <tr>
              <td class="label" style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;background-color: #f0f0f0;width:110px">安装位置</td>
              <td style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;">${ lnglats[i].installPosition}</td>
              <td class="label" style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;background-color: #f0f0f0;width:110px">联系厂家</td>
              <td style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;">${ lnglats[i].manufactor}</td>
              <td class="label" style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;background-color: #f0f0f0;width:110px">电网专责</td>
              <td style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;">${ lnglats[i].powergridSpecialist}</td>
            </tr>

            <tr>
              <td class="label" style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;background-color: #f0f0f0;width:110px">备注</td>
              <td colspan="5" style="border-top: 1px solid #dedede;border-right: 1px solid #dedede;padding: 10px 0 10px 10px;">${ lnglats[i].remark}</td>
            </tr>
          </table>
        `;
        marker.content = content;
        marker.on("click", this.markerClick);
        marker.emit("click", { target: marker });
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
          console.log(res);
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
</style>
