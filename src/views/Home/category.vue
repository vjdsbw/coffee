<script setup lang="ts" name="Category">
import { productDetailApi } from '@/api/productApi'

const productInfo = ref<any>({})

const getProductDetail = async () => {
    const { data } = await productDetailApi({ productId: history.state.id })
    productInfo.value = data;
}

onMounted(() => {
    if (history.state.id) {
        getProductDetail()
    }
})
</script>


<template>
    <div class="Category-box">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="url in productInfo.pictureUrlList" :key="url">
                <van-image :src="url" />
            </van-swipe-item>
            <template #indicator="{ active, total }">
                <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
            </template>
        </van-swipe>
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
            opacity: .6;
            color: #fff;
            border-radius: 2rem;
            text-align: center;
            width: 2rem;
            height: 1rem;
        }
    }
}
</style>