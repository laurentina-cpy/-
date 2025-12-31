const sequelize = require('./config/db');
const { QueryTypes } = require('sequelize');

(async () => {
  try {
    console.log('连接数据库...');
    await sequelize.authenticate();
    console.log('数据库连接成功\n');

    // 直接查询数据库原始数据
    const [results] = await sequelize.query(
      'SELECT order_id, order_number, status, total_amount, create_time FROM `order` ORDER BY create_time DESC LIMIT 10'
    );

    console.log('========== 数据库原始数据 ==========');
    console.log(`共 ${results.length} 条记录\n`);

    if (results.length === 0) {
      console.log('数据库中没有订单数据');
    } else {
      results.forEach((row, index) => {
        console.log(`订单 ${index + 1}:`);
        console.log(`  order_id: ${row.order_id}`);
        console.log(`  order_number: ${row.order_number}`);
        console.log(`  status: ${row.status} (类型: ${typeof row.status})`);
        console.log(`  total_amount: ${row.total_amount}`);
        console.log('');
      });

      // 统计状态分布
      const statusCounts = {};
      results.forEach(row => {
        const statusKey = String(row.status);
        statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
      });

      console.log('========== 状态分布 ==========');
      Object.keys(statusCounts).forEach(status => {
        const statusText = status === '0' ? '待支付' :
                          status === '1' ? '已支付' :
                          status === '2' ? '配送中' :
                          status === '3' ? '已送达' :
                          status === '4' ? '已完成' :
                          status === '5' ? '已取消' :
                          status === '6' ? '已退款' : '未知';
        console.log(`  状态 ${status} (${statusText}): ${statusCounts[status]} 条`);
      });
    }

    await sequelize.close();
    console.log('\n数据库连接已关闭');
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
