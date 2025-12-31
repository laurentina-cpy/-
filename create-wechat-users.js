const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './database.sqlite';

console.log('开始创建微信小程序测试用户...\n');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ 数据库连接失败:', err.message);
    process.exit(1);
  }
  console.log('✓ 数据库连接成功');
});

async function main() {
  try {
    // 检查user表是否存在
    const table = await new Promise((resolve, reject) => {
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='user'", (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!table) {
      console.log('user表不存在，正在创建...');
      await new Promise((resolve, reject) => {
        db.run(`CREATE TABLE user (
          user_id TEXT PRIMARY KEY,
          openid TEXT NOT NULL UNIQUE,
          nickname TEXT NOT NULL,
          avatar_url TEXT,
          phone TEXT,
          phone_masked TEXT,
          last_login_time DATETIME,
          status INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log('✓ user表创建成功');
    }

    // 检查现有用户
    const existingCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user', [], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    console.log(`✓ 当前用户数量: ${existingCount}`);

    if (existingCount > 0) {
      console.log('\n提示: 已有用户数据，跳过创建');
      console.log('如需重新创建，请先执行: DELETE FROM user;\n');
      return;
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
        last_login_time: new Date().toISOString()
      },
      {
        user_id: 'user_wx_002',
        openid: 'oWx6T5gJxK8m5K6q3q3q3q3q3r',
        nickname: '李四',
        avatar_url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
        phone: '13800138002',
        phone_masked: '138****8002',
        status: 1,
        last_login_time: new Date(Date.now() - 86400000).toISOString()
      },
      {
        user_id: 'user_wx_003',
        openid: 'oWx6T5gJxK8m5K6q3q3q3q3q3s',
        nickname: '王五',
        avatar_url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
        phone: '13800138003',
        phone_masked: '138****8003',
        status: 1,
        last_login_time: new Date(Date.now() - 172800000).toISOString()
      },
      {
        user_id: 'user_wx_004',
        openid: 'oWx6T5gJxK8m5K6q3q3q3q3q3t',
        nickname: '赵六',
        avatar_url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
        phone: '13800138004',
        phone_masked: '138****8004',
        status: 0, // 禁用状态
        last_login_time: new Date(Date.now() - 259200000).toISOString()
      },
      {
        user_id: 'user_wx_005',
        openid: 'oWx6T5gJxK8m5K6q3q3q3q3q3u',
        nickname: '小红',
        avatar_url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
        phone: '13900139000',
        phone_masked: '139****9000',
        status: 1,
        last_login_time: new Date().toISOString()
      }
    ];

    console.log('\n开始插入测试用户...');
    for (const user of testUsers) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO user (user_id, openid, nickname, avatar_url, phone, phone_masked, status, last_login_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [user.user_id, user.openid, user.nickname, user.avatar_url, user.phone, user.phone_masked, user.status, user.last_login_time],
          (err) => {
            if (err) reject(err);
            else {
              console.log(`✓ 创建用户: ${user.nickname} (${user.user_id})`);
              resolve();
            }
          }
        );
      });
    }

    // 验证结果
    const finalCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user', [], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    console.log(`\n✅ 成功创建 ${finalCount} 个微信小程序测试用户`);
    console.log('\n用户列表:');
    console.log('  - 张三 (正常状态)');
    console.log('  - 李四 (正常状态)');
    console.log('  - 王五 (正常状态)');
    console.log('  - 赵六 (禁用状态)');
    console.log('  - 小红 (正常状态)');

  } catch (error) {
    console.error('\n❌ 操作失败:', error.message);
  } finally {
    db.close(() => {
      console.log('\n数据库连接已关闭');
      process.exit(0);
    });
  }
}

main();
