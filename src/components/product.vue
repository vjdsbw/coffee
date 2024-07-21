<script setup lang="ts" name="Product">
import { productPriceCalApi, addCartApi, cartListApi } from "@/api/productApi";
import { Store } from "@/store";

const emits = defineEmits(['closeClick'])

const { global, order } = Store();

const router = useRouter();

const priceDes = ref<{ price: string, skuCode: string, totalPriceDes: string }>({
    price: order.orderProduct.price,
    skuCode: order.orderProduct.defaultSkuCode,
    totalPriceDes: order.orderProduct.totalPriceDes
})

const productNumber = ref<number>(1)

const priceCal = ref<{
    storeId: number;
    productId: string;
    selectedAttrList: { attrCode: string, itemCode: string }[]
}>({
    storeId: global.shop.storeId!,
    productId: order.orderProduct.productId,
    selectedAttrList: []
})


const selectSub = (typeItem: any, attrItem: any) => {
    //设置选择的商品
    detailInfo.value.saleAttrGroupValue.forEach((item: any) => {
        if (item.attrCode === typeItem.attrCode) {
            item.subAttrList.forEach((itm: any) => {
                itm.isDefault = false;
                if (itm.itemCode === attrItem.itemCode) {
                    itm.isDefault = true;
                }
            })
        }
    })
    //修改priceCal值
    const idx = priceCal.value.selectedAttrList.findIndex(element => element.attrCode === typeItem.attrCode);
    if (idx !== -1) priceCal.value.selectedAttrList[idx].itemCode = attrItem.itemCode;
    getProductPrice()
}

const disable = ref<boolean>(false)
const getProductPrice = async () => {
    disable.value = true
    const { data } = await productPriceCalApi(priceCal.value)
    priceDes.value = data;
    disable.value = false
}

const addCateGory = async () => {
    const { code, data } = await addCartApi({ ...priceCal.value, price: priceDes.value.price, amount: productNumber.value })
    if (code === 0) {
        global.setTotal(data)
        showToast({
            message: '商品添加成功',
            icon: 'success',
        });
    }
    back()
}

const back = async () => {
    const res = await cartListApi({ storeId: global.shop.storeId! });
    order.saveOrderList(res.data)
    order.saveOrderCheck(res.data.map((item: any) => item.id));
    emits('closeClick')
}

const buy = async () => {
    const info = order.orderProduct;
    const obj = {
        showAttrNames: info.showAttrGroupValues.map((item: any) => item.attrValue).join('/'),
        saleAttrNames: info.saleAttrGroupValue.map((item: any) => {
            let str = ''
            item.subAttrList.forEach((itm: any) => {
                if (itm.isDefault) {
                    str = itm.itemName
                }
            })
            return str
        }).join('/'),
        productPicUrl: info.pictureUrlList[0],
        id: 1,
        productId: info.productId,
        price: info.price,
        productName: info.name,
        skuCode: priceDes.value.skuCode,
        amount: productNumber.value
    }
    order.saveOrderSettlement([obj]);
    router.push({ name: 'Order' })
}

const detailInfo = computed(() => {
    priceCal.value.storeId = global.shop.storeId!;
    priceCal.value.productId = order.orderProduct.productId;
    priceCal.value.selectedAttrList = [];
    order.orderProduct.saleAttrGroupValue.forEach((item: any) => {
        let obj = { attrCode: item.attrCode, itemCode: '' }
        item.subAttrList.forEach((itm: any) => {
            if (itm.isDefault) {
                obj.itemCode = itm.itemCode
            }
        })
        priceCal.value.selectedAttrList.push(obj)
    })
    return order.orderProduct
})



</script>

<template>
    <div class="Category-box">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="url in detailInfo.pictureUrlList" :key="url">
                <van-image :src="url" />
            </van-swipe-item>
            <template #indicator="{ active, total }">
                <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
            </template>
        </van-swipe>
        <div class="like-close">
            <div></div>
            <div @click="back"></div>
        </div>
        <div class="detail name">
            <p>{{ detailInfo.name }} </p>
            <p>{{ detailInfo.enName }} </p>
        </div>
        <div class="detail select">
            <div class="choose" v-for="item in detailInfo.showAttrGroupValues" :key="item.attrCode">
                <div class="choose-analogy">{{ item.attrName }}</div>
                <div class="choose-gener">
                    <span class="selected">{{ item.attrValue }}</span>
                </div>
            </div>
            <div class="choose" v-for="item in detailInfo.saleAttrGroupValue" :key="item.attrCode">
                <div class="choose-analogy">{{ item.attrName }}</div>
                <div class="choose-gener">
                    <span v-for="itm in item.subAttrList" :key="itm.itemCode"
                        :class="{ selected: itm.isDefault, 'tag': itm.tag }" @click="selectSub(item, itm)">
                        {{ itm.itemName }}
                    </span>
                </div>
            </div>
        </div>
        <div class="detail-desc-container">
            <div class="desc-label">商品描述</div>
            <div class="desc-container" v-html="detailInfo.htmlDesc"></div>
        </div>
        <div class="detail-desc-container price-contant">
            <div class="desc-label">价格说明</div>
            <div class="desc-explain">{{ detailInfo.priceDesc }}</div>
        </div>
        <div class="footer-container">
            <div class="price-number">
                <div>￥{{ priceDes.price }}</div>
                <div> <van-stepper v-model="productNumber" theme="round" button-size="22" disable-input /> </div>
            </div>
            <div class="total-des">{{ priceDes.totalPriceDes }}</div>
            <div class="footer-btn">
                <van-button :disabled="disable" round plain type="success" color="#6d86c4"
                    @click="buy">立即购买</van-button>
                <van-button :disabled="disable" round type="success" color="#6d86c4"
                    @click="addCateGory">加入购物车</van-button>
            </div>
        </div>
    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false,
        "authority": false
    }
}</route>

