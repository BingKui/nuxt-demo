<template>
  <div class="ld-popup-select">
    <!-- <Row align="center">
      <Col span="4">{{label}}</Col>
      <Col span="20">{{showValue}}</Col>
    </Row> -->
    <div class="select-label">{{label}}</div>
    <div class="select-value" :class="showValue ? '' : 'placeholder'" @click="openSelect">{{showValue ? showValue : placeholder}}</div>
    <Popup v-model="showSelect" position="bottom">
      <Picker :columns="data" show-toolbar @cancel="hideSelect" @confirm="select"/>
    </Popup>
  </div>
</template>

<script>
import { Popup, Row, Col, Picker } from "vant";
export default {
  name: "popup-select",
  props: {
    label: String,
    placeholder: String,
    data: Array
  },
  data() {
    return {
      showSelect: false,
      selectItem: "",
      showValue: ""
    };
  },
  components: {
    Row,
    Col,
    Popup,
    Picker
  },
  methods: {
    openSelect() {
      this.showSelect = true;
    },
    hideSelect() {
      this.showSelect = false;
    },
    select(value, index) {
      this.hideSelect();
      this.showValue = value;
      console.log(value);
    }
  }
};
</script>

<style>
@import "~/assets/vant.css";
.ld-popup-select {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.ld-popup-select .select-label {
  flex: 1;
}
.ld-popup-select .select-value {
  flex: 3;
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 4px;
}
.ld-popup-select .select-value.placeholder {
  color: #ddd;
}
</style>
