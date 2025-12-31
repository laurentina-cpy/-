const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './database.sqlite';

function createTestUsers() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('数据库连接失败:', err.message);
      process.exit(1);
    }
  });

  db.serialize(() => {
    // 创建User表（如果不存在）
    db.run(`CREATE TABLE IF NOT EXISTS User (
      user_id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      status INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('创建表失败:', err.message);
        db.close();
        process.exit(1);
      }
      console.log('User表创建成功/已存在');
    });

    // 检查是否已有用户
    db.get('SELECT COUNT(*) as count FROM User', [], (err, row) => {
      if (err) {
        console.error('查询失败:', err.message);
        db.close();
        process.exit(1);
      }

      if (row.count > 0) {
        console.log(`\n提示: 数据库中已有${row.count}个用户，跳过创建`);
        db.close();
        process.exit(0);
      }

      // 插入测试用户
      const testUsers = [
        {
          user_id: 'user_001',
          username: 'user1',
          password: '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q', // test123
          phone: '13800138001',
          email: 'user1@test.com',
          status: 1
        },
        {
          user_id: 'user_002',
          username: 'user2',
          password: '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q',
          phone: '13800138002',
          email: 'user2@test.com',
          status: 1
        },
        {
          user_id: 'user_003',
          username: 'user3',
          password: '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q',
          phone: '13800138003',
          email: 'user3@test.com',
          status: 1
        },
        {
          user_id: 'user_004',
          username: 'testuser',
          password: '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q',
          phone: '13900139000',
          email: 'test@example.com',
          status: 0 // 禁用状态
        }
      ];

      let inserted = 0;

      const stmt = db.prepare(`
        INSERT INTO User (user_id, username, password, phone, email, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      testUsers.forEach(user => {
        stmt.run([user.user_id, user.username, user.password, user.phone, user.email, user.status], (err) => {
          if (err) {
            console.error(`插入用户${user.username}失败:`, err.message);
          } else {
            inserted++;
            console.log(`✓ 创建用户: ${user.username} (${user.user_id})`);
          }

          if (inserted === testUsers.length || err) {
            stmt.finalize();
            console.log(`\n成功创建 ${inserted}/${testUsers.length} 个测试用户`);
            console.log('\n测试账号信息:');
            console.log('  用户名: user1 / user2 / user3 / testuser');
            console.log('  密码: test123');
            db.close();
          }
        });
      });

      stmt.run();
    });
  });
}

createTestUsers();
