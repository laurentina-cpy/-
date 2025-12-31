-- 修复订单状态，让不同订单显示不同状态

-- 将第1-2条订单改为已支付
UPDATE `order` SET status = 1, pay_time = NOW() WHERE order_id IN (SELECT order_id FROM (SELECT order_id FROM `order` ORDER BY create_time DESC LIMIT 2 OFFSET 0) AS tmp);

-- 将第3-4条订单改为配送中
UPDATE `order` SET status = 2, pay_time = NOW() WHERE order_id IN (SELECT order_id FROM (SELECT order_id FROM `order` ORDER BY create_time DESC LIMIT 2 OFFSET 2) AS tmp);

-- 将第5条订单改为已送达
UPDATE `order` SET status = 3, pay_time = NOW() WHERE order_id IN (SELECT order_id FROM (SELECT order_id FROM `order` ORDER BY create_time DESC LIMIT 1 OFFSET 4) AS tmp);

-- 将第6-7条订单改为已完成
UPDATE `order` SET status = 4, pay_time = NOW(), finish_time = NOW() WHERE order_id IN (SELECT order_id FROM (SELECT order_id FROM `order` ORDER BY create_time DESC LIMIT 2 OFFSET 5) AS tmp);

-- 将第8条订单改为已取消
UPDATE `order` SET status = 5 WHERE order_id IN (SELECT order_id FROM (SELECT order_id FROM `order` ORDER BY create_time DESC LIMIT 1 OFFSET 7) AS tmp);

-- 查看更新后的结果
SELECT
  status,
  CASE status
    WHEN 0 THEN '待支付'
    WHEN 1 THEN '已支付'
    WHEN 2 THEN '配送中'
    WHEN 3 THEN '已送达'
    WHEN 4 THEN '已完成'
    WHEN 5 THEN '已取消'
    WHEN 6 THEN '已退款'
    ELSE '未知'
  END as status_name,
  COUNT(*) as count
FROM `order`
GROUP BY status
ORDER BY status;
