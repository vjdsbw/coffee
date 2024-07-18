<script setup lang="ts" name="CityList">
import { cityListApi, shopListApi } from '@/api/storeApi'
import { Store } from "@/store";

const router = useRouter();

const { global } = Store();

const cityList = ref<any>({})

const getCityList = async () => {
    const { code, data } = await cityListApi();
    if (code === 0) {
        cityList.value = data.reduce((acc: any, city: any) => {
            const firstLetter = city.citySpell[0].toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(city);
            return acc;
        }, {});
    }
}

const citySelected = async (city: any) => {
    global.setLatAndLon({ lat: city.latitude, lon: city.longitude });
    const { code, data } = await shopListApi({ lat: city.latitude, lon: city.longitude, keyword: '' })
    if (code === 0 && data.length > 0) {
        global.setShop(data[0])
        console.log(city,data,'citylist')
        router.push({ name: "NewIndex-shopList" })
    } else {
        showToast('当前城市不存在门店')
    }
}

onMounted(() => {
    getCityList()
})
</script>

<template>
    <div class="cityList-box">
        <div v-show="global.shop.cityName">
            <van-cell-group title="当前定位城市">
                <van-cell :title="global.shop.cityName" icon="location-o" />
            </van-cell-group>
        </div>
        <van-index-bar :sticky="false" class="city-list">
            <van-cell-group v-for="(val, k) in cityList" :key="k">
                <van-index-anchor :index="k" />
                <van-cell v-for="item in val" :key="item.name" :title="item.name" @click="citySelected(item)" />
            </van-cell-group>
        </van-index-bar>
    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false,
        "authority": false
    }
}</route>

<style scoped lang="scss">
.cityList-box {
    height: 100vh;
    background-color: #f5f5f5;
    overflow: scroll;

    .city-list {
        .van-cell-group {
            &>div:first-child {
                background-color: #f5f5f5;
            }
        }

        :deep(.van-index-bar__sidebar) {
            color: #000000;
        }
    }
}
</style>
