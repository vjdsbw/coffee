<script lang="ts" setup name="Confirm">
import { Store } from "@/store";
import { createOrderApi, preCreateOrderApi } from "@/api/orderApi";
const { order, global } = Store();
const shop = global.shopGet
const router = useRouter();

const onClickLeft = () => history.back()

const onSubmit = async () => {
    if (!remarkForm.value.sure) showToast("提交订单前请先同意")
    const shop = global.shopGet;
    let params = {
        productList: order.orderSettlement.map((item: any) => {
            return { skuCode: item.skuCode, amount: item.amount, productId: item.productId }
        }),
        storeId: shop.storeId!,
        orderComments: remarkForm.value.orderComments
    }
    const { code } = await preCreateOrderApi(params);
    if (code === 0) {
        const res = await createOrderApi(params);
        if (res.code === 0) {
            router.push({ name: 'Order-details' })
        }
    }
}
const showBottom = ref<boolean>(false);
const remarkForm = ref<{
    mealPickup: string,
    remark: string,
    contactlessDelivery: string,
    tissue: string,
    orderComments: string,
    sure: boolean
}>({
    mealPickup: '',
    remark: '',
    contactlessDelivery: '',
    tissue: '',
    orderComments: "",
    sure: false
})


</script>

<template>
    <div class="cart-box">
        <van-nav-bar left-arrow left-text="返回" title="确认订单" @click-left="onClickLeft" />
        <div class="top-map">
            <van-cell-group inset>
                <van-cell>
                    <template #title>
                        <div class="map-title">
                            <van-icon name="location-o" />
                            <div class="map-title-right">
                                <div class="map-title-address">{{ shop.name }}</div>
                                <div class="map-title-km">距离你{{ shop.distance }}</div>
                            </div>
                        </div>
                    </template>
                </van-cell>
            </van-cell-group>
        </div>

        <div class="place-box" v-if="order.orderSettlement">
            <van-card v-for="item in order.orderSettlement" :key="item.id" :num="item.amount" :price="item.price"
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

        <div class="remark">
            <van-cell-group inset>
                <van-cell clickable is-link title="备注特殊要求" @click="showBottom = true" />
            </van-cell-group>
        </div>

        <div class="confirm-select">
            <div class="select-btn">
                <van-checkbox v-model="remarkForm.sure" icon-size="14px">我已阅读并且同意提交订单</van-checkbox>
            </div>
            <div class="select-text">
                温馨提示: 仅支持开具电子发票,订单完成后可前往发票管理中开具
            </div>
        </div>
        <van-submit-bar button-text="确认订单" @submit="onSubmit" />
        <!-- 底部弹出 -->
        <van-popup v-model:show="showBottom" position="bottom" :style="{ height: '45%' }">
            <div class="cart-box-content">
                <!-- <div class="type">
                    <div class="type-item">
                        <span> 取餐方式:</span>
                        <span>
                            <van-radio-group v-model="remarkForm.mealPickup" direction="horizontal">
                                <van-radio name="1">店内用餐</van-radio>
                                <van-radio name="2">自提带走</van-radio>
                            </van-radio-group>
                        </span>
                    </div>
                    <div class="type-item">
                        <span> 无接触配送：</span>
                        <span>
                            <van-radio-group v-model="remarkForm.contactlessDelivery" direction="horizontal">
                                <van-radio name="1">需要</van-radio>
                                <van-radio name="2">不需要</van-radio>
                            </van-radio-group>
                        </span>
                    </div>
                    <div class="type-item">
                        <span> 纸巾：</span>
                        <span>
                            <van-radio-group v-model="remarkForm.tissue" direction="horizontal">
                                <van-radio name="1">需要</van-radio>
                                <van-radio name="2">不需要</van-radio>
                            </van-radio-group>
                        </span>
                    </div>
                </div> -->
                <van-cell-group class="text" inset>
                    <van-field v-model="remarkForm.orderComments" autosize class="textarea" maxlength="50"
                        placeholder="请备注内容" rows="6" show-word-limit type="textarea" />
                </van-cell-group>
                <van-button type="primary" style="margin: 1rem 1rem ;width: 95%;"
                    @click="showBottom = false">确定</van-button>
            </div>
        </van-popup>

    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false,
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

    .cart-box-content {
        margin-top: .5rem;
        background: #f6f6f6;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;


        .type {
            width: 95%;
            color: #333;

            .type-item {
                display: flex;
                margin: 5px 0;
            }
        }

        .text {
            width: 95%;
            height: 60%;

            .textarea {
                height: 100%;
                background-color: #e7e7e7;

            }
        }

        .submit {
            width: 95%;
        }
    }
}
</style>