<script setup lang="ts" name="Cart">
import shopbagBg from "@/assets/icons/shopbag_bg.png";
import { cartListApi, removeProductApi, updateProductAmountApi, cleareCartApi } from "@/api/productApi";

import { Store } from "@/store";

const { global, order } = Store();

const checkboxGroup = ref(null);

const checked = ref<any[]>([]);

const isCheckAll = ref(false);

const isIndeterminate = ref(true);

const getFindAllShop = async () => {
    const shop = global.shopGet
    if (shop.storeId) {
        const { data } = await cartListApi({ storeId: shop.storeId });
        order.saveOrderList(data)
        global.setTotal({ totalNum: allCartNum.value, totalPrice: allCartTotalPrice.value })
    }
};

const checkAllChange = (val: boolean) => {
    checked.value = val ? order.orderList.map((item: any) => item.id) : [];
    isIndeterminate.value = false;
    order.saveOrderCheck(checked.value);
};

const checkedResultChange = (value: string[]) => {
    const checkedCount = value.length;
    isCheckAll.value = checkedCount === order.orderList.length;
    isIndeterminate.value =
        checkedCount > 0 && checkedCount < order.orderList.length;
    order.saveOrderCheck(checked.value);
};

const allCartPrice = computed(() => {
    let price = 0;
    let num = 0;
    order.orderList.map((item: any) => {
        if (checked.value.includes(item.id)) {
            price += Number(item.amount) * Number(item.price);
            num += Number(item.amount)
        }
    });
    return {
        price: price,
        num: num
    };
});

const allCartNum = computed(() => {
    let num = 0;
    order.orderList.forEach((item: any) => num += Number(item.amount));
    return num;
});

const allCartTotalPrice = computed(() => {
    let num = 0;
    order.orderList.forEach((item: any) => num += Number(item.amount) * Number(item.price));
    return num;
});

const amountChange = async (value: number, detail: { name: string }) => {
    if (value === 0) {
        showConfirmDialog({
            title: '再想想',
            message: '确定移除选择的商品',
        }).then(async () => {
            const { code } = await removeProductApi({ id: detail.name })
            if (code === 0) {
                showToast('删除成功');
                getFindAllShop();
            }
        }).catch(() => {

        });
    }
    else {
        global.setTotal({ totalNum: allCartNum.value, totalPrice: allCartTotalPrice.value })
        const { code } = await updateProductAmountApi({ id: detail.name, num: value })
        if (code === 0) {
            showToast('修改成功')
        }
    }
}


const clearAll = async () => {
    let { code } = await cleareCartApi()
    if (code === 0) {
        showToast('购物车清空成功');
        order.saveOrderList([])
        order.saveOrderCheck([]);
        checked.value = [];
        isCheckAll.value = false;
    }
}

onMounted(() => {
    checkAllChange(true)
})

</script>

<template>
    <div class="cart-box">
        <div class="cart-box-top">
            <div class="left">
                <van-checkbox :indeterminate="isIndeterminate" v-model="isCheckAll" @change="checkAllChange">
                    已选购商品({{ allCartPrice.num }})
                </van-checkbox>
            </div>

            <div @click="clearAll" class="right">
                <van-icon name="delete" />
                <span>清空购物车</span>
            </div>
        </div>

        <div class="cart-box-list">
            <van-checkbox-group v-model="checked" ref="checkboxGroup" @change="checkedResultChange">
                <div class="cart-item" v-for="item in order.orderList" :key="item.id">
                    <van-checkbox :name="item.id"></van-checkbox>
                    <div class="cover">
                        <van-image :src="item.productPicUrl"></van-image>
                    </div>
                    <div class="info">
                        <div class="top">
                            <div class="name-cn">
                                {{ item.productName }}
                                <span v-show="item.showAttrNames">({{ item.showAttrNames }})</span>
                            </div>
                        </div>
                        <div class="name-us">
                            <div class="type">
                                <span>{{ item.saleAttrNames }} </span>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="price">￥{{ item.price }}</div>
                            <div class="countHandle">
                                <van-stepper v-model="item.amount" min="0" :name="item.id" theme="round"
                                    button-size="22" disable-input @change="amountChange" />
                            </div>
                        </div>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": "index",
        "authority": true
    }
}</route>

<style scoped lang="scss">
.cart-box {
    background-color: #f7f7f7;
    margin-bottom: 10vh;

    .cart-box-top {
        padding: .5rem .5rem;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
            font-size: 12px
        }

        .right {
            font-size: 12px;
            color: grey;

            span {
                margin-left: .5rem;
            }
        }

    }

    .cart-box-list {
        background-color: #f7f7f7;
        display: flex;
        flex-direction: column;
        max-height: 50vh;
        overflow-y: scroll;

        .cart-item {
            background-color: #fff;
            display: flex;
            justify-content: space-around;
            margin: 0.62rem;
            border-radius: 0.78rem;
            align-items: center;
            height: 7.18rem;

            .cover {
                margin-right: 0.62rem;

                :deep(.van-image__img) {
                    border-radius: 10px !important;
                }

                .van-image {
                    width: 4.31rem;
                    height: 4.62rem;
                }
            }

            .van-checkbox {
                width: 2.81rem;
                display: flex;
                justify-content: center;
            }

            .info {
                height: 5rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex-grow: 1;

                .top {
                    display: flex;
                    align-items: center;

                    .name-cn {
                        font-size: 0.93rem;
                        color: #333;
                    }


                }

                .name-us {
                    font-size: 0.62rem;
                    color: dimgray;

                    .type {
                        font-size: 0.65rem;
                        color: dimgray;

                        span {
                            margin-right: 5px;
                        }
                    }
                }
            }

            .bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .price {
                    color: #f05821;
                    font-size: 0.78rem;
                    font-weight: bold;
                }

                .countHandle {
                    display: flex;
                    margin-right: 0.46rem;
                    align-items: center;

                    .num {
                        margin: 0 0.62rem;
                        font-size: 0.781rem;
                    }

                    image {
                        width: 1.56rem;
                        height: 1.56rem;
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
