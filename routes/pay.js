const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');

/**
 * 创建支付订单
 * POST /api/pay/create
 */
router.post('/create', async (req, res) => {
  const { orderId, payMethod, totalAmount, clientType } = req.body;

  try {
    // 验证参数
    if (!orderId || !payMethod || !totalAmount) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要参数'
      });
    }

    // 查询订单
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在'
      });
    }

    // 检查订单状态
    if (order.status !== 0) {
      return res.status(400).json({
        code: 400,
        message: '订单状态不正确，无法支付'
      });
    }

    // 检查金额是否一致
    if (parseFloat(order.total_amount) !== parseFloat(totalAmount)) {
      return res.status(400).json({
        code: 400,
        message: '支付金额与订单金额不一致'
      });
    }

    // 创建支付记录
    const payment = await Payment.create({
      order_id: orderId,
      payment_method: payMethod,
      amount: totalAmount,
      payment_status: 'pending',
      transaction_id: null
    });

    // 返回模拟支付参数（实际项目中需要对接微信支付/支付宝API）
    const mockPayParams = {
      payment_id: payment.payment_id,
      // 微信支付参数
      timeStamp: Math.floor(Date.now() / 1000).toString(),
      nonceStr: Math.random().toString(36).substr(2, 32),
      package: `prepay_id=wx${payment.payment_id}`,
      signType: 'MD5',
      paySign: 'MOCK_SIGN_FOR_TEST',
      // 支付宝订单字符串
      orderInfo: `MOCK_ALIPAY_ORDER_${payment.payment_id}`
    };

    res.json({
      code: 200,
      message: '支付订单创建成功',
      data: mockPayParams
    });

  } catch (error) {
    console.error('创建支付订单失败:', error);
    res.status(500).json({
      code: 500,
      message: '创建支付订单失败',
      error: error.message
    });
  }
});

/**
 * 支付成功回调
 * POST /api/pay/callback
 */
router.post('/callback', async (req, res) => {
  const { payment_id, transaction_id, payStatus } = req.body;

  try {
    // 更新支付记录
    const payment = await Payment.findByPk(payment_id);
    if (!payment) {
      return res.status(404).json({
        code: 404,
        message: '支付记录不存在'
      });
    }

    // 更新支付状态
    await payment.update({
      payment_status: payStatus || 'success',
      transaction_id: transaction_id,
      payment_time: new Date()
    });

    // 更新订单状态
    await Order.update(
      { status: 1, payment_id: payment_id },
      { where: { order_id: payment.order_id } }
    );

    res.json({
      code: 200,
      message: '支付回调处理成功'
    });

  } catch (error) {
    console.error('支付回调处理失败:', error);
    res.status(500).json({
      code: 500,
      message: '支付回调处理失败',
      error: error.message
    });
  }
});

/**
 * 查询支付状态
 * GET /api/pay/status/:orderId
 */
router.get('/status/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const payment = await Payment.findOne({
      where: { order_id: orderId }
    });

    if (!payment) {
      return res.status(404).json({
        code: 404,
        message: '支付记录不存在'
      });
    }

    res.json({
      code: 200,
      message: '查询成功',
      data: {
        payment_id: payment.payment_id,
        payment_status: payment.payment_status,
        payment_time: payment.payment_time
      }
    });

  } catch (error) {
    console.error('查询支付状态失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询支付状态失败',
      error: error.message
    });
  }
});

module.exports = router;
