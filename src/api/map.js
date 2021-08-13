import request from "@/utils/request"

export function getMapList(params) {
  return request({
    url: '/manager/device/deviceMapList',
    method: 'get',
    params
  })
}