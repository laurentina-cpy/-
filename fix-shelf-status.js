const Goods = require('./models/Goods');
const db = require('./config/db');

async function fixGoodsStatus() {
  try {
    await db.authenticate();
    console.log('数据库连接成功');

    const result = await Goods.update(
      { shelf_status: 1 },
      { where: { shelf_status: 0 } }
    );

    console.log(`已将 ${result[0]} 个商品设置为上架状态`);

    const allGoods = await Goods.findAll({
      attributes: ['goods_id', 'name', 'sales_count', 'shelf_status'],
      order: [['sales_count', 'DESC']]
    });

    console.log('\n=== 修复后商品列表 ===');
    allGoods.forEach(item => {
      console.log(`商品: ${item.name}, 销量: ${item.sales_count}, 上架状态: ${item.shelf_status}`);
    });

  } catch (err) {
    console.error('错误:', err);
  } finally {
    process.exit();
  }
}

fixGoodsStatus();
