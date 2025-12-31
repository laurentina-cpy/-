/**
 * 创建一个测试订单，用于验证状态更新
 */
const Order = require('./models/Order');
const { generateId } = require('./utils');

async function createTestOrder() {
  try {
    console.log('=== 创建测试订单 ===\n');

    // 创建一个已支付状态的订单
    const testOrder = await Order.create({
      order_id: generateId(),
      order_number: 'TEST' + Date.now(),
      user_id: 'test_user_001',
      status: 1, // 已支付 - 可以分配配送员
      total_amount: 99.90,
      delivery_fee: 0,
      address_id: 'test_addr_001',
      delivery_address: '测试地址-1栋101室',
      contact_phone: '13800138000',
      pay_time: new Date()
    });

    console.log('✓ 测试订单创建成功！');
    console.log(`  order_id: ${testOrder.order_id}`);
    console.log(`  order_number: ${testOrder.order_number}`);
    console.log(`  status: ${testOrder.status} (已支付)`);
    console.log(`  total_amount: ${testOrder.total_amount}`);
    console.log('\n现在可以到管理后台找到这个订单，测试分配配送员功能');
    console.log('订单编号:', testOrder.order_number);

  } catch (error) {
    console.error('创建测试订单失败:', error);
  } finally {
    process.exit(0);
  }
}

createTestOrder();
