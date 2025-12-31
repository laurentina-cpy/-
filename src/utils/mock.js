// 模拟数据 - 开发测试使用
const mockData = {
  // 管理员登录
  '/api/admin/login': {
    method: 'post',
    response: { code: 200, message: '登录成功', data: { token: 'mock-token-123', admin: { admin_id: 1, username: 'admin', real_name: '超级管理员' } } }
  },
  
  // 仪表板
  '/api/admin/dashboard/stats': {
    method: 'get',
    response: { code: 200, data: { totalUsers: 1256, totalGoods: 89, totalOrders: 3425, totalRevenue: 125680.50 } }
  },
  '/api/admin/dashboard/sales-trend': {
    method: 'get',
    response: { 
      code: 200, 
      data: [
        { date: '01-01', amount: 1200 },
        { date: '01-02', amount: 1800 },
        { date: '01-03', amount: 1500 },
        { date: '01-04', amount: 2200 },
        { date: '01-05', amount: 1900 },
        { date: '01-06', amount: 2400 },
        { date: '01-07', amount: 2800 }
      ] 
    }
  },
  '/api/admin/dashboard/hot-goods': {
    method: 'get',
    response: { 
      code: 200, 
      data: [
        { name: '新鲜苹果', sales: 156 },
        { name: '香蕉', sales: 132 },
        { name: '草莓', sales: 98 },
        { name: '橙子', sales: 85 },
        { name: '葡萄', sales: 72 }
      ] 
    }
  },
  
  // 商品列表
  '/api/admin/goods/list': {
    method: 'get',
    response: { 
      code: 200, 
      data: { 
        rows: [
          { goods_id: 1, name: '新鲜苹果', category_id: 1, category_name: '水果', price: 12.5, stock: 100, sales: 156, status: '1', create_time: '2024-01-01 10:00:00' },
          { goods_id: 2, name: '香蕉', category_id: 1, category_name: '水果', price: 8.0, stock: 200, sales: 132, status: '1', create_time: '2024-01-02 11:00:00' },
          { goods_id: 3, name: '草莓', category_id: 1, category_name: '水果', price: 25.0, stock: 50, sales: 98, status: '1', create_time: '2024-01-03 12:00:00' },
          { goods_id: 4, name: '牛奶', category_id: 2, category_name: '饮品', price: 15.0, stock: 80, sales: 245, status: '1', create_time: '2024-01-04 13:00:00' },
          { goods_id: 5, name: '面包', category_id: 3, category_name: '烘焙', price: 18.0, stock: 60, sales: 189, status: '0', create_time: '2024-01-05 14:00:00' }
        ],
        count: 5 
      } 
    }
  },
  
  // 分类列表
  '/api/admin/categories/list': {
    method: 'get',
    response: { 
      code: 200, 
      data: [
        { category_id: 1, category_name: '水果', description: '新鲜水果', sort_order: 1, goods_count: 35, create_time: '2024-01-01 09:00:00' },
        { category_id: 2, category_name: '饮品', description: '各类饮料', sort_order: 2, goods_count: 28, create_time: '2024-01-01 09:00:00' },
        { category_id: 3, category_name: '烘焙', description: '面包糕点', sort_order: 3, goods_count: 15, create_time: '2024-01-01 09:00:00' },
        { category_id: 4, category_name: '零食', description: '休闲零食', sort_order: 4, goods_count: 22, create_time: '2024-01-01 09:00:00' }
      ] 
    }
  },
  
  // 供应商列表
  '/api/admin/suppliers/list': {
    method: 'get',
    response: { 
      code: 200, 
      data: [
        { supplier_id: 1, name: '水果供应商A', contact_person: '张三', contact_phone: '13800138001', address: '浙江省杭州市', status: '1', create_time: '2024-01-01 08:00:00' },
        { supplier_id: 2, name: '饮料供应商B', contact_person: '李四', contact_phone: '13800138002', address: '浙江省宁波市', status: '1', create_time: '2024-01-01 08:00:00' },
        { supplier_id: 3, name: '烘焙供应商C', contact_person: '王五', contact_phone: '13800138003', address: '浙江省温州市', status: '0', create_time: '2024-01-01 08:00:00' }
      ] 
    }
  },
  
  // 配送员列表
  '/api/admin/delivery/list': {
    method: 'get',
    response: { 
      code: 200, 
      data: [
        { delivery_id: 1, name: '赵六', phone: '13900139001', id_card: '330106199001011234', plate_number: '浙A12345', status: 'idle', total_orders: 156, total_amount: 3120, create_time: '2024-01-01 07:00:00' },
        { delivery_id: 2, name: '孙七', phone: '13900139002', id_card: '330106199002022345', plate_number: '浙A67890', status: 'busy', total_orders: 198, total_amount: 3960, create_time: '2024-01-02 07:00:00' },
        { delivery_id: 3, name: '周八', phone: '13900139003', id_card: '330106199003033456', plate_number: '浙A11111', status: 'idle', total_orders: 134, total_amount: 2680, create_time: '2024-01-03 07:00:00' }
      ] 
    }
  },
  '/api/admin/delivery/available': {
    method: 'get',
    response: { 
      code: 200, 
      data: [
        { delivery_id: 1, name: '赵六', phone: '13900139001' },
        { delivery_id: 3, name: '周八', phone: '13900139003' }
      ] 
    }
  },
  
  // 用户列表
  '/api/admin/users/list': {
    method: 'get',
    response: { 
      code: 200, 
      data: { 
        rows: [
          { user_id: 1, nickname: '用户A', phone: '13500135001', gender: 1, register_time: '2024-01-01 10:00:00', last_login_time: '2024-01-15 15:30:00', status: '1', total_orders: 12, total_amount: 356.5 },
          { user_id: 2, nickname: '用户B', phone: '13500135002', gender: 2, register_time: '2024-01-02 11:00:00', last_login_time: '2024-01-15 14:20:00', status: '1', total_orders: 8, total_amount: 228.0 },
          { user_id: 3, nickname: '用户C', phone: '13500135003', gender: 0, register_time: '2024-01-03 12:00:00', last_login_time: '2024-01-14 16:45:00', status: '0', total_orders: 5, total_amount: 142.5 }
        ],
        count: 3 
      } 
    }
  },
  
  // 订单列表
  '/api/admin/orders/list': {
    method: 'get',
    response: { 
      code: 200, 
      data: { 
        rows: [
          { 
            order_id: 1, order_no: 'ORD202401150001', user: { nickname: '用户A', phone: '13500135001' }, total_amount: 45.5, delivery_fee: 3.0, 
            status: 'completed', delivery: { name: '赵六' }, create_time: '2024-01-15 10:30:00', remark: '',
            address: { province: '浙江省', city: '杭州市', district: '钱塘区', detail: '求真1幢302室' },
            items: [
              { goods: { name: '新鲜苹果', price: 12.5 }, quantity: 2, subtotal: 25.0 },
              { goods: { name: '牛奶', price: 15.0 }, quantity: 1, subtotal: 15.0 }
            ]
          },
          { 
            order_id: 2, order_no: 'ORD202401150002', user: { nickname: '用户B', phone: '13500135002' }, total_amount: 68.0, delivery_fee: 3.0, 
            status: 'delivering', delivery: { name: '孙七' }, create_time: '2024-01-15 11:15:00', remark: '尽快送达',
            address: { province: '浙江省', city: '杭州市', district: '钱塘区', detail: '求真2幢201室' },
            items: [
              { goods: { name: '草莓', price: 25.0 }, quantity: 2, subtotal: 50.0 },
              { goods: { name: '面包', price: 18.0 }, quantity: 1, subtotal: 18.0 }
            ]
          },
          { 
            order_id: 3, order_no: 'ORD202401150003', user: { nickname: '用户A', phone: '13500135001' }, total_amount: 32.0, delivery_fee: 3.0, 
            status: 'waiting_delivery', delivery: null, create_time: '2024-01-15 12:00:00', remark: '',
            address: { province: '浙江省', city: '杭州市', district: '钱塘区', detail: '求真1幢302室' },
            items: [
              { goods: { name: '香蕉', price: 8.0 }, quantity: 2, subtotal: 16.0 },
              { goods: { name: '牛奶', price: 15.0 }, quantity: 1, subtotal: 15.0 }
            ]
          }
        ],
        count: 3 
      } 
    }
  }
}

export default mockData
