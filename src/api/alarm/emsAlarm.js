import request from "@/utils/request"

// 获取报警信息
export function getAlarmPage(params) {
  return request({
    url: '/system/alarm/list',
    method: 'GET',
    params
  });
}