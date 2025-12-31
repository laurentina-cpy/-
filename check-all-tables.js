const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './database.sqlite';

function checkAllTables() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('数据库连接失败:', err.message);
      process.exit(1);
    }
  });

  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      console.error('查询失败:', err.message);
      db.close();
      process.exit(1);
    }

    console.log(`=== 数据库中共有 ${tables.length} 个表 ===\n`);

    let completed = 0;

    tables.forEach(table => {
      db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
        if (err) {
          console.error(`获取 ${table.name} 表结构失败:`, err.message);
        } else {
          console.log(`【${table.name}】`);
          columns.forEach(col => {
            console.log(`  ${col.name} (${col.type})`);
          });

          db.get(`SELECT COUNT(*) as count FROM ${table.name}`, [], (err, row) => {
            if (!err) {
              console.log(`  数据量: ${row.count} 条\n`);
            }
            completed++;
            if (completed === tables.length) {
              db.close();
            }
          });
        }
      });
    });
  });
}

checkAllTables();
