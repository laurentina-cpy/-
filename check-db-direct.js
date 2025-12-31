/**
 * 直接使用Sequelize查询数据库，不经过任何API层
 */
const sequelize = require('./config/db');
const Order = require('./models/Order');

(async () => {
  try {
    console.log('========== 连接数据库 ==========');
    await sequelize.authenticate();
    console.log('✓ 数据库连接成功\n');

    console.log('========== 查询前10条订单 ==========');
    const orders = await Order.findAll({
      attributes: ['order_id', 'order_number', 'status', 'total_amount', 'create_time'],
      limit: 10,
      order: [['create_time', 'DESC']],
      raw: true // 返回原始数据，不转换为模型实例
    });

    console.log(`找到 ${orders.length} 条订单:\n`);

    orders.forEach((order, index) => {
      console.log(`${index + 1}. 订单号: ${order.order_number}`);
      console.log(`   order_id: ${order.order_id}`);
      console.log(`   status: ${order.status} (类型: ${typeof order.status})`);
      console.log(`   total_amount: ${order.total_amount}`);
      console.log('');
    });

    // 统计状态分布
    console.log('========== 状态分布统计 ==========');
    const statusCounts = {};
    orders.forEach(order => {
      const statusKey = String(order.status);
      statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
    });

    Object.keys(statusCounts).sort().forEach(status => {
      const statusText = status === '0' ? '待支付' :
                        status === '1' ? '已支付' :
                        status === '2' ? '配送中' :
                        status === '3' ? '已送达' :
                        status === '4' ? '已完成' :
                        status === '5' ? '已取消' :
                        status === '6' ? '已退款' : '未知';
      console.log(`  状态 ${status} (${statusText}): ${statusCounts[status]} 条`);
    });

    await sequelize.close();
    console.log('\n✓ 数据库连接已关闭');

  } catch (error) {
    console.error('✗ 错误:', error.message);
    process.exit(1);
  }
})();
