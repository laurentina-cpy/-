const sequelize = require('./config/db');
const Order = require('./models/Order');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功\n');

    const orders = await Order.findAll({
      order: [['create_time', 'DESC']]
    });

    if (orders.length === 0) {
      console.log('数据库中没有订单数据');
      await sequelize.close();
      return;
    }

    console.log(`共找到 ${orders.length} 条订单\n`);

    // 为订单设置不同的状态，方便测试
    const statuses = [1, 1, 2, 2, 3, 4, 4, 5]; // 各种状态的分布
    let updateCount = 0;

    for (let i = 0; i < Math.min(orders.length, statuses.length); i++) {
      const order = orders[i];
      const newStatus = statuses[i];

      if (order.status !== newStatus) {
        await order.update({ status: newStatus });
        updateCount++;
        console.log(`✓ 订单 ${order.order_number}: 状态 ${order.status} → ${newStatus} (${getStatusText(newStatus)})`);
      }
    }

    console.log(`\n共更新了 ${updateCount} 条订单的状态`);

    // 显示更新后的状态分布
    const updatedOrders = await Order.findAll();
    const statusCounts = {};
    updatedOrders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    console.log('\n更新后的订单状态分布:');
    Object.keys(statusCounts).sort().forEach(status => {
      console.log(`  状态 ${status} (${getStatusText(status)}): ${statusCounts[status]} 条`);
    });

    console.log('\n现在刷新管理后台，应该能看到各种状态的订单了！');

    await sequelize.close();
  } catch (e) {
    console.error('Error:', e.message);
  }
})();

function getStatusText(status) {
  const textMap = {
    0: '待支付',
    1: '已支付',
    2: '配送中',
    3: '已送达',
    4: '已完成',
    5: '已取消',
    6: '已退款'
  };
  return textMap[status] || '未知';
}
