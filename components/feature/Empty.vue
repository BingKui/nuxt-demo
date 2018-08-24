<template>
  <div class="page-empty">
    <img class="empty-img" src="~/assets/icon/empty.svg" alt="暂无数据">
    <span class="empty-msg">{{message}}</span>
  </div>
</template>

<script>
  export default {
    name: 'empty',
    props: {
      msg: String,
    },
    data() {
      return {
        message: this.msg || '暂无数据',
      }
    }
  }
</script>

<style scoped>
.page-empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.empty-img {
  width: 80px;
  height: 80px;
}
.empty-msg {
  color: #bfbfbf;
  font-size: 14px;
  line-height: 25px;
  margin-top: 15px;
}
</style>
