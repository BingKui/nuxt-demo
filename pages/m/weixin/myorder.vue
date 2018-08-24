<template>
    <div>
      <NavBar fixed title="我的订单" />
      <Tabs class="page-tabs" v-model="tabActive">
        <Tab title="待付款">
          <OrderList :data="awaitList" @look-detail="lookDetail" @pay-action="payOrder" />
        </Tab>
        <Tab title="全部">
          <OrderList :data="allList" @look-detail="lookDetail" @pay-action="payOrder" />
        </Tab>
      </Tabs>
      <Tabbar v-model="active">
        <TabbarItem icon="shop" url="/m/weixin/store">自助点餐</TabbarItem>
        <TabbarItem icon="pending-orders">我的订单</TabbarItem>
      </Tabbar>
      <Popup v-model="isPay" position="bottom" :overlay="false">
        <div class="pay-popup">
          <div class="pay-content">
            <NavBar title="支付订单" left-text="取消" @click-left="cancalPay" />
            <CellGroup>
              <Cell title="订单总价" :value="'￥' + orderPrice" />
            </CellGroup>
            <RadioGroup v-model="payType">
              <CellGroup>
                <Cell title="微信支付" clickable @click="payType = '1'">
                  <Radio name="1" />
                </Cell>
                <Cell title="支付宝" clickable @click="payType = '2'">
                  <Radio name="2" />
                </Cell>
              </CellGroup>
            </RadioGroup>
          </div>
          <div class="pay-action">
            <div class="order-pay-tip">
              <div class="tip">未付款订单将于30分钟后关闭</div>
              <div class="tip">请尽快付款</div>
            </div>
            <Button type="warning" block>确认支付</Button>
          </div>
        </div>
      </Popup>
      <Popup v-model="isDetail" :lazy-render="false" position="bottom" :overlay="false">
        <div class="order-detail-popup">
          <NavBar title="订单详情" left-text="关闭" @click-left="closeDetail" />
          <div class="order-detail-content">
            <CellGroup>
              <Cell class="cell-1-3" title="订单编号" :value="orderDetail.order_no"></Cell>
              <canvas v-if="orderDetail.display_qr_code" id="qrcode"></canvas>
              <Cell class="van-hairline--top" title="支付方式" :value="orderDetail.platform === 3001 ? '微信支付' : '其他支付方式'" />
              <Cell class="cell-1-3" title="下单时间" :value="orderDetail.time" />
              <Cell title="桌号" :value="orderDetail.table" />
              <Cell title="就餐人数" :value="orderDetail.person_number" />
            </CellGroup>

            <CellGroup>
              <Cell title="订单状态" :value="returnOrderStatus(orderDetail.status)" />
            </CellGroup>

            <CellGroup>
              <Cell v-for="item in orderDetail.olines" :key="item.id" :title="item.name + ' x' + item.quantity" :value="'￥' + item.price">
                <CellGroup v-if="item.feeds.length > 0">
                  <Cell v-for="feedItem in item.feeds" :key="feedItem" :title="'加料：' + feedItem.name + ' x' + feedItem.quantity" />
                </CellGroup>
              </Cell>
              <Cell :title="'合计：' + orderDetail.olines.length + '份美食'" :value="'￥' + orderDetail.amount" />
              <div v-if="orderDetail.order_discount">
                <Cell :title="'优惠：' + orderDetail.order_discount.name" :value="'-￥' + orderDetail.order_discount.discount" />
              </div>
            </CellGroup>
          </div>
          <div class="order-total-amount van-hairline--top">实际支付： <span>￥{{orderDetail.trans_amount}}</span></div>
        </div>
      </Popup>
    </div>
</template>

<script>
import {
  Tabbar,
  TabbarItem,
  NavBar,
  Tab,
  Tabs,
  Popup,
  CellGroup,
  Cell,
  RadioGroup,
  Radio,
  Button
} from "vant";
import OrderList from "~/components/OrderList.vue";
const QRCode = require('qrcode');
import { dealOrderStatus } from '~/assets/common/OrderStatusEnum.js';

