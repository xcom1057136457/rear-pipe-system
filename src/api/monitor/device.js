import request from '@/utils/request'

// 获取设备列表
export function getDeviceList(params) {
  return request({
    url: "/manager/device/list",
    method: 'get',
    params
  })
}

// 获取全部设备
export function getAllDevice() {
  return request({
    url: '/manager/device/deviceList',
    method: 'get'
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

// 过滤出未使用的设备SN码
export function getDeviceSn(params) {
  return request({
    url: '/device/manager/listBySn',
    method: 'get',
    params
  })
}

// 删除设备
export function deleteDevice(deviceId) {
  return request({
    url: '/manager/device/deleteDeviceById/' + deviceId,
    method: 'delete'
  })
}

// 批量删除设备
export function batchDeleteDevice(deviceIds) {
  return request({
    url: `/manager/device/deleteDeviceByIds/${deviceIds}`,
    method: 'delete'
  })
}

// 查看详情
export function getDeiveDetail(params) {
  return request({
    url: '/manager/device/deviceInfo',
    method: 'get',
    params
  })
}

// 搜索SN
export function getSN(params) {
  return request({
    url: '/device/manager/listBySn',
    method: 'get',
    params
  })
}

// 修改
export function updateDevice(data) {
  return request({
    url: '/manager/device/deviceEdit/',
    method: 'put',
    data
  })
}

// 导出
export function exportDevice(params) {
  return request({
    url: '/manager/device/export',
    method: 'get',
    params
  })
}

// 下载模板
export function importTemplate() {
  return request({
    url: '/manager/device/importTemplate',
    method: 'get'
  })
}

// 发布控制指令
export function deviceControl(data) {
  return request({
    url: '/manager/device/ctrl',
    method: 'post',
    data
  })
}