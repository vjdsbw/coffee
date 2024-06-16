<script setup lang="ts" name="Category">
import search from "@/assets/icons/search.png";

const nameIcon =[
  {name:'推荐',des:'1',active:'../../assets/icons/icons_09.gif',noActive:'../../assets/icons/icons_21.gif' },
  {name:'拿铁',des:'latte',active:'../../assets/icons/icons_05.gif',noActive:'../../assets/icons/icons_19.gif' },
  {name:'咖啡',des:'coffee',active:'../../assets/icons/icons_03.gif',noActive:'../../assets/icons/icons_18.gif' },
  {name:'瑞纳冰',des:'rena_ice',active:'../../assets/icons/icons_07.gif',noActive:'../../assets/icons/icons_20.gif' },
]

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
      <van-grid-item icon="photo-o" text="文字" />
      <van-grid-item icon="photo-o" text="文字" />
      <van-grid-item icon="photo-o" text="文字" />
      <van-grid-item icon="photo-o" text="文字" />
    </van-grid>

    <!-- <div class="category-header">
			<div class="category-item" v-for="(item,index) in category_icon" :key="index"
				@click="changeCategory(index)">
				<image :src="category_index === index?item[1]:item[0]"></image>
				<div :style="{color:category_index === index?'#00359f':'#3e3e3e'}">
					{{category_name[index][0]}}
				</div>
			</div>
		</div>
		<div class="category-list">
			<div class="good-item" v-for="item in goodsList" :key="item.id" @click="toDetail(item)">
				<image :src="item.largeImg"></image>
				<div class="center">
					<div class="name-cn">
						{{item.name}}
					</div>
					<div class="name-us">
						{{item.enname}}
					</div>
				</div>
				<div class="price">
					￥{{item.price}}
				</div>
			</div>
		</div> -->

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
}
</style>