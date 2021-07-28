import request from '@/utils/request'

// 查询设备运行日志列表
export function listLog(query) {
  return request({
    url: '/system/log/list',
    method: 'get',
    params: query
  })
}

// 查询设备运行日志详细
export function getLog(logId) {
  return request({
    url: '/system/log/' + logId,
    method: 'get'
  })
}

// 新增设备运行日志
export function addLog(data) {
  return request({
    url: '/system/log',
    method: 'post',
    data: data
  })
}

// 修改设备运行日志
export function updateLog(data) {
  return request({
    url: '/system/log',
    method: 'put',
    data: data
  })
}

// 删除设备运行日志
export function delLog(logId) {
  return request({
    url: '/system/log/' + logId,
    method: 'delete'
  })
}

// 导出设备运行日志
export function exportLog(query) {
  return request({
    url: '/system/log/export',
    method: 'get',
    params: query
  })
}