const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('payment', {
  payment_id: {
    type: DataTypes.STRING(64),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  order_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
    comment: '订单ID'
  },
  payment_method: {
    type: DataTypes.ENUM('wechat', 'alipay'),
    allowNull: false,
    defaultValue: 'wechat',
    comment: '支付方式'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '支付金额'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending',
    comment: '支付状态'
  },
  transaction_id: {
    type: DataTypes.STRING(128),
    allowNull: true,
    comment: '第三方支付交易号'
  },
  payment_time: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '支付时间'
  }
}, {
  tableName: 'payments',
  timestamps: false,
  comment: '支付记录表'
});

module.exports = Payment;
