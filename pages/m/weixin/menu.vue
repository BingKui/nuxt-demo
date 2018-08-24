<template>
  <div class="menu-list">
    <NavBar fixed :title="storeName" left-text="返回" @click-left="callback" right-text="我的订单" @click-right="goToMyOrder" />
    <div class="menu-content">
      <NoticeBar mode="link" class="menu-tip" text="店铺优惠：满50减5元" @click="showDiscountDetail()" />
      <div class="menu-select-content">
        <div class="menu-control-bar">
          <BadgeGroup :active-key="categoryIndex">
            <div class="van-hairline--bottom" v-for="(item, index) in menuData.category" :key="item.id">
              <Badge v-if="item.selectCount" :title="item.n" :info="item.selectCount" @click="changeCategory(index)" />
              <Badge v-else :title="item.n" @click="changeCategory(index)" />
            </div>
          </BadgeGroup>
        </div>
        <div class="menu-control-list-tip">{{activeName}}</div>
        <div class="menu-control-list">
          <div class="menu-list-item van-hairline--bottom" v-for="item in menuData.menu" :key="item.id">
            <img class="menu-item-img" :src="item.picAddr || defaultImg" :alt="item.n" @click="showMenuItemDetail(item)">
            <div class="menu-item-contnt">
              <div class="name">{{item.n}}</div>
              <div class="price-control">
                <span class="price">￥{{item.price}}</span>
                <div class="control">
                  <Button type="warning" size="mini" text="选规格" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SubmitBar class="van-hairline--top" :price="totlePrice" :disabled="!cartData.length > 0" button-text="去结算" @submit="showSettle">
      <GoodsActionMiniBtn icon="cart" :info="cartData.length" @click="showCart"></GoodsActionMiniBtn>
    </SubmitBar>
    <Popup v-model="menuTipDetail" position="bottom">
      <div class="popup-detail">
        <div class="popup-header">
          <div class="name">优惠活动</div>
          <div class="name-desc">下单时按最优惠活动择一参与</div>
          <Icon class="popup-close" name="close" size="30px" color="#6c6c6c" @click="closeDiscountDetail" />
        </div>
        <div class="detail-content">
          <div class="discount-detail-line">
            <span class="label-name">活动名称：</span>{{discountInfo.name}}
          </div>
          <div class="discount-detail-line">
            <span class="label-name">活动力度：</span>{{discountInfo.vigor}}
          </div>
          <div class="discount-detail-line">
            <span class="label-name">参与菜品：</span>{{discountInfo.containMenu.join('，')}}
          </div>
        </div>
      </div>
    </Popup>
    <Popup v-model="menuItemDetail" position="bottom">
      <div class="popup-detail">
        <div class="popup-header">
          <div class="name">{{menuItemInfo.n}}</div>
          <Icon class="popup-close" name="close" size="30px" color="#6c6c6c" @click="closeMenuItemDetail" />
        </div>
        <div class="detail-content">
          <img class="detail-item-img" :src="menuItemInfo.picAddr || defaultImg" :alt="menuItemInfo.n" />
          <div class="menu-item-detail-name">{{menuItemInfo.n}}</div>
          <div class="menu-item-detail-price">￥{{menuItemInfo.price}} / 份</div>
        </div>
      </div>
    </Popup>
    <Popup v-model="showCartDetail" position="bottom">
      <div class="popup-detail">
        <div class="cart-detail-name van-hairline--bottom">已选商品</div>
        <div class="cart-detail-content cart-menu-list">
          <div class="menu-item van-hairline--bottom" v-for="item in cartData" :key="item.id">
            <div class="item-detail">
              <div class="item-name">{{item.name}}</div>
              <div class="item-feed" v-if="item.feed">
                <Tag type="success" mark v-for="feedItem in item.feed" :key="feedItem.id">{{feedItem.name}} x{{feedItem.count}}</Tag>
              </div>
            </div>
            <div class="item-price">￥{{item.price}}</div>
            <div class="item-control">控制区域</div>
          </div>
        </div>
        <SubmitBar class="van-hairline--top" :price="totlePrice" :disabled="!cartData.length > 0" button-text="去结算" @submit="showSettle">
          <GoodsActionMiniBtn icon="cart" :info="cartData.length" @click="closeCart"></GoodsActionMiniBtn>
        </SubmitBar>
      </div>
    </Popup>
    <Popup class="settle-popup-detail" v-model="settlePopup" position="bottom" :overlay="false">
      <div>
        <NavBar fixed title="订单结算" left-text="取消" @click-left="closeSettle" />
        <div class="settle-content">
          <GroupCell>
            <Cell>
              <PopupSelect label="餐具" :data="tableware" placeholder="选择餐具数" />
            </Cell>
            <Cell>
              <PopupSelect label="桌号" :data="areaData" placeholder="选择桌号" />
            </Cell>
          </GroupCell>
          <div class="settle-menu-list">
            所点菜品占位
          </div>
        </div>
        <SubmitBar class="van-hairline--top" :price="totlePrice" button-text="确认订单" @submit="onSubmit" />
      </div>
    </Popup>
  </div>
</template>

