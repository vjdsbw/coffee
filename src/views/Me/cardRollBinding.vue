<script lang="ts" setup>
import {bindUidApi} from "@/api/user.ts";

const router = useRouter()
const show = ref(false)
const list = ref<any>([])
const onClickLeft = () => history.back()


const titleClick = () => {
  show.value = !show.value
}

const CoffeeCouponDetails = (item: any) => {
  router.push({path: '/me/coffeecoupondetails', state: item})
}

onMounted(() => {
  bindUidApi({uidList: ['b93c995d-d6b9-469d-9bec-0cd167e3bfc41720102820651']}).then(res => {
    console.log('获取卡券', res)
    if (res.code === 0) {
      list.value = res.data
    }

    if (res.code === 500) {
      showToast(res.msg);
    }
  })
})
</script>

<template>
  <div class="container">
    <van-nav-bar
        left-arrow
        left-text="返回"
        title="咖啡券信息"
        @click-left="onClickLeft"
    >
      <template #title>
        <div @click="titleClick">剩余可下咖啡券
          <van-icon name="more-o"/>
        </div>
      </template>
    </van-nav-bar>
    <div class="wallet-content">
      <div v-for="(item, index) in list" class="wallet-item" @click=" CoffeeCouponDetails(item) ">
        <div class="wallet-item-top"> {{ item?.coffeeStockTitle }}</div>
        <div class="wallet-item-bottom">
          <div class="wallet-item-text">
            <div>¥{{ item?.discountDegree }}</div>
            <div>尚余1杯</div>
          </div>
          <div class="wallet-item-img">
            <van-image
                fit="cover"
                height="50"
                src="../src/assets/me/coffeeIcon.png"
                width="30"
            />
          </div>
        </div>
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

  .wallet-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;

    .wallet-item {
      width: 50%;
      height: 120px;
      margin: 5px 0;
      background: url("@/assets/me/coffeeBg.png") no-repeat;
      background-size: 100% 110%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-content: center;

      .wallet-item-top {
        color: #000;
        padding-left: 10%;
        font-size: 0.8rem;

        & > span {
          font-weight: 500;
          font-size: 1.3rem;
        }
      }

      .wallet-item-bottom {
        display: flex;
        align-content: center;
        justify-content: space-around;
      }

      .wallet-item-text {
        color: #000;

        & > div:first-child {
          font-size: 1.5rem;
        }

        & > div:last-child {
          color: #ccc;
        }
      }
    }
  }

  .content {
    padding: 16px 16px 50px;
  }
}
</style>