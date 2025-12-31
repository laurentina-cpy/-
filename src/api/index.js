import request from '../utils/request'

// 管理员登录
export const adminLogin = (data) => {
  return request.post('/api/admin/login', data)
}

// 获取管理员信息
export const getAdminInfo = () => {
  return request.get('/api/admin/info')
}

// ========== 仪表板 ==========
// 获取统计数据
export const getDashboardStats = () => {
  return request.get('/api/admin/dashboard/stats')
}

// 获取销售趋势
export const getSalesTrend = () => {
  return request.get('/api/admin/dashboard/sales-trend')
}

// 获取热门商品
export const getHotGoods = () => {
  return request.get('/api/admin/dashboard/hot-goods')
}

// ========== 商品管理 ==========
// 获取商品列表
export const getGoodsList = (params) => {
  return request.get('/api/admin/goods/list', { params })
}

// 创建商品
export const createGoods = (data) => {
  return request.post('/api/admin/goods/create', data)
}

// 更新商品
export const updateGoods = (id, data) => {
  return request.put(`/api/admin/goods/update/${id}`, data)
}

// 删除商品
export const deleteGoods = (id) => {
  return request.delete(`/api/admin/goods/delete/${id}`)
}

// 批量删除商品
export const batchDeleteGoods = (data) => {
  return request.post('/api/admin/goods/batch-delete', data)
}

// 更新商品状态
export const updateGoodsStatus = (id, data) => {
  return request.patch(`/api/admin/goods/update/${id}`, data)
}

// ========== 分类管理 ==========
// 获取分类列表
export const getCategoriesList = () => {
  return request.get('/api/admin/categories/list')
}

// 创建分类
export const createCategory = (data) => {
  return request.post('/api/admin/categories/create', data)
}

// 更新分类
export const updateCategory = (id, data) => {
  return request.put(`/api/admin/categories/update/${id}`, data)
}

// 删除分类
export const deleteCategory = (id) => {
  return request.delete(`/api/admin/categories/delete/${id}`)
}

// ========== 供应商管理 ==========
// 获取供应商列表
export const getSuppliersList = (params) => {
  return request.get('/api/admin/suppliers/list', { params })
}

// 创建供应商
export const createSupplier = (data) => {
  return request.post('/api/admin/suppliers/create', data)
}

// 更新供应商
export const updateSupplier = (id, data) => {
  return request.put(`/api/admin/suppliers/update/${id}`, data)
}

// 删除供应商
export const deleteSupplier = (id) => {
  return request.delete(`/api/admin/suppliers/delete/${id}`)
}

// 更新供应商状态
export const updateSupplierStatus = (id, data) => {
  return request.patch(`/api/admin/suppliers/update/${id}`, data)
}

// ========== 配送员管理 ==========
// 获取配送员列表
export const getDeliveryList = (params) => {
  return request.get('/api/admin/delivery/list', { params })
}

// 获取可用配送员
export const getAvailableDelivery = () => {
  return request.get('/api/admin/delivery/available')
}

// 创建配送员
export const createDelivery = (data) => {
  return request.post('/api/admin/delivery/create', data)
}

// 更新配送员
export const updateDelivery = (id, data) => {
  return request.put(`/api/admin/delivery/update/${id}`, data)
}

// 删除配送员
export const deleteDelivery = (id) => {
  return request.delete(`/api/admin/delivery/delete/${id}`)
}

// ========== 用户管理 ==========
// 获取用户列表
export const getUsersList = (params) => {
  return request.get('/api/admin/users/list', { params })
}

// 更新用户状态
export const updateUserStatus = (id, data) => {
  return request.patch(`/api/admin/users/status/${id}`, data)
}

// ========== 订单管理 ==========
// 获取订单列表
export const getOrdersList = (params) => {
  return request.get('/api/admin/orders/list', { params })
}

// 获取订单详情
export const getOrderDetail = (id) => {
  return request.get(`/api/admin/orders/detail/${id}`)
}

// 分配配送员
export const assignDelivery = (id, data) => {
  return request.put(`/api/admin/orders/assign/${id}`, data)
}

// 完成订单
export const completeOrder = (id) => {
  return request.put(`/api/admin/orders/complete/${id}`)
}

// 取消订单
export const cancelOrder = (id) => {
  return request.put(`/api/admin/orders/cancel/${id}`)
}

// 导出订单
export const exportOrders = (params) => {
  return request.get('/api/admin/orders/export', { params, responseType: 'blob' })
}
