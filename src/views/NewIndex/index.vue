<script setup lang="ts" name="new-index">
import lookStore from "@/assets/lookStore.png";
import { nearestApi, productMenuApi } from '@/api/storeApi'
import { cartListApi, productDetailApi, purchasablePriceApi } from '@/api/productApi'

import { Store } from "@/store";
import Cart from './components/cart.vue'
import Product from './components/product.vue'

const router = useRouter();

const { global, order, user } = Store();

const activeSection = ref(0);
const contentRef = ref<HTMLElement | null>(null);
const scrollSider = ref<string>('left')

const scrollToSection = (index: number) => {
  scrollSider.value = 'left'
  document.getElementById(`sidebarSelct${index}`)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "start",
  });
};

const onScroll = () => {
  const contentElement = contentRef.value;
  if (!contentElement) return;
  const sectionElements = contentElement.querySelectorAll(".content-section");
  sectionElements.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < 211 && rect.bottom > 0) {
      if (scrollSider.value === 'right') {
        activeSection.value = index
        document.getElementById(`sidebar${index}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      }
    }
  });
};

const scrollend = () => {
  scrollSider.value = 'right';
}

const menuList = ref<any>({})

const getMenus = async (id: number) => {
  const { data } = await productMenuApi({ storeId: id })
  let list: any = []
  data.forEach((item: any) => {
    const filterProcut = item.productList.filter((itm: any) => itm.price <= limitPrice.value)
    if (filterProcut.length > 0) {
      list.push({ ...item, productList: filterProcut })
    }
  })
  menuList.value = list;
  history.state.choosedShop = {};
}

const chooseShop = () => {
  router.push({ name: "NewIndex-shopList" })
}

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

const success = async (pos: any) => {
  const { latitude, longitude } = pos.coords;
  global.setLatAndLon({ lat: latitude, lon: longitude })
  const { data } = await nearestApi({ lat: latitude, lon: longitude })
  const shop = global.shopGet
  if (shop.storeId) {
    getMenus(shop.storeId)
  } else {
    getMenus(data.storeId)
    global.setShop(data)
  }
}

const error = (err: any) => showToast(`ERROR(${err.code}): ${err.message}`)

const limitPrice = ref<number>(0)

const getLimitPrice = async () => {
  const { data, code, msg } = await purchasablePriceApi()
  if (code === 0) {
    if (data.status === 1) {
      limitPrice.value = data.couponPrice
      global.setLimitPrice(data)
      getLocation()
    } else {
      router.push({ name: 'Order-details' })
    }
  } else {
    showToast(msg)
  }
}


onMounted(async () => {
  const contentElement = contentRef.value;
  if (contentElement) {
    contentElement.addEventListener("scroll", onScroll);
    contentElement.addEventListener("scrollend", scrollend);
  }
  const searchParams = new URL(location.href).searchParams
  let code = searchParams.get('code')
  if (code) {
    user.setCode(code) //E96eR2hxZRC
    getLimitPrice()
  }
});

onUnmounted(() => {
  const contentElement = contentRef.value;
  if (contentElement) {
    contentElement.removeEventListener("scroll", onScroll);
    contentElement.addEventListener("scrollend", scrollend);
  }
});


const showBottom = ref<boolean>(false)
const closePopUp = () => showBottom.value = false;
const productDetail = async (productId: string) => {
  const { data } = await productDetailApi({ productId: productId, storeId: global.shop.storeId! });
  order.saveOrderProduct(data)
  showBottom.value = true;
}

const showCarBottom = ref<boolean>(false)

const toBuy = async () => {
  let list: any = []
  //过滤出选择的商品
  order.orderCheck.forEach((item: any) => {
    const idx = order.orderList.findIndex((itm: any) => itm.id === item)
    if (idx !== -1) {
      list.push(order.orderList[idx])
    }
  })
  showConfirmDialog({
    title: '再想想',
    message: '是否确认提交订单',
  }).then(() => {
    order.saveOrderSettlement(list);
    router.push({ name: 'Order' })
  }).catch(() => {

  });

  // const shop = global.shopGet
  // let params = {
  //   productList: list,
  //   storeId: shop.storeId!
  // }
  // const { code } = await preCreateOrderApi(params);
  // if (code === 0) {
  //   const res = await createOrderApi(params);
  //   if (res.code === 0) {
  //     router.push({ name: 'Order-details' })
  //   }
  // }
}

const cartChange = async () => {
  const shop = global.shopGet
  if (shop.storeId) {
    const { data } = await cartListApi({ storeId: shop.storeId });
    order.saveOrderList(data)
    let num = 0;
    let prices = 0;
    data.forEach((item: any) => {
      num += Number(item.amount)
      prices += Number(item.amount) * Number(item.price)
    });
    global.setTotal({ totalNum: num, totalPrice: prices })
    showCarBottom.value = true;
  }
}

const selectedProduct = computed(() => {
  let list: any = []
  let price = 0;
  let num = 0;
  order.orderCheck.forEach((item: any) => {
    const idx = order.orderList.findIndex((itm: any) => itm.id === item)
    if (idx !== -1) {
      list.push(order.orderList[idx])
      price += Number(order.orderList[idx].amount) * Number(order.orderList[idx].price)
      num += Number(order.orderList[idx].amount)
    }
  })
  return {
    selectList: list,
    selectPrice: price,
    selectNum: num
  }
})

</script>

<template>
  <div class="new-index">
    <div class="top">
      <van-image :src="lookStore"></van-image>
      <div class="top-right">
        <div @click="chooseShop">{{ global.shop.name }}{{ global.shop.number }} <van-icon color="#000000" name="arrow"
            v-show="global.shop.name" /> </div>
        <div>
          <van-icon name="location-o" v-show="global.shop.distance" />
          <span v-show="global.shop.distance">距您{{ global.shop.distance }} </span> {{ global.shop.address }}
        </div>
      </div>
    </div>
    <div class="sider-product">
      <van-sidebar v-model="activeSection">
        <van-sidebar-item v-for="(item, index) in menuList" :key="item.id" :id="'sidebar' + index"
          @click="scrollToSection(index)">
          <template #title>
            <div>
              <van-icon v-show="activeSection === index" :name="item.icon" size="1.5rem" />
            </div>
            <div v-show="activeSection !== index && item.tagName && item.tagBgColor" class="sidebar-tagName">
              <span :style="{ backgroundColor: item.tagBgColor, color: '#fff' }">{{ item.tagName }}</span>
            </div>
            <div>{{ item.name }}</div>
          </template>
        </van-sidebar-item>
      </van-sidebar>

      <!-- 右侧 Content -->
      <div class="content" ref="contentRef">
        <div class="content-section" v-for="(item, index) in menuList" :key="item.id" :id="'sidebarSelct' + index">
          <div class="content-section-header">
            <div class="heiader-image">
              <van-image height="100%" :src="item.sourceUrl" width="100%" v-show="item.sourceUrl" />
            </div>
            <div class="heiader-text">
              <strong>{{ item.name }}</strong>
              <div>{{ item.desc }}</div>
            </div>
          </div>
          <div class="content-section-card">
            <van-card v-for="product in item.productList" :key="product.productId" :price="product.price"
              :desc="product.enName" :title="product.name" :thumb="product.picUrl" :origin-price="product.price"
              @click="productDetail(product.productId)">
              <template #footer>
                <van-icon v-if="product.price <= limitPrice" name="add" size="1.5rem" color="#041ba7" />
                <van-icon v-else name="add" size="1.5rem" color="#bdbec3" />
              </template>
            </van-card>
          </div>
        </div>
      </div>
    </div>
    <div class="new-index-bottom">
      <div class="trade">
        <div class="left">
          <van-icon name="shop" size="1.8rem" color="#041ba7" @click="cartChange" />
          <div class="des">本次交易可选购1商品已选购{{ selectedProduct.selectNum }}商品</div>
        </div>
        <div class='right noactive' v-show="selectedProduct.selectNum === 0"> 不可结算</div>
        <div class='right' v-show="selectedProduct.selectNum > 0" @click="toBuy"> 去结算</div>
      </div>
    </div>
    <van-popup v-model:show="showBottom" position="bottom" :style="{ height: '100%' }">
      <Product @closeClick="closePopUp"></Product>
    </van-popup>
    <van-popup v-model:show="showCarBottom" position="bottom" z-index="3" style="border-radius: 1rem 1rem 0px 0px;">
      <Cart></Cart>
    </van-popup>
  </div>
</template>

<route lang="json">{
  "meta": {
    "layout": false,
    "authority": false
  }
}</route>

<style scoped lang="scss">
.new-index {
  height: 100vh;
  background-color: #f5f5f5;
  overflow: scroll;

  .top {
    height: 10vh;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0.5rem;
    align-items: center;

    .top-right {
      margin-top: .2rem;
      margin-left: 1rem;

      &>div:nth-child(1) {
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 3px;
        position: relative;
        color: black;

        .van-icon {
          float: right;
        }
      }

      &>div:nth-child(2) {
        font-size: 12px;
        color: grey;

        span {
          color: black;
          font-weight: 700;
          padding: 0px .2rem;
          margin: 0px .3rem;
          border-right: 1px solid grey;
        }
      }
    }

    .van-image {
      margin-top: .2rem;
      width: 5rem;
      height: 4rem;
    }
  }

  .sider-product {
    height: calc(90vh - 1rem);
    margin-top: .5rem;
    display: flex;

    .van-sidebar {
      width: 7rem;
      height: calc(90vh - 1rem);
      overflow: scroll;
      background-color: #f6f6f6;

      :deep(.van-sidebar-item) {
        padding: .5rem 0rem;
        // border-radius: 0rem 1rem 1rem 0rem;
        // margin-right: .5rem;
        text-align: center;

        .van-sidebar-item__text {
          height: 1rem;
          // line-height: 1rem;
          width: 100%;
          text-align: center;

          .sidebar-tagName {
            width: 100%;
            text-align: right;
            font-size: 12px;
            border-radius: 1rem 1rem 1rem 0rem;

            span {
              display: inline-block;
              background-color: rgb(194, 163, 121);
              color: rgb(255, 255, 255);
              width: 3rem;
              text-align: center;
              margin-right: .5rem;
              border-radius: .6rem .7rem .7rem 0rem;
            }
          }

        }
      }

      .van-sidebar-item--select {
        background-color: #e3e3e3;

        &::before {
          height: 80%;
          width: 0.4rem;
          // border-radius: 50%;
          left: -0.2rem;
          background-color: #041ba7;
        }
      }


    }

    .content {
      height: calc(90vh - 1rem);
      overflow: scroll;
      flex: 1;
      padding-bottom: 3rem;

      .content-section {
        margin: 0px 0px 10px 0px;
        background-color: #fff;
        border-radius: 1rem;

        .content-section-header {
          position: sticky;
          top: 0;
          padding: 0rem 0rem;
          z-index: 1;
          font-size: 10px;
          background-color: #fff;
          color: #1a1a1a;
          border-radius: 1rem 1rem 0rem 0rem;

          .heiader-image {
            border-radius: 1rem 1rem 0rem 0rem;
            height: 50px;
            // background-image: url("@/assets/menuItemTitleBg.png");
            background-size: 100% 100%;
          }

          .heiader-text {
            padding: 0rem .5rem;

            strong {
              font-size: 1rem;
            }

            div {
              color: #999;
              font-size: .7rem;
              white-space: pre-wrap;
            }
          }

        }

        .content-section-card {
          padding: .3rem .2rem;

          :deep(.van-card) {
            background-color: #fff;
            padding: .5rem .7rem;
            margin: 0rem;

            .van-card__footer {
              position: absolute;
              right: 8px;
              bottom: 8px;
            }
          }
        }


      }
    }
  }

  .new-index-bottom {
    position: fixed;
    bottom: 1rem;
    border-radius: 10px;
    width: 100%;
    z-index: 5;

    .trade {
      width: 90%;
      height: 3rem;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        padding: .01rem 1rem;
        align-items: center;
        background-color: #ffff;
        width: 75%;
        font-size: 14px;
        border-radius: 2rem 0rem 0rem 2rem;
        color: grey;

        .van-image {
          width: 1.7rem;
          height: 1.7rem;
        }

        .des {
          margin-left: 1rem;
        }
      }

      .right {
        width: 25%;
        padding: .35rem;
        text-align: center;
        border-radius: 0rem 2rem 2rem 0rem;
        color: #ffff;
        background-color: #041ba7;
      }

      .noactive {
        background-color: grey;
      }
    }
  }

}
</style>