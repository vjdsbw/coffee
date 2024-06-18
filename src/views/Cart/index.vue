<script setup lang="ts" name="Cart">
import search from "@/assets/icons/search.png";
const onClickLeft = () => history.back();
</script>

<template>
  	<div class="cart-box">
		<van-nav-bar title="标题" left-text="返回" left-arrow @click-left="onClickLeft"/>

		<!-- <div class="backImg">
			<image src="../../static/icons/shopbag_bg.png"></image>
		</div>
		<div class="cartList">
			<checkbox-group @change="computedPrice">
				<div class="cart-item" v-for="(item,index) in cartList" :key="item.sid">
					<checkbox :value="item.sid" class="checkbox-item" :checked="checkGood.includes(item.sid)" />
					<div class="cover">
						<image :src="item.large_img"></image>
					</div>
					<div class="info">
						<div class="top">
							<div class="name-cn">
								{{item.name}}
							</div>
							<div class="type">
								{{item.rule}}
							</div>
						</div>
						<div class="name-us">
							{{item.enname}}
						</div>
						<div class="bottom">
							<div class="price">
								￥{{item.price}}
							</div>
							<div class="countHandle">
								<image src="../../static/icons/减号.png" @click="modifyCount(item,false)"></image>
								<div class="num">
									{{item.count}}
								</div>
								<image src="../../static/icons/加号2-fill.png" @click="modifyCount(item,true)"></image>
							</div>
						</div>
					</div>
				</div>
			</checkbox-group>
		</div>
		<div class="nav">
			<div class="allCheckbox">
				<checkbox-group @change='changeAll'>
					<checkbox :checked="checkGood.length === cartList.length" />
				</checkbox-group>
				<text>全选</text>
			</div>
			<div class="right">
				<div class="count" v-show="!isDel">
					<div class="count-txt">
						合计：
					</div>
					<div class="moeny-i">
						￥
					</div>
					<div class="allPrice">
						{{allCartPrice}}
					</div>
					<div class="zero">
						.00
					</div>
				</div>
				<button :style="{background:isDel?'red':'#0c34ba'}" @click="isSubmit">{{isDel?'删除选择':'提交订单'}}</button>
			</div>
		</div>
		<div class="noBody" v-show="cartList.length ===0">
			<div>
				神马都没有···
			</div>
			<button @click="toIndex">去购物</button>
		</div> -->
	</div>
</template>

<route lang="json">{
  "meta": {
    "layout": "index"
  }
}</route>

<style scoped lang="scss">
.cart-box{

}
</style>