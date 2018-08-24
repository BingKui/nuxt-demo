const STATUS = {
  INIT: 0, // 初始

  // 付款相关状态, 无关模式
  PREPARE_PAY: 9, // 已选择支付方式，未付款
  USERPAYING: 2, // 付款中
  SUCCESS: 3, // 付款完成
  REFUND: 4, // 已自助退款
  REVOKED: 5, // 已自助撤销
  CLOSED: 6, // 订单已关闭
  PAYERROR: 7, // 付款失败

  // 拒单, 其他退款相关状态, 无关模式
  RECEPTION_REFUND: 13, // 前台退款预置状态
  PARTLY_REFUND: 15, // 部分退款

  // 合作下单专用
  ORDERING: 16, // 下单中(用于合作模式)

  // 前置付款
  PRE_ORDERED: 1, // 前置付款-已自助下单(未付款)
  PRE_PAYED: 12, // 前置付款-待商家确认(已付款)
  PRE_ACCEPTED: 8, // 前置付款-商家已接单, 开始制作(已付款)
  PRE_REJECTED: 14, // 前置付款-商家已拒绝

  // 后置付款专属
  POST_ORDERED: 17, // 后置付款-待接单(未付款)
  POST_ACCEPTED: 18, // 后置付款-已接单(未付款)
  POST_PAYED: 19, // 后置付款-用户已支付(已付款)
  POST_REJECTED: 20, // 后置付款-商家已拒绝

  // deprecated
  PRE_REFUND: 10, // 退款中, (支付宝点单需要) -- 已作废
  REFUND_FAIL: 11, // 退款失败, (曾用于支付宝批量付款申请回调通知, 目前退款均已同步处理, 此状态弃用)
};

const orderStatus = [
  { key: 0, value: '订单初始化' },
  { key: 1, value: '自助下单' },
  { key: 2, value: '付款中' },
  { key: 3, value: '付款完成' },
  { key: 4, value: '已退款' },
  { key: 5, value: '已撤销' },
  { key: 6, value: '已关闭' },
  { key: 7, value: '付款失败' },
  { key: 8, value: '商家已接单' },
  { key: 9, value: '未付款' },
  { key: 10, value: '退款中' },
  { key: 11, value: '退款失败' },
  { key: 12, value: '待商家确定' },
  { key: 13, value: '前台退款' },
  { key: 14, value: '商家已拒绝' },
  { key: 15, value: '部分退款' },
  { key: 16, value: '下单中' },
  { key: 17, value: '待接单' },
  { key: 18, value: '已接单' },
  { key: 19, value: '已完成' },
  { key: 20, value: '商家已拒绝' },
]

// 处理返回状态信息
export const dealOrderStatus = (status) => {
  let result = '未知状态';
  for (let i = 0; i < orderStatus.length; i++) {
    const item = orderStatus[i];
    if (item.key === status) {
      result = item.value;
      break;
    }
  }
  return result;
}

// 处理返回是否需要支付
export const isNeedPay = (status) => {
  const needArray = [7, 1, 18];
  return needArray.indexOf(status) > -1;
}
