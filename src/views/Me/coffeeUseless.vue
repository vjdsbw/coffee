<script lang="ts" setup>
const router = useRouter()

const onClickLeft = () => history.back()


</script>

<template>
  <div class="container">
    <van-nav-bar
        left-arrow
        left-text="返回"
        title="无效咖啡券"
        @click-left="onClickLeft"
    />

    <van-empty
        description="没有已过期的咖啡券"
        image="../src/assets/me/emptyBg.png"
        image-size="150"
    />

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