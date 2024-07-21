<script lang="ts" name="Login" setup>
import homeActive from '@/assets/icons/home_active.png';
import { Store } from '@/store';
import { loginApi } from "@/api/storeApi.ts";

const { user } = Store();
const router = useRouter()

interface loginForm {
  accountId: string,
  enPwd: string,
}

const loginForm = ref<loginForm>({ accountId: "", enPwd: "123456", });



const submitLogin = async () => {
  let { code, data, msg } = await loginApi(loginForm.value)
  if (code === 0) {
    user.setToken(data)
    router.push('/me')
  } else {
    showToast(msg)
  }
}

// let publicKey = ref('')
// // 获取公钥
// const getPublicKey = async () => {
//   const { code, data } = await getPublicKeyApi();
//   if (code === 0) {
//     publicKey.value = data;
//   }
// }

// onMounted(() => {
//   getPublicKey()
// })

</script>

<template>
  <div class="login-box">
    <div class="top">
      <div class="left">
        <van-image :src="homeActive" />
        <div>Lucking Coffee</div>
      </div>
    </div>
    <div class="form">
      <div class="welcome">欢迎回来！</div>
      <van-form @submit="submitLogin">
        <van-cell-group inset>
          <van-field v-model="loginForm.accountId" :rules="[{ required: false, message: '请填写用户名' }]" label="用户名"
            name="accountId" placeholder="用户名" />
          <van-field v-model="loginForm.enPwd" :rules="[{ required: false, message: '请填写密码' }]" label="密码" name="enPwd"
            placeholder="密码" type="password" />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button block native-type="submit" round type="primary">
            登录
          </van-button>
        </div>
      </van-form>

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


  .e-welcome {
    color: #565656;
    font-size: 0.93rem;
    margin-top: 1.56rem;
    margin-left: 0.78rem;
  }

  .form {
    margin: 2.5rem 1.0rem 5rem 1.0rem;
    position: relative;

    .welcome {
      font-size: 1.5rem;
      font-weight: bold;
      color: #565656;
      display: flex;
      align-items: center;
      justify-content: center;
    }

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