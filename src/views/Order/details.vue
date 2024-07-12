<script setup lang="ts" name="Payment-Details">
import { orderDetailApi, orderCancelApi } from "@/api/orderApi.ts";
// import QrcodeVue from 'qrcode.vue';

const onClickLeft = () => history.back()

const show = ref(false);

const lookCode = () => show.value = true

const orderDetail = ref<any>({})

const cancelOrder = async () => {
	const { code } = await orderCancelApi();
	if (code === 0) {
		showToast('订单取消成功')
	}
}

const getOrderDetail = async () => {
	const { code, data } = await orderDetailApi();
	if (code === 0) {
		orderDetail.value = data;
		console.log(data, '获取订单详情')
	}
}

onMounted(() => {
	getOrderDetail();
})

</script>

<template>
	<div class="payment-box">
		<van-nav-bar left-arrow left-text="返回" title="订单详情" @click-left="onClickLeft" />
		<div class="pre-time" v-show="orderDetail?.orderStatusCode !== 100">
			<div>{{ orderDetail?.orderStatusDesc }}</div>
			<div class="pre-time-btn">
				<van-button color="#949494" plain round @click="cancelOrder">取消订单</van-button>
				<van-button v-show="orderDetail?.orderStatusCode !== 10" plain round color="#0c0e97"
					@click="lookCode">取餐码</van-button>
			</div>
		</div>
		<div class="pre address">
			<div>{{ orderDetail?.shopName }}</div>
			<div>{{ orderDetail?.shopAddress }}</div>
		</div>
		<div class="pre address">
			<div>订单状态：{{ orderDetail?.orderStatusName }}</div>
		</div>
		<div class="pre order-info">
			<p>自提订单:{{ orderDetail?.orderNo }}</p>
			<div class="driver">
				<van-card v-for="item in orderDetail?.productList" :key="item.productId" :num="item.amount"
					:price="item.initialPrice" :desc="item.saleAttrNames" :title="item.name + item.additionDesc"
					:thumb="item.bigPicUrl" />
			</div>
			<div class="driver">
				<div class="preferential reduction">
					<div>{{ orderDetail?.discountTotal }}</div>
					<div>-¥{{ orderDetail?.discount }}</div>
				</div>
				<div v-for="item in orderDetail?.disconuntDetailList" class="preferential exemption">
					<div>{{ item.name }}</div>
					<div>-¥ {{ item.amount }}</div>
				</div>
			</div>
			<div class="driver">
				<div>备注：{{ orderDetail?.remark }}</div>
			</div>
			<div class="order-total">
				<div>共{{ orderDetail?.productAmount }}件商品</div>
				<div>实付 <span>¥{{ orderDetail?.orderPayAmount }}</span></div>
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
					<!-- <qrcode-vue v-show="orderDetail?.pickUpCode" :value="'568'" :size="200" level="H"></qrcode-vue> -->
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
				color: black;
			}

			p {
				margin-top: 0rem;
				color: grey;
			}
		}
	}
}
</style>
