<script setup lang="ts" name="Payment-Details">
import { Store } from "@/store";
import { orderDetailApi, orderCancelApi } from "@/api/orderApi.ts";

const { order, global } = Store();
const shop = global.shopGet
const placeInfo = order.getPlaceInfo
const onClickLeft = () => history.back()
const show = ref(false);
const lookCode = () => {
	show.value = true
}
const orderDetail = ref()

const total = computed(() => {
	let price = 0;
	let number = 0;
	placeInfo.forEach((item: any) => {
		number += Number(item.amount)
		price += Number(item.amount) * Number(item.price)
	});
	return {
		price: price,
		number: number
	};
})

const cancelOrder = async () => {
	const { code } = await orderCancelApi();
	if (code === 0) {
		showToast('订单取消成功')
	}
}

onMounted(() => {
	orderDetailApi({ code: '', orderId: String(shop?.storeId) }).then(res => {
		orderDetail.value = res.data
		console.log(res, '获取订单详情')
	})
})

</script>

<template>
	<div class="payment-box">
		<van-nav-bar left-arrow left-text="返回" title="下单成功" @click-left="onClickLeft" />
		<div class="pre-time">
			<!--			<div>预计 <span>13:38</span> 可制作完成，请前往自提点取餐。</div>-->
			<div>{{ orderDetail?.orderStatusDesc }}</div>
			<div class="pre-time-btn">
				<van-button color="#949494" plain round @click="cancelOrder">取消订单</van-button>
				<van-button plain round color="#0c0e97" @click="lookCode">取餐码</van-button>
			</div>
		</div>
		<div class="pre address">
			<div>{{ shop.name ?? orderDetail?.shopName }}({{ shop.number }})</div>
			<div>{{ shop.address ?? orderDetail?.shopAddress }}</div>
		</div>
		<div class="pre order-info">
			<p>自提订单:{{ orderDetail?.orderNo }}</p>
			<div class="driver">
				<van-card v-for="item in placeInfo" :key="item.id" :num="item.amount" :price="item.price"
					:desc="item.saleAttrNames" :title="item.productName + item.showAttrNames"
					:thumb="item.productPicUrl" />
			</div>
			<div class="driver">
				<div class="preferential reduction">
					<div>{{ orderDetail?.discountTotal }}</div>
					<div>-¥{{ orderDetail?.discount }}</div>
				</div>
				<div v-for="item in orderDetail?.disconuntDetailList" class="preferential exemption">
					<div>{{ item?.name }}</div>
					<div>-¥ {{ item?.amount }}</div>
				</div>
			</div>
			<div class="order-total">
				<div>共{{ total.number }}件商品</div>
				<div>实付 <span>¥{{ total.price }}</span></div>
			</div>
		</div>
		<div class="pre order-time">
			<div>下单时间:{{ orderDetail?.orderTime }}</div>
		</div>
		<van-dialog v-model:show="show" :show-confirm-button="false">
			<template #title>
				<div><van-icon name="close" @click="show = false" /></div>
			</template>
			<div>
				<div class="pickup-code">
					<h2>{{ orderDetail?.pickUpCode }}</h2>
					<p>取餐码</p>
				</div>
			</div>
		</van-dialog>
	</div>
</template>

<route lang="json">{
	"meta": {
		"layout": false,
		"authority": true
	}
}</route>

<style scoped lang="scss">
.payment-box {
	height: 100vh;
	overflow: scroll;
	background-color: #f7f7f7;

	.pre-time {
		margin: 1rem 1rem;
		text-align: center;

		.pre-time-btn {
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-top: 1rem;

			.van-button {
				width: 6rem;
				height: 2rem;
			}
		}
	}

	.pre {
		background-color: #fff;
		margin: 1rem 1rem;
		border-radius: .5rem;
		padding: .5rem;
	}

	.address {
		&>div:nth-child(1) {
			font-weight: 700;
		}

		&>div:nth-child(2) {
			color: grey;
			font-size: 12px;
		}
	}

	.order-info {
		&>p {
			font-size: 12px;
			margin: 0rem;
			border-left: 2px solid blue;
			padding-left: .5rem;
			color: grey;
		}

		.van-card {
			background-color: #fff;
		}

		.driver {
			border-bottom: 1px solid #bbb7b7;

			.preferential {
				margin-top: .5rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.reduction {
				font-weight: 700;
				font-size: 14px;

				&>div:nth-child(2) {
					color: #f9ad21;
				}
			}

			.exemption {
				font-size: 13px;
				color: grey;

				&>div:nth-child(2) {
					font-weight: 700;
					font-size: 14px;
				}
			}
		}

		.order-total {
			margin-top: .5rem;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&>div:nth-child(1) {
				font-size: 13px;
				color: grey;
			}

			&>div:nth-child(2) {
				font-weight: 500;
				font-size: 14px;

				span {
					font-weight: 700;
					font-size: 16px;
				}
			}
		}
	}

	.order-time {
		background-color: #fff;
		margin: 0rem 1rem;
		border-radius: .5rem;
		padding: .5rem;
		font-size: 13px;
		color: grey;
	}

	:deep(.van-dialog) {
		.van-dialog__header {
			padding: .5rem 0rem;

			.van-icon {
				float: right;
				margin-right: 1rem;
			}
		}

		.pickup-code {
			text-align: center;

			h2 {
				margin-bottom: 0rem;
			}

			p {
				margin-top: 0rem;
				color: grey;
			}
		}

		.van-image {
			.van-image__img {
				width: 90%;
				margin: 0rem auto;
			}
		}

		p {
			text-align: center;
			font-size: 12px;
			color: grey;
		}
	}
}
</style>