export default {
  components: {
    Tabbar,
    TabbarItem,
    NavBar,
    Tab,
    Tabs,
    OrderList,
    Popup,
    CellGroup,
    Cell,
    RadioGroup,
    Radio,
    Button
  },
  data() {
    return {
      active: 1,
      tabActive: 0,
      isPay: false,
      isDetail: false,
      payType: "1",
      orderPrice: 1,
      orderDetail: {
        comment: null,
        need_redirect: false,
        postPay: 0,
        order_no: "0000000044201808161442440003",
        refund_id: null,
        member_discount: { discount: 0, name: "" },
        table: 2,
        trans_amount: 4,
        ptime: "",
        olines: [
          {
            status: 1,
            feeds: [],
            name: "南瓜粥",
            package: 0,
            price: 6,
            amount: 6,
            cookmethod: "",
            boxFee: 0,
            id: 2943,
            quantity: 1
          }
        ],
        name: "测试门店三千客体验店",
        platform: 3001,
        offerType: 0,
        type: 1,
        trans_id: null,
        status: 6,
        canAdd: 1,
        display_qr_code: 1,
        discount: 2,
        person_number: 1,
        atime: "",
        unconfirmed: [],
        utime: "2018-08-16 14:42:45",
        ctime: "",
        prepay_id: null,
        payty_id: 3001,
        finish_flag: 0,
        reject_flag: 0,
        amount: 6,
        table_id: null,
        time: "2018-08-16 14:42:44",
        order_discount: { discount: 2, name: "新店开张6.8折" }
      },
      awaitList: [],
      allList: [
        {
          status: 17,
          postPay: 1,
          trans_amount: 8,
          order_no: "0000000358201808171044480001",
          memo: "南瓜粥 共1道菜品",
          ts: 1534473888,
          discount_name: null,
          discount: 0,
          name: "测试门店盛付通后置付款测试",
          finish_flag: 0,
          amount: 8,
          time: "2018-08-17 10:44:48"
        },
        {
          status: 6,
          postPay: 0,
          trans_amount: 4,
          order_no: "0000000044201808161442440003",
          memo: "南瓜粥 共1道菜品",
          ts: 1534401765,
          discount_name: "新店开张6.8折",
          discount: 2,
          name: "测试门店三千客体验店",
          finish_flag: 0,
          amount: 6,
          time: "2018-08-16 14:42:44"
        },
        {
          status: 6,
          postPay: 1,
          trans_amount: 0.01,
          order_no: "0000000358201808131139100007",
          memo: "小烤饼 共1道菜品",
          ts: 1534401739,
          discount_name: null,
          discount: 0,
          name: "测试门店盛付通后置付款测试",
          finish_flag: 0,
          amount: 0.01,
          time: "2018-08-13 11:39:10"
        },
        {
          status: 6,
          postPay: 1,
          trans_amount: 0.01,
          order_no: "0000000358201808131131080006",
          memo: "小烤饼 共1道菜品",
          ts: 1534131409,
          discount_name: null,
          discount: 0,
          name: "测试门店盛付通后置付款测试",
          finish_flag: 0,
          amount: 0.01,
          time: "2018-08-13 11:31:08"
        },
        {
          status: 19,
          postPay: 1,
          trans_amount: 0.01,
          order_no: "0000000358201808091034530002",
          memo: "小烤饼 共1道菜品",
          ts: 1533782139,
          discount_name: null,
          discount: 0,
          name: "测试门店盛付通后置付款测试",
          finish_flag: 1,
          amount: 0.01,
          time: "2018-08-09 10:34:53"
        },
        {
          status: 4,
          postPay: 0,
          trans_amount: 0.01,
          order_no: "0000000044201808081455330007",
          memo: "小烤饼 共1道菜品",
          ts: 1533712201,
          discount_name: null,
          discount: 0,
          name: "测试门店三千客体验店",
          finish_flag: 0,
          amount: 0.01,
          time: "2018-08-08 14:55:33"
        },
        {
          status: 12,
          postPay: 0,
          trans_amount: 0.01,
          order_no: "0000000044201808081504010008",
          memo: "小烤饼 共1道菜品",
          ts: 1533711873,
          discount_name: null,
          discount: 0,
          name: "测试门店三千客体验店",
          finish_flag: 0,
          amount: 0.01,
          time: "2018-08-08 15:04:01"
        },
        {
          status: 7,
          postPay: 0,
          trans_amount: 1,
          order_no: "0000000044201808081438350006",
          memo: "烧茄子 共1道菜品",
          ts: 1533710322,
          discount_name: null,
          discount: 0,
          name: "测试门店三千客体验店",
          finish_flag: 0,
          amount: 1,
          time: "2018-08-08 14:38:35"
        },
        {
          status: 6,
          postPay: 0,
          trans_amount: 1,
          order_no: "0000000044201808081436390005",
          memo: "烧茄子 共1道菜品",
          ts: 1533710200,
          discount_name: null,
          discount: 0,
          name: "测试门店三千客体验店",
          finish_flag: 0,
          amount: 1,
          time: "2018-08-08 14:36:39"
        },
        {
          status: 6,
          postPay: 0,
          trans_amount: 1,
          order_no: "0000000044201808081434550004",
          memo: "烧茄子 共1道菜品",
          ts: 1533710095,
          discount_name: null,
          discount: 0,
          name: "测试门店三千客体验店",
          finish_flag: 0,
          amount: 1,
          time: "2018-08-08 14:34:54"
        }
      ]
    };
  },
  methods: {
    lookDetail(orderNumber) {
      this.isDetail = true;
      // 生成二维码
      const canvas = document.getElementById('qrcode');
      QRCode.toCanvas(canvas, orderNumber, { errorCorrectionLevel: 'H', margin: 1, width: 128 }, function(err) {
        if (err) console.log(err);
        console.log('qrcode success');
      });
      console.log(orderNumber);
    },
    closeDetail() {
      this.isDetail = false;
    },
    payOrder(orderNumber) {
      this.isPay = true;
      console.log(orderNumber);
    },
    cancalPay() {
      this.isPay = false;
    },
    returnOrderStatus(status) {
      return dealOrderStatus(status);
    },
  },
  head() {
    return {
      title: "我的订单",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description"
        }
      ]
    };
  }
};
</script>

<style>
@import "~/assets/vant.css";
.van-cell-group {
  margin-top: 15px;
}
.pay-popup,
.order-detail-popup {
  height: 100vh;
  width: 100%;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.pay-action {
  padding: 15px;
}
.order-pay-tip {
  display: block;
  text-align: center;
  border: 1px solid #f85;
  margin: 20px;
  border-radius: 4px;
  background-color: #fff;
  padding: 5px 0;
}
.order-pay-tip .tip {
  font-size: 14px;
  line-height: 21px;
  color: #f85;
}
.order-detail-popup .order-detail-content {
  padding-bottom: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 0;
}
.order-detail-popup .order-detail-content .cell-1-3 .van-cell__title {
  flex: 1;
}
.order-detail-popup .order-detail-content .cell-1-3 .van-cell__value {
  flex: 3;
}

.order-detail-popup .order-total-amount {
  position: relative;
  z-index: 1;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  text-align: right;
  background-color: #fff;
  line-height: 50px;
  padding-right: 15px;
  color: #f85;
}
.order-detail-popup .order-total-amount span {
  font-size: 25px;
}
#qrcode {
  margin-left: calc(50% - 64px);
}
</style>
