import request from '@/utils/request'

// 获取阿里云设备列表
export function getDeviceList(params) {
  return request({
    url: '/device/manager/deviceList',
    method: 'get',
    params
  })
}

// 获取阿里云设备详情
export function getDeviceDetail(params) {
  return request({
    url: '/device/manager/deviceInfo',
    method: 'get',
    params
  })
}

// 新增阿里云设备
export function addDevice(data) {
  return request({
    url: '/device/manager/registerDevice',
    method: 'post',
    data
  })
}

// 删除阿里云设备
export function deleteDevice(params) {
  return request({
    url: '/device/manager/deleteDevice',
    method: 'delete',
    params
  })
}