import request from "@/utils/request"

// 获取产品列表
export function getProductList(params) {
  return request({
    url: '/manager/device/product_list',
    method: 'get',
    params
  })
}

// 新增产品
export function addProduct(data) {
  return request({
    url: '/manager/device/productAdd',
    method: 'post',
    data
  })
}

// 修改产品
export function updateProduct(data) {
  return request({
    url: '/manager/device/productEdit/',
    method: 'put',
    data
  })
}

// 删除产品
export function deleteProduct(productId) {
  return request({
    url: `/manager/device/deleteProductById/${productId}`,
    method: 'delete'
  })
}

// 批量删除
export function batchDeleteProduct(productIds) {
  return request({
    url: `/manager/device/deleteProductByIds/${productIds}`,
    method: 'delete'
  })
}

// 获取产品详情
export function getProductDetail(params) {
  return request({
    url: '/manager/device/productInfo',
    method: 'get',
    params
  })
}

// 获取全部产品
export function getAllProduct() {
  return request({
    url: '/manager/device/productList',
    method: 'get'
  })
}