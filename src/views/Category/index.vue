<script setup lang="ts" name="Category">
import search from "@/assets/icons/search.png";
import icon09 from '@/assets/icons/icons_09.gif';
import icon21 from '@/assets/icons/icons_21.gif'
import icon05 from '@/assets/icons/icons_05.gif'
import icon19 from '@/assets/icons/icons_19.gif'
import icon03 from '@/assets/icons/icons_03.gif'
import icon18 from '@/assets/icons/icons_18.gif'
import icon07 from '@/assets/icons/icons_07.gif'
import icon20 from '@/assets/icons/icons_20.gif'
import { productsApi } from "@/api/homeAPI"

const nameIcon = [
  { name: '推荐', des: '1', noActive: icon09, active: icon21, type: 'isHot' },
  { name: '拿铁', des: 'latte', noActive: icon05, active: icon19, type: 'type' },
  { name: '咖啡', des: 'coffee', noActive: icon03, active: icon18, type: 'type' },
  { name: '瑞纳冰', des: 'rena_ice', noActive: icon07, active: icon20, type: 'type' },
]

const selectIndex = ref<number>(0)
const productsList = ref<any[]>([])

const getProducts = async (num: number) => {
  selectIndex.value = num;
  let params = {
    key: nameIcon[num].type,
    value: nameIcon[num].des
  }
  const { code, result } = await productsApi(params);
  if (code === 500) {
    productsList.value = result;
  }
}


onMounted(() => {
  getProducts(selectIndex.value)
})

</script>

<template>
  <div class="category-box">
    <div class="top">
      <div class="search">
        <van-image :src="search"></van-image>
        <input type="text" placeholder="请输入商品名称">
      </div>
    </div>
    <van-grid>
      <van-grid-item v-for="(item, index) in nameIcon" :key="item.name" @click="getProducts(index)">
        <van-image :src="index === selectIndex ? item.active : item.noActive"></van-image>
        <div :style="{ color: index === selectIndex ? '#00359f' : '#3e3e3e' }">{{ item.name }}</div>
      </van-grid-item>
    </van-grid>

    <div class="category-list">
      <div class="good-item" v-for="item in productsList" :key="item.id">
        <van-image :src="item.largeImg"></van-image>
        <div class="center">
          <div class="name-cn">
            {{ item.name }}
          </div>
          <div class="name-us">
            {{ item.enname }}
          </div>
        </div>
        <div class="price">
          ￥{{ item.price }}
        </div>
      </div>
    </div>

  </div>
</template>

<route lang="json">{
  "meta": {
    "layout": "index"
  }
}</route>

<style scoped lang="scss">
.category-box {
  background-color: #f7f7f7;

  .top {
    background-color: #fff;
    height: 3.28125rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .search {
      width: 93%;
      height: 2.1875rem;
      background-color: #f7f8fa;
      border-radius: 40px;
      display: flex;
      align-items: center;

      .van-image {
        width: 0.9375rem;
        height: 0.9375rem;
        margin: 0 0.46875rem 0 0.78125rem;


      }

      input {
        height: 1.25rem;
        border: none;
        position: relative;
        display: block;
        height: 100%;
        background: none;
        color: inherit;
        opacity: 1;
        font: inherit;
        line-height: inherit;
        letter-spacing: inherit;
        text-align: inherit;
        text-indent: inherit;
        text-transform: inherit;
        text-shadow: inherit;
      }
    }
  }

  .van-grid {
    .van-grid-item {
      font-size: 0.78rem;
      font-weight: bold;

      .van-image {
        width: 2rem;
        height: 2rem
      }
    }
  }

  .category-list {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .good-item {
      width: 95%;
      height: 5.3rem;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      border-radius: 0.6rem;
      margin-top: 0.6rem;

      .van-image {
        width: 4rem;
        height: 4rem;
        margin: 0 0.62rem;
      }

      .center {
        flex-grow: 1;

        .name-cn {
          font-size: 0.93rem;
          color: #3e3e3e;
        }

        .name-us {
          font-size: 0.71rem;
          color: dimgray;
        }
      }
    }

    .price {
      margin-right: 0.62rem;
      color: #004eec;
      font-weight: bold;
      font-size: 0.78rem;
    }
  }
}
</style>