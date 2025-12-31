/**
 * 最简单的数据库检查 - 不用Sequelize
 */
const mysql = require('mysql2/promise');

(async () => {
  try {
    console.log('========== 直接查询数据库 ==========\n');

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'AZ132456',
      database: 'chengxiaoer'
    });

    console.log('✓ 数据库连接成功\n');

    // 查询所有订单
    const [orders] = await connection.query(
      'SELECT order_id, order_number, status, create_time, update_time FROM `order` ORDER BY update_time DESC'
    );

    console.log(`共 ${orders.length} 条订单\n`);

    orders.forEach((order, index) => {
      const statusText = order.status === 0 ? '待支付' :
                        order.status === 1 ? '已支付' :
                        order.status === 2 ? '配送中' :
                        order.status === 3 ? '已送达' :
                        order.status === 4 ? '已完成' :
                        order.status === 5 ? '已取消' :
                        order.status === 6 ? '已退款' : '未知';

      console.log(`${index + 1}. ${order.order_number}`);
      console.log(`   status: ${order.status} (${statusText})`);
      console.log(`   update_time: ${order.update_time}`);
      console.log('');
    });

    // 统计状态分布
    const [stats] = await connection.query(
      'SELECT status, COUNT(*) as count FROM `order` GROUP BY status ORDER BY status'
    );

    console.log('========== 状态分布 ==========');
    stats.forEach(stat => {
      const statusText = stat.status === 0 ? '待支付' :
                        stat.status === 1 ? '已支付' :
                        stat.status === 2 ? '配送中' :
                        stat.status === 3 ? '已送达' :
                        stat.status === 4 ? '已完成' :
                        stat.status === 5 ? '已取消' :
                        stat.status === 6 ? '已退款' : '未知';
      console.log(`  状态 ${stat.status} (${statusText}): ${stat.count} 条`);
    });

    await connection.end();
    console.log('\n✓ 数据库连接已关闭');

  } catch (error) {
    console.error('✗ 错误:', error.message);
    process.exit(1);
  }
})();
