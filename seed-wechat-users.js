const User = require('./models/User');

console.log('开始创建微信小程序测试用户...\n');

async function seedUsers() {
  try {
    await User.sync({ alter: true });
    console.log('✓ User表同步成功');

    // 检查现有用户
    const existingCount = await User.count();
    console.log(`✓ 当前用户数量: ${existingCount}`);

    if (existingCount > 0) {
      console.log('\n提示: 已有用户数据，跳过创建');
      console.log('如需重新创建，请先执行: TRUNCATE TABLE user;\n');
      process.exit(0);
    }

    // 插入测试用户
    const testUsers = [
      {
        user_id: 'user_wx_001',
        openid: 'oWx6T5gJxK8m5K6q3q3q3q3q3q',
        nickname: '张三',
        avatar_url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
        phone: '13800138001',
        phone_masked: '138****8001',
        status: 1,
        last_login_time: new Date()
      },
      {
        user_id: 'user_wx_002',
        openid: 'oWx6T5gJxK8m5K6q3q3q3q3q3r',
        nickname: '李四',
        avatar_url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
        phone: '13800138002',
        phone_masked: '138****8002',
        status: 1,
        last_login_time: new Date(Date.now() - 86400000)
      },
      {
        user_id: 'user_wx_003',
        openid: 'oWx6T5gJxK8m5K6q3q3q3q3q3s',
        nickname: '王五',
        avatar_url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
        phone: '13800138003',
        phone_masked: '138****8003',
        status: 1,
        last_login_time: new Date(Date.now() - 172800000)
      },
      {
        user_id: 'user_wx_004',
        openid: 'oWx6T5gJxK8m5K6q3q3q3q3q3t',
        nickname: '赵六',
        avatar_url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
        phone: '13800138004',
        phone_masked: '138****8004',
        status: 0,
        last_login_time: new Date(Date.now() - 259200000)
      },
      {
        user_id: 'user_wx_005',
        openid: 'oWx6T5gJxK8m5K6q3q3q3q3q3u',
        nickname: '小红',
        avatar_url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
        phone: '13900139000',
        phone_masked: '139****9000',
        status: 1,
        last_login_time: new Date()
      }
    ];

    console.log('\n开始插入测试用户...');
    await User.bulkCreate(testUsers);
    console.log('✅ 成功创建 5 个微信小程序测试用户');
    console.log('\n用户列表:');
    console.log('  - 张三 (正常状态)');
    console.log('  - 李四 (正常状态)');
    console.log('  - 王五 (正常状态)');
    console.log('  - 赵六 (禁用状态)');
    console.log('  - 小红 (正常状态)');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ 操作失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
  }
}

seedUsers();
