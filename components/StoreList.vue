<template>
  <div class="store-list" v-if="data.length > 0">
    <CellGroup>
      <Cell class="store-list-item" v-for="item in data" :key="item.id">
        <template slot="title">
          <span class="van-cell-text">{{item.n}}</span>
          <div class="van-cell__label">
              <div>
                <Icon name="location" />{{item.addr}}
              </div>
              <div>
                <Icon name="location" />{{item.tel}}
              </div>
          </div>
        </template>
        <Button slot="right-icon" type="warning" size="small" @click="() => goToShop(item)">去点单</Button>
      </Cell>
    </CellGroup>
  </div>
  <Empty v-else msg="暂无门店" />
</template>

<script>
import { Button, Cell, CellGroup, Icon } from "vant";
import Empty from '~/components/feature/Empty.vue';
export default {
  name: "store-list",
  components: {
    Button,
    Cell,
    CellGroup,
    Icon,
    Empty,
  },
  props: {
    data: Array
  },
  methods: {
    goToShop(item) {
      window.location.href = `/m/weixin/menu?storeId=${item.id}&sgId=308bb0a71c98acad223c99694739fdf2&name=${item.n}`;
    }
  }
};
</script>

<style scoped>
@import "~/assets/vant.css";
.store-list {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.store-list-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