<script>
import { menuData, cartData, zhuohao, canju } from "~/assets/temp/menudata.js";
import defaultImg from "~/assets/images/default_product.png";
import {
  NavBar,
  NoticeBar,
  SubmitBar,
  Icon,
  Badge,
  BadgeGroup,
  GoodsActionMiniBtn,
  Button,
  Popup,
  Cell,
  CellGroup,
  Tag
} from "vant";
import {
  NavigateBack,
  RedirectTo,
  GetUrlParam
} from "~/assets/common/utils.js";
import PopupSelect from "~/components/base/PopupSelect";
export default {
  name: "menu-list",
  components: {
    NavBar,
    NoticeBar,
    SubmitBar,
    Icon,
    Badge,
    BadgeGroup,
    GoodsActionMiniBtn,
    Button,
    Popup,
    Cell,
    CellGroup,
    Tag,
    PopupSelect
  },
  data() {
    return {
      menuData: menuData,
      menuTipDetail: false,
      menuItemDetail: false,
      showCartDetail: false,
      settlePopup: false,
      categoryIndex: 0,
      discountInfo: {
        name: "满50减5元",
        vigor: "满50减5元",
        containMenu: ["红烧牛肉面", "重庆小面", "鸡蛋面"]
      },
      menuItemInfo: {},
      storeName: "测试门店",
      activeName: "配菜",
      totlePrice: 3050,
      tableware: canju || [], // 餐具
      areaData: zhuohao || [], // 桌号
      defaultImg,
      cartData: cartData || [], // 购物车数据
    };
  },
  methods: {
    callback() {
      NavigateBack();
    },
    goToMyOrder() {
      RedirectTo("/m/weixin/myorder", {
        storeId: GetUrlParam("storeId"),
        sgId: GetUrlParam("sgId")
      });
    },
    showDiscountDetail() {
      this.menuTipDetail = true;
    },
    closeDiscountDetail() {
      this.menuTipDetail = false;
    },
    showMenuItemDetail(item) {
      this.menuItemInfo = item;
      this.menuItemDetail = true;
    },
    closeMenuItemDetail() {
      this.menuItemDetail = false;
    },
    onSubmit() {
      console.log("结算");
    },
    changeCategory(index) {
      this.categoryIndex = index;
    },
    showCart() {
      this.showCartDetail = true;
    },
    closeCart() {
      this.showCartDetail = false;
    },
    showSettle() {
      this.settlePopup = true;
    },
    closeSettle() {
      this.settlePopup = false;
    }
  },
  head() {
    return {
      title: "自助点单",
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
.menu-content .van-goods-action-mini-btn::after {
  border-width: 0;
}
.menu-list {
  overflow: hidden;
}
.menu-content {
  position: fixed;
  top: 45px;
  left: 0;
  bottom: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.menu-tip {
  display: block;
}
.menu-select-content {
  flex: 1;
  height: 100%;
  display: flex;
  position: relative;
}
.menu-control-bar,
.menu-control-list {
  display: block;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.menu-control-bar {
  width: 85px;
}
.menu-control-bar .van-badge--select::after {
  border-right-width: 0;
}
.menu-control-list {
  flex: 1;
  padding-top: 25px;
  padding-left: 10px;
}
.menu-control-list-tip {
  position: absolute;
  top: 0;
  left: 85px;
  right: 0;
  height: 25px;
  font-size: 14px;
  background-color: #fafafa;
  color: #6c6c6c;
  font-size: 12px;
  line-height: 25px;
  text-indent: 8px;
  z-index: 10;
}
.menu-list-item {
  width: 100%;
  display: flex;
  padding: 10px 0;
}
.menu-list-item:last-child:after {
  border-bottom-width: 0;
}
.menu-item-img {
  width: 100px;
  height: 70px;
}
.menu-item-contnt {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 10px;
  padding-left: 5px;
}
.menu-item-contnt .name {
  font-size: 16px;
  text-indent: 5px;
}
.menu-item-contnt .price-control {
  display: flex;
  justify-content: space-between;
}
.menu-item-contnt .price-control .price {
  color: #f85;
}
.popup-detail {
  display: block;
  min-height: 200px;
  width: 100%;
}
.popup-close {
  position: absolute;
  right: 10px;
  top: 10px;
}
.popup-header .name {
  font-size: 20px;
  text-align: center;
  line-height: 40px;
  margin-top: 10px;
}
.popup-header .name-desc {
  font-size: 12px;
  text-align: center;
  color: #6c6c6c;
}
.detail-content {
  margin: 20px 10%;
  font-size: 14px;
}
.discount-detail-line {
  padding: 3px 0;
}
.detail-item-img {
  width: 100%;
  height: auto;
}
.menu-item-detail-name,
.menu-item-detail-price {
  font-size: 18px;
  margin: 4px 0;
}
.menu-item-detail-price {
  color: #f85;
}
.cart-detail-name {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  background-color: #f8f8f8;
}
.cart-detail-content {
  padding-left: 10px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 50px;
  max-height: 275px;
}
.cart-menu-list .menu-item {
  display: flex;
  align-items: flex-start;
  min-height: 50px;
}
.cart-menu-list .menu-item:last-child::after {
  border-bottom-width: 0;
}
.cart-menu-list .menu-item .item-detail {
  flex: 1;
}
.cart-menu-list .menu-item .item-detail .item-name {
  height: 50px;
  line-height: 50px;
}
.cart-menu-list .menu-item .item-detail .item-feed {
  padding-bottom: 5px;
}
.cart-menu-list .menu-item .item-detail .item-feed .van-tag {
  margin-right: 5px;
}
.cart-menu-list .menu-item .item-price {
  height: 50px;
  width: 60px;
  line-height: 50px;
}
.cart-menu-list .menu-item .item-control {
  height: 50px;
  line-height: 50px;
  width: 90px;
}
.settle-popup-detail {
  height: 100vh;
}
.settle-content {
  margin-top: 45px;
}
</style>
