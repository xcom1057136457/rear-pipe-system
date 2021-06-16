import request from '@/utils/request'

// 获取阿里云产品列表
export function getAliProduct() {
  return request({
    url: '/device/manager/productList',
    method: 'get'
  })
}

// 获取阿里云产品详情
export function getAliProductDetail(params) {
  return request({
    url: '/device/manager/productInfo',
    method: 'get',
    params
  })
}