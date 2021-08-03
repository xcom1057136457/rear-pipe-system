import request from '@/utils/request'

// 查询设备告警信息列表
export function listAlarm(query) {
  return request({
    url: '/device/alarm/list',
    method: 'get',
    params: query
  })
}

// 查询设备告警信息详细
export function getAlarm(warnsId) {
  return request({
    url: '/device/alarm/' + warnsId,
    method: 'get'
  })
}

// 新增设备告警信息
export function addAlarm(data) {
  return request({
    url: '/device/alarm',
    method: 'post',
    data: data
  })
}

// 修改设备告警信息
export function updateAlarm(data) {
  return request({
    url: '/device/alarm',
    method: 'put',
    data: data
  })
}

// 删除设备告警信息
export function delAlarm(warnsId) {
  return request({
    url: '/device/alarm/' + warnsId,
    method: 'delete'
  })
}

// 导出设备告警信息
export function exportAlarm(query) {
  return request({
    url: '/device/alarm/export',
    method: 'get',
    params: query
  })
}