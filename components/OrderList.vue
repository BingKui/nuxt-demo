<template>
  <div class="order-list" v-if="data.length > 0">
    <Panel class="order-item" v-for="item in data" :key="item.order_no" :title="item.name" :desc="item.time" :status="orserStatus(item.status)">
      <div class="order-item-content">
        {{item.memo}}
        <div class="item-price">￥{{item.trans_amount}}</div>
      </div>
      <div class="order-item-footer" slot="footer">
        <span class="detail-tip" @click="() => $emit('look-detail', item.order_no)">查看详情</span>
        <Button v-if="isPay(item.status)" class="pay-btn" size="small" type="warning" @click="() => $emit('pay-action', item.order_no)">付款</Button>
      </div>
    </Panel>
  </div>
  <Empty v-else msg="暂无订单" />
</template>

<script>
import { Panel, Button } from "vant";
import { dealOrderStatus, isNeedPay } from "~/assets/common/OrderStatusEnum.js";
import { RedirectTo } from '~/assets/common/utils.js';
import Empty from '~/components/feature/Empty.vue';
export default {
  name: "order-list",
  components: {
    Panel,
    Button,
    Empty
  },
  props: {
    data: Array,
  },
  methods: {
    // lookDetial(orderNum) {
    //   RedirectTo('/m/weixin/pay', {
    //     orderNum,
    //   });
    // },
    orserStatus: function (orderStatus) {
      return dealOrderStatus(orderStatus);
    },
    isPay: function (status) {
      return isNeedPay(status);
    },
  }
};
</script>

<style scoped>
@import "~/assets/vant.css";
.order-list {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.order-list .order-item-content {
  font-size: 14px;
  color: #333;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
}
.order-item-content .item-price {
  color: #f85;
  font-size: 18px;
}
.order-list .order-item {
  margin-top: 20px;
}
.order-list .order-item:last-child {
  margin-bottom: 20px;
}
.order-item-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}
.detail-tip {
  color: #999;
  font-size: 12px;
  flex: 3;
}

</style>
