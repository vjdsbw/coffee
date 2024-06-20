<script setup lang="ts" name="Home">
import search from "@/assets/icons/search.png"
import { bannerApi, productsApi } from "@/api/homeAPI"
// import axios from 'axios';

const toSearch = () => {
	console.log('search')
}

const bannerList = ref<any[]>([])
const productsList = ref<any[]>([])

const getgetBanner = async () => {
	const { code, result } = await bannerApi();
	if (code === 300) {
		bannerList.value = result;
	}
}

const getProducts = async () => {
	let params = {
		key: "isHot",
		value: 1
	}
	const { code, result } = await productsApi(params);
	if (code === 500) {
		productsList.value = result;
		console.log(productsList.value, 'productsList')
	}
}


onMounted(() => {
	getgetBanner()
	getProducts()
	// axios({
	// 	url: 'https://restapi.amap.com/v3/ip',
	// 	method: 'get',
	// 	params: {
	// 		output: "json",
	// 		key: '30fc01fb08aee9ede2fc1c338428ff22'
	// 	}
	// })  

	// if (navigator.geolocation) {
	// 	navigator.geolocation.getCurrentPosition(function (position) {
	// 		var latitude = position.coords.latitude;
	// 		var longitude = position.coords.longitude;
	// 		axios({
	// 			url: 'https://restapi.amap.com/v3/geocode/regeo',
	// 			method: 'get',
	// 			params: {
	// 				output: "json",
	// 				key: '30fc01fb08aee9ede2fc1c338428ff22',
	// 				location: longitude+','+latitude,
	// 				radius:1000,
	// 				extensions: 'all',
	// 				poitype:'咖啡'
	// 			}
	// 		})
	// 		// console.log("Latitude: " + latitude + " Longitude: " + longitude);
	// 	});
	// } else {
	// 	console.log("Geolocation is not supported by this browser.");
	// }
})

</script>

<template>
	<div class="home-box">
		<div class="header">
			<div class="left">
				<div>下午好</div>
				<div class="name">LUCKIN</div>
			</div>
			<div class="right" @click="toSearch">
				<van-image :src="search" />
				<input type="text" placeholder="请输入商品名称">
			</div>
		</div>
		<van-swipe :autoplay="3000" indicator-color="blue" touchable>
			<van-swipe-item v-for="item in bannerList" :key="item.pid">
				<van-image width="100%" height="100%" :src="item.bannerImg" />
			</van-swipe-item>
		</van-swipe>
		<div class="hotTitle">
			<div>
				热卖推荐
			</div>
		</div>
		<van-grid :column-num="2">
			<van-grid-item v-for="item in productsList" :key="item.id">
				<van-card :price="item.price" :title="item.name" tag="hot" :thumb="item.largeImg">
				</van-card>
			</van-grid-item>
		</van-grid>
	</div>
</template>

<route lang="json">{
	"meta": {
		"layout": "index"
	}
}</route>

<style scoped lang="scss">
.home-box {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f7f8fa;
	overflow: auto;

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 3rem;
		padding: 0 1rem;
		margin-bottom: 0.6rem;
		background: #fff;

		.left {
			display: flex;
			font-weight: bold;
			font-size: 0.9rem;
			align-items: center;

			.name {
				margin-left: 0.5rem;
				color: blue;
				font-size: 0.8rem;
			}
		}

		.right {
			width: 12.5rem;
			height: 1.8rem;
			background-color: #f7f8fa;
			border-radius: 40px;
			display: flex;
			align-items: center;

			:deep(.van-image) {
				margin: 0 0.4rem 0 0.7rem;

				.van-image__img {
					width: 0.9rem;
					height: 0.9rem;

				}
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

	:deep(.van-swipe) {
		width: 97.5%;
		height: 16.7rem;
		margin: 0 auto;

		.van-swipe-item {
			.van-image {
				img {
					border-radius: 3%;
				}
			}
		}

		.van-swipe__indicators {
			.van-swipe__indicator {
				width: 8px;
				height: 8px;
				cursor: pointer;
			}
		}



	}

	.hotTitle {
		height: 3.5rem;
		background-color: #fff;
		margin: 0.5rem 0.4rem;
		border-radius: 0.3rem;
		display: flex;
		align-items: center;

		div {
			width: 5.3rem;
			height: 2.1rem;
			background-color: #0c34ba;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			border-top-right-radius: 0.9rem;
			font-size: 0.9rem;
		}
	}
}
</style>