<style scoped lang="scss">
.Category-box {
    height: 100vh;
    overflow: scroll;
    background-color: #f3f3f3;

    .van-swipe {
        .van-swipe-item {
            .van-image {
                height: 14rem;
                width: 100%;
            }
        }

        .custom-indicator {
            position: absolute;
            right: 10px;
            bottom: 17px;
            padding: 2px 5px;
            font-size: 12px;
            background-color: #000;
            opacity: 0.6;
            color: #fff;
            border-radius: 2rem;
            text-align: center;
            width: 2rem;
            height: 1rem;
        }
    }

    .like-close {
        position: fixed;
        display: flex;
        top: 0.5rem;
        width: 100%;
        justify-content: space-between;

        div {
            position: inherit;
            width: 2.5rem;
            height: 2.5rem;
        }

        &>div:nth-child(1) {
            left: 0.3rem;
            background: url(data:image/png;base64,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) no-repeat 50% / contain;
        }

        &>div:nth-child(2) {
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA8CAYAAAA+CQlPAAAAAXNSR0IArs4c6QAABZdJREFUaAXlm09oHFUcx7OuxlhcFw1x4xbtrl1Lm1ghBKWoRUhIkcZqRRLJpZdcQgQPevEsnkW8eAgKXgISPKzBg6auCNZKjSSHuFFTk5LampVEbFPatFrx+x3zhsnrm9k3O29md9YffDOz89783u8zf37vvZlJoiV860QTBegBKAN1QHdBbVArdAPagq5B61AFWoPOQhehUCwRgtfb4PMA9MT2Mh2gjU3suwidgcrQTciImQRPIaJ+6EkoCKwbGA/CaegkdMmtku52E+AEPgo9DfHSDdv+RgOnoE+hmg9AEHBe0oeh49AuKGpjXvgE+hL6x2/jtYLzLI9BTFr1thUE8B7k6+wna4j6QezzGrS7hn3D2OVeOGUiZS/wp24DfsF74fgV6G7dBiKqx67xEPQH9KtOm37An4fDEcjPPjoxmKrDnNMD3QmxC/Q0XYgj8PKCp6fGKdyLUJi7fvYKSQf8MTg4se3My1cjle1DML9tSxlXNXAmsFeh25V7N/bGgwjvB0iZ7b3AmcBeh9h1xdHIxqv1O+i6DOAFzn56j7xDzH4z2+egb+S4mQlVxm6rW1UQw22PIGbOH3aYCpxH6eUdteL/4yUg7BhWq8CfQaUwZlf1PHzMV/3OAGRwzq4GnBWaaL0PLLyaLZPBOeyLaxbfRnJd8FLn1NkyGfyWJCAqNsnS5nOCZwCXNwGYy+XalpaWji8vL7/Y09NT04Smq6tr18LCwnOzs7PPtre3mxpAcUDG2WWLE5wDfCM2Ojq6p1Ao3J/P5ztmZmaO+YUndKlUOtbd3Z3t7e19aGxsLGcksP+cWJxO8P2mnE9MTJyrVCrWUBFnK+UHXkBnMhmrZ1lfX9+cnJzUmmpqxm9xCnBeSgXNHatWW11dvd7X1zftF14FPTAwML2yssLHTKYsB0dtApzPvO8w5Zl+yuXyVT/wbtDz8/NXTMYFXxym7xbgnYadW+504SOEFpidoYKzlWrwdYBmWDb4PfwVlrnBDw0NZZi9nYmM93QIl7eMlhaPl0dRwieVoZp8dp2NMXtHBM1m58Wlbo9hncGYXpfPvPAfMTSbtbO6iKEuy0Qi0UJFaeKMm+wnXeN3u9T9DnJcG9Av2IoMXIbe2NjYHB4eLvod5Oizeda0wS97VgtYqIJmIpuamqr4GeQEDMO5+2VxxtecW02uu0HPzc1ZIzI54UV02a+FCl4NWhzgOsDb4Hzr8JcIxMRSF1q0FSE8Pye5IM44vzLga1Yjls1mW50jMiYy3tPi8nZrxA0ec3t+LGTKzsGRndzo9Ef+MWHI1lkxDNWFFu2q4MfHx/eKcgNLi9M5auCjpzcNOG5JpVJJPHzoT6fTbSMjI6Vaxt68VYrF4pFkMpkYHBz8bHFx8aqJ2ODjLei8E5x+34DyXGlSuwAu6+SKe1xw3vKOSRQ0ydLmk8G/BeBmk0DKGLxVvhYbZfAbKJgRhU22LIHHnpPI4GT9ClK+TGdhTI2jxC+csavAeVQ+clZqgvWPwbCjV1CBk/N7iJ9RNIMtAcJOagLIDZzlH0AbomJMl/zgb0IVO58xuxkTHUc5hyC+cIibMf53oN9VgXuBsz67Nnb6j0PyYAebGtreR3Q8cUqrBs6dKhCPXhd/xMSmESd7J1fTAefOv0DMB/v4o8Htc8RXrBajLjj9/ARx3n4Q8rMfqkdinFp/CGkNwPwCEHwBehQyOUeGu0DGAde7EGPTMr/gdMoHk/xa8GHoPqjexg/134Z8PTcMkql5zx+G/lf/mgFe21JYOwrxi6JWe2t4K7yXT0F1+2ccGY0HoB96Cgrj7SvHFKehk1DgSVSQSx3tK423wAGIb1+5DPKVJGH53wZnoDJ0EzJiYYDLgXViA7+v4ecmfK7XAbFH4Bta3hocHG1B1yDODZikqLPQRSgU+xdLUAVnLWLNgwAAAABJRU5ErkJggg==) no-repeat 50% / contain;
            right: 0.3rem;
        }
    }

    .detail {
        margin: 0.5rem 0.5rem;
        padding: 1rem 0 1rem 0.5rem;
        background: #fff;
        border-radius: 0.8rem;
    }

    .name {
        &>p:nth-child(1) {
            font-family: PingFangSC-Medium;
            font-size: 1.5rem;
            color: #333;
            margin: 0px
        }

        &>p:nth-child(2) {
            font-family: PingFangSC-Regular;
            font-size: 1rem;
            color: #666;
            padding-top: 0.16rem;
            margin: 0px
        }
    }

    .select {
        .choose {
            display: flex;
            font-size: 1rem;
            justify-content: start;

            .choose-analogy {
                width: 1.1rem;
                display: inline-block;
                font-family: PingFangSC-Regular;
                color: #666;
                flex: 1;
            }

            .choose-gener {
                flex: 4;

                span {
                    display: inline-block;
                    background: #f5f5f5;
                    border: .01rem solid #f5f5f5;
                    border-radius: .24rem;
                    font-family: PingFangSC-Regular;
                    font-size: .8rem;
                    color: #666;
                    text-align: center;
                    min-width: 2.8rem;
                    height: 1.375rem;
                    line-height: 1.375rem;
                    margin-left: .5rem;
                    margin-bottom: 0.625rem;
                    padding: 0 1.25rem;
                    position: relative;
                }

                .selected {
                    color: #6d86c4;
                    border-color: #6d86c4;
                    background: #f7f9ff;
                }

                .tag {
                    &::after {
                        position: absolute;
                        top: -0.6rem;
                        right: -2px;
                        content: "推荐";
                        box-sizing: border-box;
                        padding: 0 0.06rem;
                        font-size: 0.7rem;
                        text-align: center;
                        background: #fff;
                        color: #f05821;
                        border: 0.01rem solid #f05821;
                        height: 0.68rem;
                        line-height: 0.68rem;
                        border-radius: 0.06rem;
                    }
                }
            }
        }
    }

    .detail-desc-container {
        margin: 0.625rem;
        background-color: #fff;
        border-radius: 0.8rem;
        padding: 0.625rem;

        .desc-label {
            margin-bottom: 0.625rem;
            font-family: PingFangSC-Regular;
            font-size: .9rem;
            color: #333;
        }

        .desc-container {
            :deep(img) {
                width: 100%;
                vertical-align: top;
            }
        }

        .desc-explain {
            font-size: .7rem;
            color: #999;
        }
    }

    .price-contant {
        margin-bottom: 12.5rem;
    }

    .footer-container {
        position: fixed;
        width: 100%;
        height: 13rem;
        bottom: 0rem;
        border-radius: .9rem;
        background-color: #fff;

        .price-number {
            padding: 1rem 1.5rem 0rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            &>div:nth-child(1) {
                font-family: PingFangSC-Medium;
                font-size: 1.5rem;
                color: #333;
            }
        }

        .total-des {
            padding: 0rem 1.5rem;
            font-family: PingFangSC-Regular;
            font-size: .9rem;
            color: #65666b;
        }

        .footer-btn {
            display: flex;
            padding: 1rem 1.5rem 0rem 1.5rem;
            justify-content: space-between;
            align-items: center;

            .van-button {
                width: 10rem;
            }
        }
    }
}
</style>