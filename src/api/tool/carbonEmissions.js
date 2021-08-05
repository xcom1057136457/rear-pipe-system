import request from '@/utils/request'

// 碳排放
export function getDeviceStatistics() {
  return request({
    url: '/manager/device/statistics',
    method: 'get'
  })
}