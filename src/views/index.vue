<template>
  <div id="container"></div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      map: null
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
        resolve();
      });
    },
    async initMap() {
      await this.createMap();
      let mapList = [[116.39, 39.9], [112.98, 28.19]]
      mapList.forEach(item => {
        let marker = new AMap.Marker({
          position: item
        })
        this.map.add(marker)
      })
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
