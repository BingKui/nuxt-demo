<template>
  <div class="page-contianer">
    <NavBar title="选择门店" />
      <Tabs v-model="tabActive">
        <Tab title="附近">
          <StoreList :data="areaList" />
        </Tab>
        <Tab title="全部">
          <StoreList :data="allList" />
        </Tab>
        <Tab title="去过的">
          <StoreList :data="beenList" />
        </Tab>
      </Tabs>
      <Tabbar v-model="active">
        <TabbarItem icon="shop">自助点餐</TabbarItem>
        <TabbarItem icon="pending-orders" url="/m/weixin/myorder">我的订单</TabbarItem>
      </Tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, NavBar, Tab, Tabs } from "vant";
export default {
  layout: "orderlist",
  components: {
    Tabbar,
    TabbarItem,
    NavBar,
    Tab,
    Tabs,
  }
};
</script>

<style scoped>
@import '~/assets/vant.css';
</style>
