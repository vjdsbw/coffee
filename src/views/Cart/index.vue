<script setup lang="ts" name="Cart">
import shopbagBg from "@/assets/icons/shopbag_bg.png";
import { findAllShopcartApi } from "@/api/homeAPI";
import { Store } from "@/store";

const { user } = Store();

const router = useRouter()

const isDel = ref<Boolean>(false);

const onClickLeft = () => history.back();

const cartList = ref<any[]>([]);

const checkboxGroup = ref(null);

const checked = ref<any[]>([]);

const isCheckAll = ref(false);

const isIndeterminate = ref(true);

const getFindAllShop = async () => {
	const { code, result } = await findAllShopcartApi({
		tokenString: user.token,
	});
	if (code === 5000) {
		cartList.value = result;
	}
};

const checkAllChange = (val: boolean) => {
	checked.value = val ? cartList.value.map((item) => item.sid) : [];
	isIndeterminate.value = false;
};

const checkedResultChange = (value: string[]) => {
	const checkedCount = value.length;
	isCheckAll.value = checkedCount === cartList.value.length;
	isIndeterminate.value =
		checkedCount > 0 && checkedCount < cartList.value.length;
};

const allCartPrice = computed(() => {
	let num = 0;
	cartList.value.map((item) => {
		if (checked.value.includes(item.sid)) {
			num += Number(item.count) * Number(item.price);
		}
	});
	return num;
});

const isSubmit = () => { };

onMounted(() => {
	getFindAllShop();
});
</script>

<template>
	<div class="cart-box">
		<van-nav-bar title="标题" left-text="返回" :right-text="isDel ? '完成' : '编辑'" left-arrow @click-left="onClickLeft"
			@click-right="isDel = !isDel" />
		<van-image :src="shopbagBg"></van-image>
		<div class="cart-box-list">
			<van-checkbox-group v-model="checked" ref="checkboxGroup" @change="checkedResultChange">
				<div class="cart-item" v-for="item in cartList" :key="item.sid">
					<van-checkbox :name="item.sid"></van-checkbox>
					<div class="cover">
						<van-image :src="item.large_img"></van-image>
					</div>
					<div class="info">
						<div class="top">
							<div class="name-cn">
								{{ item.name }}
							</div>
							<div class="type">
								{{ item.rule }}
							</div>
						</div>
						<div class="name-us">
							{{ item.enname }}
						</div>
						<div class="bottom">
							<div class="price">￥{{ item.price }}</div>
							<div class="countHandle">
								<van-stepper v-model="item.count" theme="round" button-size="22" disable-input />
							</div>
						</div>
					</div>
				</div>
			</van-checkbox-group>
		</div>
		<div class="cart-box-nav">
			<div class="allCheckbox">
				<van-checkbox :indeterminate="isIndeterminate" v-model="isCheckAll" @change="checkAllChange">
					全选
				</van-checkbox>
			</div>
			<div class="right">
				<div class="count" v-show="!isDel">
					<div class="count-txt">合计：</div>
					<div class="moeny-i">￥</div>
					<div class="allPrice">
						{{ allCartPrice }}
					</div>
					<div class="zero">.00</div>
				</div>
				<van-button :style="{ background: isDel ? 'red' : '#0c34ba' }" @click="isSubmit">
					{{ isDel ? "删除选择" : "提交订单" }}
				</van-button>
			</div>
		</div>
		<div class="noBody" v-show="cartList.length === 0">
			<div>
				神马都没有···
			</div>
			<van-button type="primary" @click="router.push('/home')">去购物</van-button>
		</div>
	</div>
</template>

<route lang="json">{
	"meta": {
		"layout": "index"
	}
}</route>

<style scoped lang="scss">
.cart-box {
	background-color: #f7f7f7;
	height: 100vh;

	.van-image {
		width: 100%;
		height: 3.43rem;
	}

	.cart-box-list {
		background-color: #f7f7f7;
		display: flex;
		flex-direction: column;

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

				.van-image {
					width: 5.31rem;
					height: 5.62rem;
				}
			}

			.van-checkbox {
				width: 2.81rem;
				display: flex;
				justify-content: center;
			}

			.info {
				height: 5.62rem;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				flex-grow: 1;

				.top {
					display: flex;
					align-items: center;

					.name-cn {
						font-size: 0.93rem;
					}

					.type {
						font-size: 0.65rem;
						color: dimgray;
						margin-left: 0.78rem;
					}
				}

				.name-us {
					font-size: 0.62rem;
					color: dimgray;
					margin-bottom: 1.4rem;
				}
			}

			.bottom {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.price {
					color: #0055ff;
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

	.cart-box-nav {
		display: flex;
		justify-content: space-between;
		height: 3.125rem;
		align-items: center;
		position: fixed;
		width: 100%;
		bottom: 3.125rem;
		background-color: #fff;

		.allCheckbox {
			display: flex;
			align-items: center;
			margin-left: 0.62rem;
		}

		.right {
			display: flex;
			align-items: center;
			margin-right: 0.62rem;

			.count {
				display: flex;
				align-items: flex-end;
				margin-right: 0.62rem;

				.count-txt {
					font-size: 1rem;
				}

				.moeny-i {
					font-size: 0.84rem;
					color: #0055ff;
				}

				.allPrice {
					font-size: 1.25rem;
					color: #0055ff;
					transform: translateY(0.12rem);
				}

				.zero {
					font-size: 0.62rem;
					color: #0055ff;
				}
			}

			.van-button {
				width: 6.4rem;
				font-size: 0.93rem;
				border-radius: 1.56rem;
				color: #fff;
			}
		}
	}


	.noBody {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 6.25rem;

		.van-button {
			width: 6.4rem;
			font-size: 0.93rem;
			border-radius: 1.56rem;
			color: #fff;
			background-color: #0055ff;
			margin-top: 3.12rem;
		}
	}
}
</style>
