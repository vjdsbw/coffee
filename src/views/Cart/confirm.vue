<script lang="ts" setup name="Confirm">
import AMapLoader from '@amap/amap-jsapi-loader'; // 地图map
import { createOrderApi } from "@/api/orderApi";
import { AMAP_MAP_KEY } from "@/config/const"
import { Store } from "@/store";

const { order, global } = Store();
const address = global.latAndLonGet
const shop = global.shopGet
const placeInfo = order.getPlaceInfo

const router = useRouter();
const checked = ref(false);

const onClickLeft = () => history.back()

const onSubmit = async () => {
  let param = {
    productList: placeInfo,
    storeId: shop.storeId!,
    uid: 'string',
  }
  const { data } = await createOrderApi(param)
  router.push({ name: 'Cart-paymentDetails' })
}

// 地图初始化
const initMap = () => {
  // 参数为中心点经纬度坐标
  AMapLoader.load({
    key: AMAP_MAP_KEY,
    version: '2.0',
    plugins: ['AMap.Marker'] // 地图插件 根据需求从高德开放平台添加
  })
    .then((AMap: any) => {
      let amap = new AMap.Map('container', {
        viewMode: '3D', //  是否为3D地图模式
        zoom: 10, //  地图显示的缩放级别
        zooms: [2, 22], // 地图缩放范围
        center: [address.lon, address.lat], //  地图中心点坐标  32.086826&lon=118.795996
        resizeEnable: true //  是否监控地图容器尺寸变化
      });
      let marker = new AMap.Marker({
        map: amap,
        position: [address.lon, address.lat]
      });
      amap.add(marker)
    })
};

onMounted(() => {
  initMap();
})

</script>

<template>
  <div class="cart-box">
    <van-nav-bar left-arrow left-text="返回" title="确认订单" @click-left="onClickLeft" />

    <div class="top-map">
      <div class="map" id="container"></div>
      <van-cell-group inset>
        <van-cell title="单元格" value="内容">
          <template #title>
            <div class="map-title">
              <van-icon name="location-o" />
              <div class="map-title-right">
                <div class="map-title-address">{{ shop.name }}</div>
                <div class="map-title-km">距离你{{ shop.distance }}</div>
              </div>
            </div>
          </template>
          <template #value>
            <van-button class="map-title-btn" round size="small" type="primary">修改地址</van-button>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="place-box">
      <van-card v-for="item in placeInfo" :key="item.id" :num="item.amount" :price="item.price"
        :desc="item.saleAttrNames" :title="item.productName + item.showAttrNames" :thumb="item.productPicUrl" />
    </div>

    <div class="total-num">
      <van-cell-group inset>
        <van-cell icon="cash-back-record" title="咖啡钱包" value="不可用" />
        <van-cell icon="cash-back-record" title="使用优惠券" value="不可用" />
        <van-cell title="" value="不可用">
          <template #value>
            <div class="total-num-total">
              <span>共优惠¥</span>
              <span>实付¥0</span>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="pay-type">
      <van-cell-group inset>
        <van-cell center label="感谢您的支持" title="支付方式" value="内容">
          <template #value>
            <van-button size="small" type="primary">支付宝</van-button>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="remark">
      <van-cell-group inset>
        <van-cell clickable is-link title="备注特殊要求" value="需要纸巾" @click="router.push('/cart/remark')" />
      </van-cell-group>
    </div>

    <div class="confirm-select">
      <div class="select-btn">
        <van-checkbox v-model="checked" icon-size="14px">我已阅读并且同意提交订单</van-checkbox>
      </div>
      <div class="select-text">
        温馨提示: 仅支持开具电子发票,订单完成后可前往发票开具
      </div>
    </div>

    <van-submit-bar :price="3050" button-text="确认订单" @submit="onSubmit" />

  </div>
</template>

<route lang="json">{
  "meta": {
    "layout": "",
    "authority": true
  }
}</route>
<style lang="scss" scoped>
.cart-box {
  background-color: #f7f7f7;
  height: 100vh;
  overflow: scroll;

  &>div {
    margin-bottom: 10px;
  }

  &>div:last-child {
    margin-bottom: 0;
  }

  .top-map {
    :deep(.map) {
      margin: 0 auto;
      height: 8rem;
      width: 90%;
      background-color: #ccc;

      .amap-logo {
        display: none;
        opacity: 0 !important;
      }

      .amap-copyright {
        opacity: 0;
      }
    }

    .map-title {
      display: flex;
      align-items: center;

      .map-title-right {
        display: flex;
        flex-direction: column;
        margin-left: 0.5rem;
        justify-content: space-around;

        .map-title-address {
          font-weight: bolder;
          color: #1a1a1a;
          font-size: .8rem;
        }

        .map-title-km {
          font-size: 0.7rem;
        }
      }

    }

    :deep(.van-cell__value) {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }


  .total-num {
    .total-num-total {
      font-size: .8rem;
      font-weight: 500;
      color: #1a1a1a;

      &>span {
        margin: 0 8px;
      }
    }
  }

  .confirm-select {
    width: 90%;
    margin: 0 auto;
    font-size: .6rem;
    margin-bottom: 3.5rem;

    .select-btn {
      margin-bottom: 10px;
    }

    .select-text {
      font-size: .6rem;
      color: #727272;
    }
  }

  .place-box {
    margin: .3rem 1rem;
    background-color: #fff;

    .van-card {
      background-color: #fff;
    }
  }
}
</style>