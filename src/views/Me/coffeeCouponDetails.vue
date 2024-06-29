<script lang="ts" name="coffeecoupondetails" setup>
const router = useRouter()
const show = ref(false)

const onClickLeft = () => history.back()
const coffeeDetailsInfo = ref<any>(null)
console.log(coffeeDetailsInfo)
onMounted(() => {
  coffeeDetailsInfo.value = history.state
})
</script>

<template>
  <div class="container">
    <van-nav-bar
        left-arrow
        left-text="返回"
        title="咖啡券详情"
        @click-left="onClickLeft"
    />

    <div class="coffee-details">
      <div class="price">
        <div>{{ coffeeDetailsInfo?.discountDegree }}</div>
        <div>尚余{{ coffeeDetailsInfo?.discountDegree }}杯</div>
      </div>
      <div class="desc">
        <div>
          <span>{{ coffeeDetailsInfo?.level }}</span>
          <span>{{ coffeeDetailsInfo?.coffeeStockTitle }} <van-icon color="#6d86c4" name="more-o" @click="show=!show"/></span>
        </div>
        <div>有效期:{{ coffeeDetailsInfo?.validDateDesc }}</div>
      </div>
      <div class="btn">
        <van-button round type="primary" @click="router.push('/home')">立即使用</van-button>
      </div>
    </div>

    <van-action-sheet v-model:show="show" title="咖啡券说明">
      <ul class="content">
        <li>1. 咖啡券里存储的是商品券；</li>
        <li></li>
        <li>2. 您可通过官方购买；</li>
        <li></li>
        <li>3.
          商品券有不同的固定面额，分别对应不同档位商品价格，结算时，商品券可抵扣相应面额的商品费用，但不包含风味糖浆、奶油等辅料及配送费，不设找零，超额将无法下单，一次可使用多张商品券；
        </li>
        <li></li>
        <li>4. 为丰富用户权益，商品券可同时在Coffee中使用。</li>
      </ul>
    </van-action-sheet>
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

  .coffee-details {
    width: 100%;
    height: 13%;
    background: url("@/assets/me/coffeeDetails.png") no-repeat;
    background-size: 100% 105%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .price {
      width: 20%;
      height: 80%;
      color: #1a1a1a;
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin-left: 5%;
      align-items: center;
    }

    .desc {
      width: 60%;
      height: 80%;
      color: #1a1a1a;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: flex-start;
    }

    .btn {
      width: 20%;
      height: 80%;
      color: #1a1a1a;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      margin-right: 5%;

      & > button {
        width: 100%;
        height: 30%;
        padding: 0 5px;
        font-size: 0.8rem;
        background: #6d86c4;
      }
    }
  }

  .content {
    padding: 16px 16px 50px;
  }
}
</style>