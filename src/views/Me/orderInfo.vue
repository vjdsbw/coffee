<script lang="ts" setup>

const router = useRouter()
const active = ref(0)

const onClickLeft = () => history.back()

const tabClick = (e: { name: string | number, title: string, event: MouseEvent, disabled: boolean }) => {
  console.log(e)
}
</script>

<template>
  <div class="container">
    <van-nav-bar
        left-arrow
        left-text="返回"
        title="订单信息"
        @click-left="onClickLeft"
    />
    <van-tabs v-model:active="active" @click-tab="tabClick">
      <van-tab>
        <template #title> 我的订单</template>

      </van-tab>
      <van-tab>
        <template #title> 代付订单</template>
      </van-tab>
    </van-tabs>
  </div>
</template>

<route lang="json">{
"meta": {
"layout": "",
"authority":true
}
}
</route>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}
</style>