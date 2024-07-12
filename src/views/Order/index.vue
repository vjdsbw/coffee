<script lang="ts" setup name="Confirm">
import { Store } from "@/store";
import { createOrderApi, preCreateOrderApi, orderRemarkApi } from "@/api/orderApi";
const { order, global } = Store();
const shop = global.shopGet
const router = useRouter();

const onClickLeft = () => history.back()

const onSubmit = async () => {
    if (!remarkForm.value.sure) return showToast("提交订单前请先同意");
    const shop = global.shopGet;
    const params = {
        productList: order.orderSettlement.map((item: any) => ({ skuCode: item.skuCode, amount: item.amount, productId: item.productId })),
        storeId: shop.storeId!,
        orderComments: remarkForm.value.writeTextarea
    }
    const obj = {
        ...params,
        remarkList: orderNotes.value.map((item) => ({ remarkId: item.remarkId, remarkItemName: item.remarkItemName, remarkName: item.remarkName }))
    }
    const { code } = await preCreateOrderApi(params);
    if (code === 0) {
        const res = await createOrderApi(obj);
        if (res.code === 0) {
            router.push({ name: 'Order-details' })
        }
    }
}

const showBottom = ref<boolean>(false);

const remarkForm = ref<{
    mealPickup: string,
    writeTextarea: string,
    sure: boolean
}>({
    mealPickup: '1',
    writeTextarea: "",
    sure: false
})

const textComputed = computed(() => {
    // const str1: string = '取餐方式' + remarkForm.value.mealPickup === '1' ? '店内用餐' : '自提带走;';
    // const str = remarkForm.value.writeTextarea ? remarkForm.value.writeTextarea + ';' + str1 : str1
    let list: any = [];
    orderNotes.value.forEach((item: any) => {
        item.itemList.forEach((itm: any) => {
            if (itm.isDefault) {
                list.push(itm.itemName + item.remarkName)
            }
        })
    })
    return {
        textRemark: list.join(';'),
        // questComments: str
    }
})

const orderNotes = ref<any[]>([]);

const remarkShow = async () => {
    let params = {
        productList: order.orderSettlement.map((item: any) => ({ skuCode: item.skuCode, amount: item.amount, productId: item.productId })),
        storeId: shop.storeId!,
    }
    const { code, data } = await orderRemarkApi(params);
    if (code === 0 && data && data.length > 0) {
        orderNotes.value = data.map((item: any) => {
            let itmObj = { ...item, remarkItemName: '' }
            item.itemList.forEach((itm: any) => {
                if (itm.isDefault === 1) {
                    itmObj.remarkItemName = itm.itemName
                }
            })
            return itmObj;
        })
        showBottom.value = true;
    }
}

const notesSelecte = (item: any, itm: any) => {
    item.itemList.forEach((e: any) => e.isDefault = 0)
    itm.isDefault = 1;
    item.remarkItemName = itm.itemName;
}

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

        <div class="remark-notes">
            <!-- <div>
                <div>取餐方式</div>
                <div>
                    <van-radio-group v-model="remarkForm.mealPickup" direction="horizontal">
                        <van-radio name="1">店内用餐</van-radio>
                        <van-radio name="2">自提带走</van-radio>
                    </van-radio-group>
                </div>
            </div> -->
            <div>
                <div>备注特殊要求</div>
                <div @click="remarkShow">
                    <div>{{ textComputed.textRemark }}</div>
                    <van-icon name="arrow" size="20" />
                </div>
            </div>
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
                <div class="type">
                    <div class="type-item" v-for="item in orderNotes" :key="item.remarkId">
                        <div>{{ item.remarkName }}：</div>
                        <div>
                            <span v-for="itm in item.itemList" :key="itm.itemName"
                                :class="{ active: itm.isDefault === 1 }" @click="notesSelecte(item, itm)">
                                {{ itm.itemName }}</span>
                        </div>
                    </div>
                </div>
                <van-cell-group class="text" inset>
                    <van-field v-model="remarkForm.writeTextarea" autosize class="textarea" maxlength="50"
                        placeholder="请备注内容" rows="4" show-word-limit type="textarea" />
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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .type {
            width: 95%;
            color: #333;
            background-color: #fff;

            .type-item {
                margin: .3rem 0rem;
                display: flex;
                align-items: center;
                height: 2rem;

                &>div:first-child {
                    font-weight: 600;
                }

                div {
                    span {
                        display: inline-block;
                        margin: 0rem .5rem;
                        padding: .2rem 1rem;
                        background-color: #e6e3e3;
                        border-radius: 1rem;
                    }

                    .active {
                        color: #152e93;
                        border: 1px solid #152e93;
                        background-color: #f5f5f5;
                    }
                }
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

    .remark-notes {
        margin: 10px 16px;
        border-radius: .5rem;

        &>div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #333;
            background-color: #fff;

            padding: .5rem .5rem;


            &>div:first-child {
                font-weight: 600;
                font-size: 14px;
                width: 30%;
            }

            &>div:last-child {
                font-size: 14px;
                text-align: right;
                width: 70%;
                display: flex;
                align-items: center;

                &>div:first-child {
                    width: 90%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                :deep(.van-radio-group) {
                    width: 100% !important;
                    justify-content: flex-end;
                }
            }
        }
    }
}
</style>