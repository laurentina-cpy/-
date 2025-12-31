const Goods = require('./models/Goods');
const db = require('./config/db');

async function checkSalesCount() {
  try {
    await db.authenticate();
    console.log('数据库连接成功');

    const goods = await Goods.findAll({
      attributes: ['goods_id', 'name', 'sales_count', 'shelf_status'],
      order: [['sales_count', 'DESC']]
    });

    console.log('\n=== 所有商品及销量 ===');
    goods.forEach(item => {
      console.log(`商品: ${item.name}, 销量: ${item.sales_count}, 上架状态: ${item.shelf_status}`);
    });

    console.log('\n=== 上架商品(sales_count > 0) ===');
    const onSaleGoods = goods.filter(g => g.shelf_status === 1 && g.sales_count > 0);
    console.log(`数量: ${onSaleGoods.length}`);
    onSaleGoods.forEach(item => {
      console.log(`商品: ${item.name}, 销量: ${item.sales_count}`);
    });

  } catch (err) {
    console.error('错误:', err);
  } finally {
    process.exit();
  }
}

checkSalesCount();
