/**
 * 检查订单状态和字段
 */
const Order = require('./models/Order');

async function checkOrders() {
  try {
    console.log('=== 订单状态检查 ===\n');

    // 获取所有订单
    const orders = await Order.findAll({
      attributes: ['order_id', 'order_number', 'status', 'total_amount', 'delivery_person_id'],
      order: [['create_time', 'DESC']],
      limit: 10
    });

    console.log(`找到 ${orders.length} 个订单:\n`);

    orders.forEach((order, index) => {
      console.log(`订单 ${index + 1}:`);
      console.log(`  order_id: ${order.order_id}`);
      console.log(`  order_number: ${order.order_number}`);
      console.log(`  status: ${order.status}`);
      console.log(`  total_amount: ${order.total_amount}`);
      console.log(`  delivery_person_id: ${order.delivery_person_id || '未分配'}`);
      console.log('');
    });

    // 统计各状态订单数量
    const statusCounts = await Order.findAll({
      attributes: ['status', [require('sequelize').fn('COUNT', require('sequelize').col('order_id')), 'count']],
      group: ['status'],
      raw: true
    });

    console.log('=== 状态统计 ===');
    const statusNames = {
      0: '待支付',
      1: '已支付',
      2: '配送中',
      3: '已送达',
      4: '已完成',
      5: '已取消',
      6: '已退款'
    };

    statusCounts.forEach(stat => {
      console.log(`  ${stat.status} (${statusNames[stat.status] || '未知'}): ${stat.count} 个`);
    });

  } catch (error) {
    console.error('检查失败:', error);
  } finally {
    process.exit(0);
  }
}

checkOrders();
