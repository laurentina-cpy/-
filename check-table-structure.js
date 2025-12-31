const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './database.sqlite';

function checkTableStructure() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('数据库连接失败:', err.message);
      process.exit(1);
    }
  });

  console.log('=== 检查所有表 ===\n');
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      console.error('查询失败:', err.message);
      db.close();
      process.exit(1);
    }

    console.log('数据库中的表:');
    tables.forEach(t => console.log(`  - ${t.name}`));

    if (tables.find(t => t.name.toLowerCase() === 'user')) {
      const tableName = tables.find(t => t.name.toLowerCase() === 'user').name;
      console.log(`\n=== ${tableName} 表结构 ===\n`);

      db.all(`PRAGMA table_info(${tableName})`, [], (err, columns) => {
        if (err) {
          console.error('获取表结构失败:', err.message);
        } else {
          columns.forEach(col => {
            console.log(`  ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
          });

          console.log(`\n=== ${tableName} 表数据 ===\n`);
          db.all(`SELECT * FROM ${tableName} LIMIT 5`, [], (err, rows) => {
            if (err) {
              console.error('查询数据失败:', err.message);
            } else {
              console.log(`记录数: ${rows.length}`);
              if (rows.length > 0) {
                console.log('示例数据:');
                const keys = Object.keys(rows[0]);
                console.log('  字段:', keys.join(', '));
                rows.forEach(row => {
                  console.log(`  ${JSON.stringify(row)}`);
                });
              }
            }
            db.close();
          });
        }
      });
    } else {
      console.log('\n未找到user表');
      db.close();
    }
  });
}

checkTableStructure();
