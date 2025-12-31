const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');

console.log('数据库路径:', DB_PATH);
console.log('开始创建测试用户...\n');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ 数据库连接失败:', err.message);
    process.exit(1);
  }
  console.log('✓ 数据库连接成功');
});

async function main() {
  try {
    // 1. 创建user表
    await new Promise((resolve, reject) => {
      db.run(`CREATE TABLE IF NOT EXISTS user (
        user_id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        status INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) reject(err);
        else {
          console.log('✓ user表检查完成');
          resolve();
        }
      });
    });

    // 2. 检查现有用户
    const existingCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user', [], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    console.log(`✓ 当前用户数量: ${existingCount}`);

    if (existingCount > 0) {
      console.log('\n提示: 已有用户数据，跳过创建');
      console.log('如需重新创建，请先手动清空User表\n');
      return;
    }

    // 3. 插入测试用户
    const testUsers = [
      { user_id: 'user_001', username: 'user1', password: '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q', phone: '13800138001', email: 'user1@test.com', status: 1 },
      { user_id: 'user_002', username: 'user2', password: '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q', phone: '13800138002', email: 'user2@test.com', status: 1 },
      { user_id: 'user_003', username: 'user3', password: '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q', phone: '13800138003', email: 'user3@test.com', status: 1 },
      { user_id: 'user_004', username: 'testuser', password: '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q', phone: '13900139000', email: 'test@example.com', status: 0 }
    ];

    console.log('\n开始插入测试用户...');
    for (const user of testUsers) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO User (user_id, username, password, phone, email, status) VALUES (?, ?, ?, ?, ?, ?)`,
          [user.user_id, user.username, user.password, user.phone, user.email, user.status],
          (err) => {
            if (err) reject(err);
            else {
              console.log(`✓ 创建用户: ${user.username} (${user.user_id})`);
              resolve();
            }
          }
        );
      });
    }

    // 4. 验证结果
    const finalCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user', [], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    console.log(`\n✅ 成功创建 ${finalCount} 个测试用户`);
    console.log('\n测试账号信息:');
    console.log('  用户名: user1 / user2 / user3 / testuser');
    console.log('  密码: test123');
    console.log('  状态: testuser 为禁用状态，其他为正常状态\n');

  } catch (error) {
    console.error('\n❌ 操作失败:', error.message);
  } finally {
    db.close(() => {
      console.log('数据库连接已关闭');
      process.exit(0);
    });
  }
}

main();
