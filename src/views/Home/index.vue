<script setup lang="ts" name="List">
import categoryTop from "@/assets/category/category-top.png";
import { nearestApi, productMenuApi } from '@/api/storeApi'
import AMapLoader from '@amap/amap-jsapi-loader'; // 地图map

const router = useRouter()
const activeSection = ref(0);
const contentRef = ref<HTMLElement | null>(null);
const scrollSider = ref<string>('left')

const scrollToSection = (index: number) => {
	scrollSider.value = 'left'
	document.getElementById(`sidebarSelct${index}`)?.scrollIntoView({
		behavior: "smooth",
		block: "start",
		inline: "start",
	});
};

const onScroll = () => {
	const contentElement = contentRef.value;
	if (!contentElement) return;
	const sectionElements = contentElement.querySelectorAll(".content-section");
	sectionElements.forEach((section, index) => {
		const rect = section.getBoundingClientRect();
		if (rect.top < 211 && rect.bottom > 0) {
			if (scrollSider.value === 'right') {
				activeSection.value = index
				document.getElementById(`sidebar${index}`)?.scrollIntoView({
					behavior: "smooth",
					block: "start",
					inline: "start",
				});
			}
		}
	});
};

const scrollend = () => {
	scrollSider.value = 'right';
}

const addressInfo = ref<{
	address: string;
	distance: string;
	isShopClosed: string
	name: string;
	number: string;
	storeId: number | null;
	workTime: string;
	lat: number | null;
	lon: number | null;
}>({
	address: '',
	distance: '',
	isShopClosed: '',
	name: '',
	number: '',
	storeId: null,
	workTime: '',
	lat: null,
	lon: null,
})

const menuList = ref<any>({})

const getMenus = async (id: number) => {
	const { data } = await productMenuApi({ storeId: id })
	menuList.value = data
}

const chooseShop = () => {
	router.push({
		name: "Home-chooseShop",
		state: {
			lat: addressInfo.value.lat,
			lon: addressInfo.value.lon,
		}
	})
}

const productDetail = (productId: number) => {
	router.push({
		name: "Home-category",
		state: {
			id: productId,
		}
	})
}

const success = async (pos: any) => {
	const { latitude, longitude } = pos.coords;
	const { data } = await nearestApi({ lat: latitude, lon: longitude })
	addressInfo.value = { ...data, lat: latitude, lon: longitude };
	getMenus(data.storeId)
}

const error = (err: any) => {
	console.warn(`ERROR(${err.code}): ${err.message}`);
}

onMounted(async () => {

	const contentElement = contentRef.value;
	if (contentElement) {
		contentElement.addEventListener("scroll", onScroll);
		contentElement.addEventListener("scrollend", scrollend);
	}
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error, {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		});
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
});

onUnmounted(() => {
	const contentElement = contentRef.value;
	if (contentElement) {
		contentElement.removeEventListener("scroll", onScroll);
		contentElement.addEventListener("scrollend", scrollend);
	}
});
</script>


<template>
	<div class="list-box">
		<div class="box-top">
			<van-image round :src="categoryTop"></van-image>
		</div>
		<div class="box-top-address">
			<div class="address-icon">
				<div><van-icon name="location-o" /></div>
				<div class="address-text">
					<p>{{ addressInfo.name }}</p>
					<p>据您{{ addressInfo.distance }}xxxxxxxxxxxxxx</p>
				</div>
			</div>
			<div class="address-switch" @click="chooseShop">
				<span class="actived">选择</span>
			</div>
		</div>
		<div class="box-content">
			<!-- 左侧 Sidebar -->
			<van-sidebar v-model="activeSection">
				<van-sidebar-item v-for="(item, index) in menuList" :key="item.id" :title="item.name"
					:id="'sidebar' + index" @click="scrollToSection(index)"></van-sidebar-item>
			</van-sidebar>

			<!-- 右侧 Content -->
			<div class="content" ref="contentRef">
				<div class="content-section" v-for="(item, index) in menuList" :key="item.id"
					:id="'sidebarSelct' + index">
					<div class="content-section-header">
						<strong>{{ item.name }}</strong>
						<div>{{ item.desc }}</div>
					</div>
					<van-card v-for="product in item.productList" :key="product.productId" :price="product.price"
						:desc="product.enName" :title="product.name" :thumb="product.picUrl" origin-price="10.00">
						<template #footer>
							<van-icon name="add" size="1.5rem" color="#6d86c4"
								@click="productDetail(product.productId)" />
						</template>
					</van-card>
				</div>
			</div>
		</div>
	</div>
</template>

<route lang="json">{
	"meta": {
		"layout": "index",
		"authority": false
	}
}</route>

<style scoped lang="scss">
.list-box {
	position: relative;
	background-color: #f3f3f3;

	.box-top {
		height: 9.04rem;
		padding: .2rem .2rem 0;
		background: #f3f3f3;
		position: relative;
		z-index: 0;

		&::before {
			content: "";
			display: block;
			background: #333999;
			height: 12rem;
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
		}
	}

	.box-top-address {
		background-color: #fff;
		color: black;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		height: 4rem;
		margin: .5rem;
		padding: .5rem;
		background: #fff;
		border-radius: .12rem;
		position: relative;
		z-index: 3;

		.address-icon {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.address-text {
				margin-left: 10px;

				:nth-child(1) {
					display: block;
					font-size: .9rem;
					color: #333;
					white-space: pre;
					overflow: hidden;
					text-overflow: ellipsis;
					font-weight: bolder;
				}

				:nth-child(2) {
					display: block;
					font-size: .8rem;
					color: #999;
				}

				p {
					padding: 0px;
					margin: 0px;
				}


			}
		}

		.address-switch {
			width: 6rem;
			height: 1.8rem;
			border-radius: 9.56rem;
			background: #333999;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: .1rem .1rem;

			span {
				width: 3.3rem;
				height: 1.8rem;
				text-align: center;
				line-height: 1.9rem;
				border-radius: 9.56rem;
				background: #fff;
				color: #333999;
			}
		}
	}

	.box-content {
		display: flex;

		.van-sidebar {
			width: 6rem;
			height: calc(100vh - 14rem);
			overflow: scroll;

			.van-sidebar-item--select {
				background-color: #9dc4e3;

				&::before {
					height: 90%;
				}
			}
		}

		.content {
			height: calc(100vh - 14rem);
			overflow: scroll;
			flex: 1;

			.content-section {
				margin: 0px 0px 10px 0px;
				padding: 1rem;
				background-color: #fff;
				border-radius: 1rem;

				.content-section-header {
					position: sticky;
					top: 0;
					padding: 1rem 0rem;
					z-index: 1;
					font-size: 10px;
					background-color: #fff;

					strong {
						font-size: 1rem;
					}

					div {
						color: #999;
						font-size: .7rem;
						white-space: pre-wrap;
					}
				}

				.van-card {
					background-color: #fff;
					padding: .5rem .3rem;
					border-bottom: .01rem solid #e5e5e5;
				}
			}
		}
	}

}
</style>