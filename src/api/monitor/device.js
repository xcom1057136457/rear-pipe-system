import request from '@/utils/request'

// 获取设备列表
export function getDeviceList(params) {
  return request({
    url: "/manager/device/list",
    method: 'get',
    params
  })
}

// 新增设备
export function addDevice(data) {
  return request({
    url: '/manager/device/deviceAdd',
    method: 'post',
    data
  })
}