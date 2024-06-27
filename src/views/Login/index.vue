<script setup lang="ts" name="Lohin">
import homeActive from '@/assets/icons/home_active.png';
import closeEye from '@/assets/icons/close_eye.png';
import openEye from '@/assets/icons/open_eye.png';
import { Store } from '@/store';

const { user } = Store();
const router = useRouter()

const loginForm = ref<{ phone: String, password: String, }>({ phone: "", password: "", });

const seePwd = ref<Boolean>(false)

const toBack = () => {

}

const toFindPwd = () => {

}

const submitLogin = async () => {


}


onMounted(() => {

})

</script>

<template>
	<div class="login-box">
		<div class="top">
			<div class="left">
				<van-image :src="homeActive" />
				<div>Lucking Coffee</div>
			</div>
			<div class="right" @click="toBack">先逛一逛</div>
		</div>
		<div class="welcome">欢迎回来！</div>
		<div class="e-welcome">Please login to your accounts</div>
		<div class="form">
			<div class="item">
				<div class="label">手机号</div>
				<input placeholder-class="placeholder" type="text" placeholder="11位手机号" v-model="loginForm.phone">
			</div>
			<div class="item">
				<div class="label">密码</div>
				<input placeholder-class="placeholder" :type="seePwd ? 'password' : 'text'" placeholder="密码必须有字母开头"
					v-model="loginForm.password">
				<van-image :src="seePwd ? closeEye : openEye" @click="seePwd = !seePwd"></van-image>
			</div>
			<div class="forgetPwd" @click="toFindPwd">
				忘记密码？
			</div>
		</div>
		<div class="handle">
			<van-button color="#0c34ba" type="primary" @click="submitLogin">登录</van-button>
		</div>
	</div>

</template>

<route lang="json">{
	"meta": {
		"layout": false
	}
}</route>

<style scoped lang="scss">
.login-box {
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 2.5rem;
		border-bottom: 1px solid #f8f8f8;
		padding: 0 0.7rem;

		.left {
			.van-image {
				width: 1.7rem;
				height: 1.7rem;
			}

			display: flex;
			align-items: center;

			div {
				font-size: 0.78rem;
				font-weight: bold;
				color: #565656;
				margin-left: 0.6rem;
			}
		}

		.right {
			color: #0000ff;
			font-weight: bold;
			font-size: 0.78rem;
		}
	}

	.welcome {
		font-size: 1.5rem;
		font-weight: bold;
		color: #565656;
		margin-top: 7.1rem;
		margin-left: 0.7rem;
	}

	.e-welcome {
		color: #565656;
		font-size: 0.93rem;
		margin-top: 1.56rem;
		margin-left: 0.78rem;
	}

	.form {
		margin: 2.5rem 1.0rem 5rem 1.0rem;
		position: relative;

		.item {
			display: flex;
			border-bottom: 1px solid #e8e8e8;
			height: 3.12rem;
			align-items: center;

			.label {
				width: 4.6875rem;
				color: #565656;
				font-size: 1rem;
			}

			input {
				border: none;
			}

			.van-image {
				width: 1.25rem;
				height: 1.25rem;
				position: absolute;
				right: 0.6rem;
			}

			.placeholder {
				font-size: 0.75rem;
			}
		}

		.forgetPwd {
			position: absolute;
			bottom: -1.87rem;
			right: 0;
			color: #565656;
			font-size: 0.875rem;
		}
	}

	.handle {
		display: flex;
		justify-content: space-around;
		align-items: center;

		.van-button {
			flex: 1;
			margin: 0px 10px;
		}

		.register-button {
			background-color: #fff;
			color: #000;
			border: 1px solid #e8e8e8;
		}
	}
}
</style>