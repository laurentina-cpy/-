const sequelize = require('./config/db');
const Admin = require('./models/Admin');

async function checkAdmin() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功\n');

    const admin = await Admin.findOne({ where: { username: 'admin' } });
    if (admin) {
      console.log('✓ 管理员账户存在:');
      console.log('  用户名:', admin.username);
      console.log('  真实姓名:', admin.real_name);
      console.log('  角色:', admin.role);
      console.log('  权限:', admin.permissions);
    } else {
      console.log('✗ 管理员账户不存在');
      console.log('\n请运行以下命令创建管理员账户:');
      console.log('  node scripts/init-admin.js');
    }
  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

checkAdmin();
