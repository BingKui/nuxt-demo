<template>
    <div>
      <NavBar fixed title="选择门店" />
      <Tabs class="page-tabs" v-model="tabActive">
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
import StoreList from "~/components/StoreList.vue";

export default {
  name: "store",
  components: {
    Tabbar,
    TabbarItem,
    NavBar,
    Tab,
    Tabs,
    StoreList
  },
  data() {
    return {
      active: 0,
      tabActive: 0,
      areaList: [],
      allList: [
        {
          addr: "杭州市余杭区文一西路998号海创园19幢506",
          tel: "400-054-0571",
          id: "958ff7783b424fa0e39b148fbd3bc287",
          n: "体验店正餐"
        },
        {
          addr: "杭州市余杭区文一西路998号海创园19幢504A",
          tel: "18099999999",
          id: "56ca4d0d5f22fa12be8d24f1521e90e0",
          n: "三千客体验店"
        },
        {
          addr: "文一西路998号",
          tel: "4001510571",
          id: "b9db8d3839d34ec80b2aa94b06bdb0c8",
          n: "盛付通后置付款测试"
        }
      ],
      beenList: [
        {
          addr: "文一西路998号",
          tel: "4001510571",
          id: "b9db8d3839d34ec80b2aa94b06bdb0c8",
          n: "盛付通后置付款测试"
        },
        {
          addr: "杭州市余杭区文一西路998号海创园19幢506",
          tel: "400-054-0571",
          id: "958ff7783b424fa0e39b148fbd3bc287",
          n: "体验店正餐"
        }
      ]
    };
  },
  // created: function () {
  //   document.title = '自助点单';
  // },
  methods: {
    goToShop(item) {
      window.location.href = `/m/weixin/menu?storeId=${
        item.id
      }&sgId=308bb0a71c98acad223c99694739fdf2&name=${item.n}`;
    }
  },
  head() {
    return {
      title: "三千客自助点单",
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
@import '~/assets/vant.css';
</style>
