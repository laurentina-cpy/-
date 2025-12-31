const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './database.sqlite';

function checkUsersTable() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('数据库连接失败:', err.message);
      process.exit(1);
    }
  });

  db.serialize(() => {
    // 检查表是否存在
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='User'", (err, row) => {
      if (err) {
        console.error('查询失败:', err.message);
        db.close();
        process.exit(1);
      }

      console.log('User表是否存在:', row ? '是' : '否');

      if (row) {
        // 查看表结构
        db.all('PRAGMA table_info(User)', [], (err, columns) => {
          if (err) {
            console.error('获取表结构失败:', err.message);
          } else {
            console.log('\nUser表结构:');
            columns.forEach(col => {
              console.log(`  ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
            });

            // 查看所有用户
            db.all('SELECT * FROM User', [], (err, users) => {
              if (err) {
                console.error('查询用户失败:', err.message);
              } else {
                console.log(`\n用户总数: ${users.length}`);

                if (users.length > 0) {
                  console.log('\n用户列表:');
                  users.forEach(user => {
                    console.log(`  user_id: ${user.user_id}, username: ${user.username}, phone: ${user.phone}, status: ${user.status}`);
                  });
                } else {
                  console.log('\n提示: User表为空，需要先创建用户');
                  console.log('请运行以下命令创建测试用户:');
                  console.log('  node create-test-users.js');
                }
              }
              db.close();
            });
          }
        });
      } else {
        console.log('\n提示: User表不存在，请运行数据库初始化脚本');
        db.close();
      }
    });
  });
}

checkUsersTable();
