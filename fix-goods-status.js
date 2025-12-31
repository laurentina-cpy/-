const sequelize = require('./config/db');
const Goods = require('./models/Goods');

async function fixGoodsStatus() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功\n');

    // 更新所有商品为上架状态
    const result = await Goods.update(
      { shelf_status: 1 },
      { where: {} }
    );

    console.log(`已更新 ${result[0]} 个商品为上架状态`);

    // 验证更新结果
    const onSaleGoods = await Goods.findAll({
      where: { shelf_status: 1 }
    });
    console.log(`当前上架商品数量: ${onSaleGoods.length}`);

    onSaleGoods.forEach(goods => {
      console.log(`  - ${goods.name}: 销量 ${goods.sales_count}`);
    });

  } catch (error) {
    console.error('更新失败:', error);
  } finally {
    await sequelize.close();
  }
}

fixGoodsStatus();
