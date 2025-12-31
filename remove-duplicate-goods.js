const sequelize = require('./config/db');
const Goods = require('./models/Goods');

async function removeDuplicateGoods() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功\n');

    // 查找所有商品
    const allGoods = await Goods.findAll({
      attributes: ['goods_id', 'name', 'price', 'category_id', 'supplier_id', 'stock', 'sales_count', 'shelf_status']
    });

    console.log(`找到 ${allGoods.length} 个商品\n`);

    // 按名称分组
    const goodsByName = {};
    allGoods.forEach(goods => {
      if (!goodsByName[goods.name]) {
        goodsByName[goods.name] = [];
      }
      goodsByName[goods.name].push(goods);
    });

    // 找出重复的商品
    const duplicates = [];
    for (const name in goodsByName) {
      const items = goodsByName[name];
      if (items.length > 1) {
        console.log(`发现重复商品: ${name} (${items.length}个)`);
        items.forEach((item, index) => {
          console.log(`  ${index + 1}. ID: ${item.goods_id}, 销量: ${item.sales_count}, 库存: ${item.stock}, 创建时间: ${item.create_time}`);
        });

        // 保留销量最高的,如果有多个相同销量的保留最新的
        const sorted = items.sort((a, b) => {
          if (b.sales_count !== a.sales_count) {
            return b.sales_count - a.sales_count;
          }
          return new Date(b.create_time) - new Date(a.create_time);
        });

        const toKeep = sorted[0];
        const toRemove = sorted.slice(1);

        console.log(`  保留: ID ${toKeep.goods_id} (销量: ${toKeep.sales_count})`);
        console.log(`  删除: ${toRemove.map(g => g.goods_id).join(', ')}`);

        duplicates.push(...toRemove);
      }
    }

    console.log(`\n共需要删除 ${duplicates.length} 个重复商品`);

    // 删除重复商品
    if (duplicates.length > 0) {
      const idsToDelete = duplicates.map(g => g.goods_id);
      await Goods.destroy({
        where: {
          goods_id: idsToDelete
        }
      });
      console.log('删除成功!\n');
    }

    // 显示剩余商品
    const remainingGoods = await Goods.findAll({
      attributes: ['goods_id', 'name', 'sales_count', 'stock'],
      order: [['sales_count', 'DESC']]
    });

    console.log('剩余商品列表:');
    remainingGoods.forEach((goods, index) => {
      console.log(`  ${index + 1}. ${goods.name} - 销量: ${goods.sales_count}, 库存: ${goods.stock}`);
    });

    console.log(`\n剩余商品总数: ${remainingGoods.length}`);

  } catch (error) {
    console.error('处理失败:', error);
  } finally {
    await sequelize.close();
  }
}

removeDuplicateGoods();
