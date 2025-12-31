const { sequelize } = require('./config/db');
const Order = require('./models/Order');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功\n');

    const orders = await Order.findAll({
      attributes: ['order_id', 'order_number', 'status', 'total_amount', 'create_time'],
      limit: 10,
      order: [['create_time', 'DESC']]
    });

    console.log('最近10条订单数据:');
    console.log('==============================================');
    orders.forEach(o => {
      const createTime = new Date(o.create_time).toLocaleString('zh-CN', { hour12: false });
      console.log(`订单号: ${o.order_number}`);
      console.log(`状态: ${o.status} (${getStatusText(o.status)})`);
      console.log(`金额: ¥${o.total_amount}`);
      console.log(`创建时间: ${createTime}`);
      console.log('---');
    });

    // 统计各状态订单数量
    const statusCounts = await Order.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('order_id')), 'count']],
      group: ['status'],
      raw: true
    });

    console.log('\n各状态订单统计:');
    console.log('==============================================');
    statusCounts.forEach(sc => {
      console.log(`状态 ${sc.status} (${getStatusText(sc.status)}): ${sc.count} 条`);
    });

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
