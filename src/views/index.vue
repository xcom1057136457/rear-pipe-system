<template>
  <div id="container"></div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      map: null,
      infoWindow: null
    };
  },
  methods: {
    createMap() {
      return new Promise(resolve => {
        this.map = new AMap.Map("container", {
          zoom: 11, //级别
          center: [112.98, 28.19], //中心点坐标
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
      await this.createMap();
      var lnglats = [
        [116.368904, 39.923423],
        [116.382122, 39.921176],
        [116.387271, 39.922501],
        [116.398258, 39.9146]
      ];
      this.infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
      for (var i = 0, marker; i < lnglats.length; i++) {
        var marker = new AMap.Marker({
          position: lnglats[i],
          map: this.map
        });
        marker.content = "我是第" + (i + 1) + "个Marker";
        marker.on("click", this.markerClick);
        marker.emit("click", { target: marker });
      }
    },
    markerClick(e) {
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(this.map, e.target.getPosition());
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
</style>
