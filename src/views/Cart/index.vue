<script setup lang="ts" name="Cart">
import shopbagBg from "@/assets/icons/shopbag_bg.png";
import {cartListApi, removeProductApi, updateProductAmountApi} from "@/api/productApi";
import {preCreateOrderApi} from "@/api/orderApi";
import {Store} from "@/store";

const { global, order } = Store();

const router = useRouter()

const isDel = ref<Boolean>(false);

const onClickLeft = () => history.back();

const cartList = ref<any[]>([]);

const checkboxGroup = ref(null);

const checked = ref<any[]>([]);

const isCheckAll = ref(false);

const isIndeterminate = ref(true);

const getFindAllShop = async () => {
	const shop = global.shopGet
  console.log(shop)
	if (shop.storeId) {
		const { data } = await cartListApi({ storeId: shop.storeId });
		cartList.value = data
		global.setTotal({ totalNum: allCartNum.value, totalPrice: allCartTotalPrice.value })
	}

};

const checkAllChange = (val: boolean) => {
	checked.value = val ? cartList.value.map((item) => item.id) : [];
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
		if (checked.value.includes(item.id)) {
			num += Number(item.amount) * Number(item.price);
		}
	});
	return num;
});

const allCartNum = computed(() => {
	let num = 0;
	cartList.value.forEach((item) => num += Number(item.amount));
	return num;
});

const allCartTotalPrice = computed(() => {
	let num = 0;
	cartList.value.forEach((item) => num += Number(item.amount) * Number(item.price));
	return num;
});

const amountChange = async (value: number, detail: { name: string }) => {
	if (value === 0) {
		showConfirmDialog({
			title: '再想想',
			message: '确定移除选择的商品',
		}).then(async () => {
			const { code } = await removeProductApi({ id: detail.name })
			if (code === 0) {
				showToast('删除成功');
				getFindAllShop();
			}
		}).catch(() => { });
	}
	else {
		global.setTotal({ totalNum: allCartNum.value, totalPrice: allCartTotalPrice.value })
		const { code } = await updateProductAmountApi({ id: detail.name, num: value })
		if (code === 0) {
			showToast('修改成功')
		}
	}
}

const delAllCard = async () => {
	Promise.all(checked.value.map(item => removeProductApi({ id: item }))).then(res => {
		const flag = res.every(item => item.code === 0)
		if (flag) {
			showToast('删除成功');
			getFindAllShop();
		}
	})
}

const preOrderCreated = async () => {
	const shop = global.shopGet
	let list: any = []
	//过滤出选择的商品
	checked.value.forEach(item => {
		const idx = cartList.value.findIndex((itm) => itm.id === item)
		if (idx !== -1) {
			list.push(cartList.value[idx])
		}
	})
	let params = {
		productList: list,
		storeId: shop.storeId!,
		uid: 'string',
	}
  const {code, data, msg} = await preCreateOrderApi(params);
  if (code !== 200) {

  }
	console.log(data, "preCreateOrderApi")
	order.savePlaceInfo(list)
	router.push('/cart/confirm')
}

const isSubmit = () => {
	if (isDel.value) {
		if (checked.value.length === 0) return showToast('选择删除的商品');
		showConfirmDialog({
			title: '再想想',
			message: '确定移除选择的商品',
		}).then(() => {
			delAllCard()
		}).catch(() => { });
	} else {
		if (checked.value.length === 0) return showToast('选择商品');
		if (allCartPrice.value > global.limitPriceGet) return showToast('超出用卷价格');
		preOrderCreated()
	}
};

onMounted(() => {
	getFindAllShop();

});
</script>

<template>
	<div class="cart-box">
		<van-nav-bar v-if="cartList.length === 0" left-arrow left-text="返回" title="购物车xxxxxxxx" @click-left="onClickLeft" />
		<van-nav-bar v-else :right-text="isDel ? '完成' : '编辑'" left-arrow left-text="返回" title="购物车"
			@click-left="onClickLeft" @click-right="isDel = !isDel" />
		<van-image :src="shopbagBg"></van-image>
		<div class="cart-box-list" v-show="cartList.length > 0">
			<van-checkbox-group v-model="checked" ref="checkboxGroup" @change="checkedResultChange">
				<div class="cart-item" v-for="item in cartList" :key="item.id">
					<van-checkbox :name="item.id"></van-checkbox>
					<div class="cover">
						<van-image :src="item.productPicUrl"></van-image>
					</div>
					<div class="info">
						<div class="top">
							<div class="name-cn">
                {{ item.productName }}
								<span v-show="item.showAttrNames">({{ item.showAttrNames}})</span>
							</div>
						</div>
						<div class="name-us">
							<div class="type">
								<span>{{ item.saleAttrNames }} </span>
							</div>
						</div>
						<div class="bottom">
							<div class="price">￥{{ item.price }}</div>
							<div class="countHandle">
								<van-stepper v-model="item.amount" min="0" :name="item.id" theme="round"
									button-size="22" disable-input @change="amountChange" />
							</div>
						</div>
					</div>
				</div>
			</van-checkbox-group>
		</div>
		<div class="cart-box-nav" v-show="cartList.length > 0">
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
		"layout": "index",
		"authority": true
	}
}</route>

<style scoped lang="scss">
.cart-box {
	background-color: #f7f7f7;
	height: 91vh;

	.van-image {
		width: 100%;
		height: 3.43rem;
	}

	.cart-box-list {
		background-color: #f7f7f7;
		display: flex;
		flex-direction: column;
		height: calc(100vh - 13rem);
		overflow-y: scroll;

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

				:deep(.van-image__img) {
					border-radius: 10px !important;
				}

				.van-image {
					width: 4.31rem;
					height: 4.62rem;
				}
			}

			.van-checkbox {
				width: 2.81rem;
				display: flex;
				justify-content: center;
			}

			.info {
				height: 5rem;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				flex-grow: 1;

				.top {
					display: flex;
					align-items: center;

					.name-cn {
						font-size: 0.93rem;
						color: #333;
					}


				}

				.name-us {
					font-size: 0.62rem;
					color: dimgray;

					.type {
						font-size: 0.65rem;
						color: dimgray;

						span {
							margin-right: 5px;
						}
					}
				}
			}

			.bottom {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.price {
					color: #f05821;
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
