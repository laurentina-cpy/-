const sequelize = require('./config/db');
const Goods = require('./models/Goods');

async function checkGoodsData() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功\n');

    // 查询所有商品
    const allGoods = await Goods.findAll({
      attributes: ['goods_id', 'name', 'sales_count', 'shelf_status']
    });
    console.log(`找到 ${allGoods.length} 个商品:`);
    allGoods.forEach(goods => {
      console.log(`  - ${goods.name}: 销量 ${goods.sales_count}, 状态 ${goods.shelf_status}`);
    });
    console.log('');

    // 查询上架的商品
    const onSaleGoods = await Goods.findAll({
      where: { shelf_status: 1 },
      attributes: ['goods_id', 'name', 'sales_count']
    });
    console.log(`上架的商品: ${onSaleGoods.length} 个`);
    onSaleGoods.forEach(goods => {
      console.log(`  - ${goods.name}: 销量 ${goods.sales_count}`);
    });
    console.log('');

    // 按销量排序
    const sortedBySales = await Goods.findAll({
      where: { shelf_status: 1 },
      order: [['sales_count', 'DESC']],
      limit: 10,
      attributes: ['goods_id', 'name', 'sales_count']
    });
    console.log('按销量排序的前10个商品:');
    sortedBySales.forEach((goods, index) => {
      console.log(`  ${index + 1}. ${goods.name}: ${goods.sales_count}件`);
    });

  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await sequelize.close();
  }
}

checkGoodsData();
