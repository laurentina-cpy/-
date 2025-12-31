/**
 * 修复所有订单的状态，让它们显示不同的状态
 */
const sequelize = require('./config/db');
const Order = require('./models/Order');

(async () => {
  try {
    console.log('========== 开始修复订单状态 ==========\n');

    // 连接数据库
    await sequelize.authenticate();
    console.log('✓ 数据库连接成功\n');

    // 获取所有订单
    const allOrders = await Order.findAll({
      attributes: ['order_id', 'order_number', 'status'],
      order: [['create_time', 'DESC']]
    });

    console.log(`找到 ${allOrders.length} 条订单\n`);

    if (allOrders.length === 0) {
      console.log('数据库中没有订单数据');
      await sequelize.close();
      return;
    }

    // 定义要分配的状态
    const statusMap = [1, 1, 2, 2, 3, 4, 4, 5, 6];

    console.log('========== 开始更新订单状态 ==========\n');
    let updateCount = 0;

    for (let i = 0; i < Math.min(allOrders.length, statusMap.length); i++) {
      const order = allOrders[i];
      const newStatus = statusMap[i];

      console.log(`订单 ${i + 1}: ${order.order_number}`);
      console.log(`  order_id: ${order.order_id}`);
      console.log(`  当前状态: ${order.status}`);

      if (order.status !== newStatus) {
        // 更新状态
        await order.update({ status: newStatus });

        // 如果是已支付或以上状态，添加支付时间
        if (newStatus >= 1 && !order.pay_time) {
          await order.update({ pay_time: new Date() });
        }

        // 如果是已完成状态，添加完成时间
        if (newStatus === 4 && !order.finish_time) {
          await order.update({ finish_time: new Date() });
        }

        console.log(`  ✓ 状态已更新为: ${newStatus} (${getStatusText(newStatus)})`);
        updateCount++;
      } else {
        console.log(`  - 状态无需更新`);
      }
      console.log('');
    }

    console.log(`========== 更新完成 ==========\n`);
    console.log(`共更新了 ${updateCount} 条订单的状态\n`);

    // 显示更新后的统计
    const updatedOrders = await Order.findAll({
      attributes: ['status'],
      order: [['create_time', 'DESC']]
    });

    const statusCounts = {};
    updatedOrders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    console.log('========== 订单状态分布 ==========');
    Object.keys(statusCounts).sort().forEach(status => {
      const statusText = getStatusText(status);
      console.log(`  状态 ${status} (${statusText}): ${statusCounts[status]} 条`);
    });

    await sequelize.close();
    console.log('\n✓ 数据库连接已关闭');
    console.log('\n✅ 订单状态修复完成！现在刷新管理后台页面，应该能看到不同状态的订单了。\n');

  } catch (error) {
    console.error('✗ 错误:', error.message);
    await sequelize.close();
    process.exit(1);
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
