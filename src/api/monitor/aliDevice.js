import request from '@/utils/request'

// 获取阿里云设备列表
export function getDeviceList(params) {
  return request({
    url: '/device/manager/deviceList',
    method: 'get',
    params
  })
}