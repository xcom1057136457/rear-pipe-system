const MUTATIONS = {
  SET_DEVICEINDEX: 'SET_DEVICEINDEX',
  SET_DEVICESHOW: 'SET_DEVICESHOW'
}

const device = {
  namespaced: true,
  state: {
    deviceList: [
      {
        deviceType: 0,
        deviceName: '工业户外电源'
      },
      {
        deviceType: 1,
        deviceName: '智能配网储能电源'
      },
      {
        deviceType: 2,
        deviceName: '基站电源'
      },
      {
        deviceType: 3,
        deviceName: '分布式微电网'
      }
    ],
    deviceIndex: 0,
    deviceShow: false
  },
  getters: {
    currentDevice(state) {
      return state.deviceList[state.deviceIndex]
    }
  },
  mutations: {
    [MUTATIONS.SET_DEVICEINDEX]: (state, data) => {
      state.deviceIndex = data
    },
    [MUTATIONS.SET_DEVICESHOW]: (state, data) => {
      state.deviceShow = data
    }
  },
  actions: {
    getDeviceIndex({ commit }, params) {
      commit(MUTATIONS.SET_DEVICEINDEX, params)
    },
    getDeviceShow({ commit }, params) {
      commit(MUTATIONS.SET_DEVICESHOW, params)
    }
  }
}

export default device