<template>
  <div class="device-mask" v-if="deviceShow">
    <div class="device-wrapper">
      <div v-for="(item, index) in deviceList" :key="index">
        <div @click="closeWindow">
          {{ item.deviceName }}
        </div>
      </div>

      <div class="btn-wrapper" @click="closeWindow">关闭窗口</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      deviceList: state => state.device.deviceList,
      deviceShow: state => state.device.deviceShow
    })
  },
  methods: {
    ...mapActions("device", ["getDeviceIndex", "getDeviceShow"]),
    closeWindow() {
      this.getDeviceShow(false)
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.device-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  z-index: 999999999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  .device-wrapper {
    width: 500px;
    > div:not(:last-child) {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      padding: 20px;
      overflow: hidden;
      box-sizing: border-box;
      display: inline-block;
      transform: translateZ(0);
      position: relative;
      animation-duration: 1s;
      > div {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 20px;
        color: #fff;
        font-weight: bold;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        cursor: pointer;
      }
      &:first-child {
        animation-name: topLeftMove;
        > div {
          background-image: url("../../../assets/images/device1.jpg");
        }
      }

      &:nth-child(2) {
        animation-name: topRightMove;
        > div {
          background-image: url("../../../assets/images/device2.jpg");
        }
      }

      &:nth-child(3) {
        animation-name: bottomLeftMove;
        > div {
          background-image: url("../../../assets/images/device3.jpg");
        }
      }

      &:nth-child(4) {
        animation-name: bottomRightMove;
        > div {
          background-image: url("../../../assets/images/device4.jpg");
        }
      }
    }
  }
}

.btn-wrapper {
  width: 400px;
  margin: 40px auto 0;
  text-align: center;
  background-color: #fff;
  border: 1px solid #f0f0f0;
  padding: 10px 0;
  font-size: 14px;
  cursor: pointer;
  transition-property: all;
  transition-duration: .3s;
  position: relative;
  animation-name: btnMove;
  animation-duration: .5s;
  animation-timing-function: linear;
  transform: translateZ(0);
  &:hover {
    border: 1px solid #409EFF;
    color: #409EFF;
    background-color: rgba(#409EFF, 0.1);
  }
}

@keyframes btnMove {
  from {
    bottom: -50px;
  }

  to {
    bottom: 0in;
  }
}

@keyframes topLeftMove {
  to {
    top: 0px;
    left: 0px;
  }

  from {
    top: -150px;
    left: -150px;
  }
}

@keyframes bottomLeftMove {
  to {
    top: 0px;
    left: 0px;
  }

  from {
    top: 150px;
    left: -150px;
  }
}

@keyframes topRightMove {
  to {
    top: 0px;
    left: 0px;
  }

  from {
    top: -150px;
    left: 150px;
  }
}

@keyframes bottomRightMove {
  to {
    top: 0px;
    left: 0px;
  }

  from {
    top: 150px;
    left: 150px;
  }
}
</style>
