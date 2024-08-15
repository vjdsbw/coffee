<script setup lang="ts" name="Me-Phone">
import { couponPhoneDataApi } from "@/api/user.ts";
const onClickLeft = () => history.back();

const list = ref<{
  availableCount: number;
  phone: string;
  sharedCount: number;
  uid: string;
  usedCount: number
}[]>([])

const getCouponPhoneData = async () => {
  const { code, data } = await couponPhoneDataApi()
  if (code === 0) {
    list.value = data;
  }
}

onMounted(() => {
  getCouponPhoneData();
})
</script>

<template>
  <div class="me-phone-box">
    <van-nav-bar title="uid链接" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div v-for="(item, index) in list" :key="index" class="box-content" v-show="list.length > 0">
      <div>Uid:<span>{{ item.uid }}</span></div>
      <div>手机号: <span>{{ item.phone }}</span></div>
      <div class="use-coupon">可用数量:<span>{{ item.availableCount }}</span></div>
      <div class="use-coupon">分享数量:<span>{{ item.sharedCount }}</span></div>
      <div class="use-coupon">使用数量:<span>{{ item.usedCount }}</span></div>
    </div>
    <van-empty v-show="list.length === 0" description="暂无数据" />
  </div>
</template>

<route lang="json">{
  "meta": {
    "layout": false,
    "authority": false
  }
}</route>

<style scoped lang="scss">
.me-phone-box {
  background-color: #f5f5f5;
  height: 100vh;
  overflow-y: scroll;

  .box-content {
    color: #000000;
    background-color: #fff;
    margin: 10px 10px;
    font-size: 15px;

    span {
      margin-left: 10px
    }

    .use-coupon {
      color: #8d8d8d;
    }
  }
}
</style>