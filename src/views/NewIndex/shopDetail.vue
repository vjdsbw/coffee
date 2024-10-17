<script setup lang="ts" name="ShopDetail">
import detail from "@/assets/category/detail.png";

import { shopDetailApi } from '@/api/storeApi'

import { Store } from "@/store";

const { user } = Store();

const router = useRouter()
const info = ref<any>({})

const getShopDetail = async () => {
    const { data } = await shopDetailApi({ storeId: history.state.id })
    info.value = { ...data, workTime: data.workTime.split(/\r?\n/) }
}

onMounted(() => {
    if (history.state.id) {
        getShopDetail()
    }
})

</script>

<template>
    <div class="shop-detail-box">
        <div class="top">门店详情</div>
        <div class="shop-detail-content">
            <van-image :src="detail" />
            <div class="info-detail">
                <div class="name"><span>{{ info.name }}{{ info.number }}</span></div>
                <div class="detail">
                    <div class="title">营业时间：</div>
                    <div class="openTime">
                        <span v-for="t in info.workTime" :key="t">{{ t }} </span>
                    </div>
                </div>
                <div class="detail">
                    <div class="title">门店地址：</div>
                    <div class="address">{{ info.address }}</div>
                </div>
            </div>
        </div>
        <van-button type="primary" @click="router.push(`/newindex?code=${user.code}&sign=${user.sign}`)">去喝一杯</van-button>
    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false,
        "authority": false
    }
}</route>

<style scoped lang="scss">
.shop-detail-box {
    height: 100vh;
    overflow: scroll;
    background-color: #f5f5f5;

    .top {
        padding: .5rem 0px;
        font-size: 1.34rem;
        font-weight: 700;
        text-align: center;
    }

    .shop-detail-content {
        background-image: url("@/assets/category/shopDetailBg.png");
        background-repeat: no-repeat;
        background-size: 100% 15rem;
        background-position: top;
        text-align: center;

        .van-image {
            width: 24rem;
            height: 14rem;
            touch-action: none;
            border-radius: .5rem;
            background-color: #fff;
            margin: 2rem auto;
        }

        .info-detail {
            text-align: left;
            width: 22.4rem;
            margin: .3rem auto 0;
            padding: .5rem .7rem;
            border-radius: .5rem;
            background-color: #fff;

            .name {
                color: #333;
                font-size: 1.26rem;
                line-height: 2.36rem;
                margin-right: .16rem;
            }

            .detail {
                display: flex;
                margin-top: .2rem;

                .title {
                    width: 6rem;
                    color: #666;
                    font-size: 1rem;
                    margin-right: .16rem;
                }

                .openTime {
                    display: flex;
                    flex-direction: column;
                    flex: 1 1;
                    font-size: 14px;
                }

                .address {
                    flex: 1 1;
                    color: #333;
                    font-size: 14px;
                }
            }
        }
    }

    .van-button {
        width: 19rem;
        height: 2rem;
        margin: .18rem auto;
        line-height: 2rem;
        border-radius: 1rem;
        font-size: 1.3rem;
        text-align: center;
        color: #fff;
        background-color: #6d86c4;
        position: fixed;
        bottom: 10px;
        right: 0;
        left: 0;
    }
}
</style>
