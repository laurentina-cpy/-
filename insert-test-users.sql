-- 直接插入测试用户到数据库
-- 请在数据库管理工具中执行此SQL脚本

-- 创建user表（如果不存在）
CREATE TABLE IF NOT EXISTS user (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 删除已存在的测试用户（可选）
DELETE FROM user WHERE user_id LIKE 'user_%';

-- 插入测试用户
INSERT INTO user (user_id, username, password, phone, email, status) VALUES
  ('user_001', 'user1', '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q', '13800138001', 'user1@test.com', 1),
  ('user_002', 'user2', '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q', '13800138002', 'user2@test.com', 1),
  ('user_003', 'user3', '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q', '13800138003', 'user3@test.com', 1),
  ('user_004', 'testuser', '$2b$10$K8m5K6q3q3q3q3q3q3q3q3q', '13900139000', 'test@example.com', 0);

-- 查询验证
SELECT user_id, username, phone, email, status FROM user;
