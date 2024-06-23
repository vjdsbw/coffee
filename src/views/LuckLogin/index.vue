<script setup lang="ts" name="LuckLogin">
import luckinlogo from "@/assets/luckinlogo.png";
// import { showDialog } from 'vant';
import axios from 'axios';
const loginForm = ref<{ phone: String; password: String }>({
  phone: "",
  password: "",
});

const phoneShow = ref<boolean>(false);
const showDATA = ref<boolean>(false);
const dataCode = ref<string>('');
const count = ref<number>(60);
const getCode = () => {
  if (!loginForm.value.phone) return phoneShow.value = true;
  axios({
    url: "http://localhost:8081/coffee/api/notify/v1/send_code",
    method: 'get',
    params: {
      mobile: loginForm.value.phone,
      type: loginForm.value.phone,
    }
  }).then((res:any) => {
    console.log(res,'xxxxxxxxxxxxxx')
    if(res.data.code ==  200){
      dataCode.value = res.data.data;
      console.log(dataCode.value,"dataCode.value")
    }
  })
  contCom()
}

const contCom = ()=>{
 const inter = setInterval(()=>{
    count.value = count.value -1;
    if(count.value == 0){
      clearInterval(inter);
    }
  },1000);
  return ()=>clearInterval(inter);
}


const submitLogin = async () => {
  //   if(!loginForm.value.password) return showDialog({
  //   message: '请填写短信验证码',
  // })
  // show.value = true;
  showDATA.value = true;
}
const show = ref(false);

</script>

<template>
  <div class="lucklogin-box">
    <div class="top-img">
      <van-image :src="luckinlogo"></van-image>
    </div>
    <div class="form">
      <div class="item">
        <input placeholder-class="placeholder" type="text" placeholder="请输入手机号" v-model="loginForm.phone" />
      </div>
      <div class="item">
        <input placeholder-class="placeholder" type="text" placeholder="请输入验证码" v-model="loginForm.password" />
        <van-button type="primary" @click="getCode">获取验证码({{ count }})</van-button>
      </div>
    </div>
    <div class="handle">
      <van-button type="primary" @click="submitLogin">确定</van-button>
    </div>

    <van-dialog v-model:show="show">
      <div class="dialog-content">请填写短信验证码</div>
    </van-dialog>
    <van-dialog v-model:show="phoneShow">
      <div class="dialog-content">请填写手机号</div>
    </van-dialog>
    <van-dialog v-model:show="showDATA">
      <div v-if="dataCode.length > 0" class="dialog-content">UID:{{dataCode}}</div>
      <div v-else class="dialog-content">验证码错误</div>
    </van-dialog >
  </div>
</template>

<route lang="json">{
  "meta": {
    "layout": false,
    "authority": false
  }
}</route>

<style scoped lang="scss">
.lucklogin-box {
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;

  .top-img {
    padding: 20px;
    text-align: center;
  }

  .form {
    padding: 0 10px;
    background-color: #fff;
    border-radius: 7px;

    .item {
      display: flex;
      border-bottom: 1px solid #e8e8e8;
      height: 3.12rem;
      align-items: center;
      position: relative;

      input {
        display: block;
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        margin: 0;
        padding: 10px 16px;
        color: #323233;
        line-height: inherit;
        text-align: left;
        background-color: transparent;
        border: 0;
        resize: none;
        -webkit-user-select: auto;
        user-select: auto;
        font-size: 14px;
      }

      .van-button {
        position: absolute;
        right: 0.6rem;
        height: 25px;
        padding: 0 10px;
        border-radius: 20px;
        font-size: 12px;
        color: #1989fa;
        background-color: #fff;
        border: 1px solid #041BA5;
      }

      .placeholder {
        font: inherit;
      }
    }
  }

  .handle {
    margin-top: 25px;
    text-align: center;

    .van-button {
      background-color: #041ba5;
      color: #fff;
      height: 35px;
      width: 95%;
      border: 1px solid #041BA5;
      border-radius: 999px;
    }
  }
  .handlee{
    margin-top: 25px;
    text-align: center;
  }

  .dialog-content {
    padding: 20px 20px;
    text-align: center;
    color: black;
  }
}
</style>
