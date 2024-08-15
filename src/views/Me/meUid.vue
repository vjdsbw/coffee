<script setup lang="ts" name="Me-Uid">
import luckinlogo from "@/assets/luckinlogo.png";
import copy from '@/assets/icons/copy.svg'
import copySuccess from '@/assets/icons/copy-success.svg'
import { sendCodeApi, rxLoginApi } from '@/api/user';
import Clipboard from 'clipboard';
const onClickLeft = () => history.back();
const router = useRouter();
const loginForm = ref<{ phone: string; code: string }>({
  phone: "",
  code: "",
});

const showDialog = ref<boolean>(false);
const uidCode = ref<string>('');
const countDown = ref<number>(60);

const copyIcon = ref<boolean>(false)

const getCode = async () => {
  countDown.value = 59
  if (!loginForm.value.phone) return showToast('请填写手机号')
  let params = {
    mobile: loginForm.value.phone,
    type: loginForm.value.phone,
  }
  const { data } = await sendCodeApi(params)
  uidCode.value = data;
  startCountDown()
}

const startCountDown = () => {
  const inter = setInterval(() => {
    countDown.value--;
    if (countDown.value == 0) {
      clearInterval(inter);
    }
  }, 1000);
  return () => clearInterval(inter);
}
const disable = ref<boolean>(false)
const submitLogin = async () => {
  if (!loginForm.value.code) return showToast('请填写短信验证码')
  let params = {
    mobile: loginForm.value.phone,
    uid: uidCode.value,
    validateCode: loginForm.value.code
  }
  const { code, data } = await rxLoginApi(params)
  if (code === 200) {
    showDialog.value = true;
    uidCode.value = data.uid;
    copyIcon.value = false;
    disable.value = true;
  }
}


const onCopy = () => {
  const clipboard = new Clipboard('.copy', {
    text: () => uidCode.value
  })
  clipboard.on('success', () => copyIcon.value = true)
  clipboard.on('error', () => showToast('复制失败'))
}

// 复制生成的短链
const copyUid = async () => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(uidCode.value);
        } else {
            // 创建 textarea
            let textarea:any = document.createElement("textarea");
            textarea.value = uidCode.value;
            textarea.style.opacity = 0;        // 使 textarea 不在 viewport，同时设置不可见
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand('copy') ? showToast('复制链接成功') : showToast('复制链接失败');
            textarea.remove();
        }
    } catch (err) {
        showToast('复制链接失败')
    }
}

const cancelUid =()=>{
    router.push({
        name: "Me",
        state: {
            uid: uidCode.value
        }
    })
}

</script>

<template>
  <div class="me-uid-box">
    <van-nav-bar title="uid链接" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="top-img">
      <van-image :src="luckinlogo"></van-image>
    </div>
    <div class="form">
      <div class="item">
        <input placeholder-class="placeholder" type="text" placeholder="请输入手机号" v-model="loginForm.phone" />
      </div>
      <div class="item">
        <input placeholder-class="placeholder" type="text" placeholder="请输入验证码" v-model="loginForm.code" />
        <van-button type="primary" @click="getCode" :disabled="countDown !== 60 && countDown !== 0">
          <span v-show="countDown > 0">获取验证码({{ countDown }})</span>
          <span v-show="countDown === 0">重新获取验证码</span>
        </van-button>
      </div>
    </div>
    <div class="handle">
      <van-button type="primary" :disabled="disable" @click="submitLogin">确定</van-button>
    </div>

    <van-dialog v-model:show="showDialog" cancel-button-text="绑定" show-cancel-button cancel-button-color='#1989fa' confirm-button-text='复制'
     @confirm="copyUid" @cancel="cancelUid">
      <div class="dialog-content">
        <div>
          <span>uid:</span>
          <span>{{ uidCode }} </span>
        </div>
        <van-icon class="copy" :name="copyIcon ? copySuccess : copy" @click="onCopy" />
      </div>
    </van-dialog>
  </div>
</template>

<route lang="json">{
  "meta": {
    "layout": false,
    "authority": false
  }
}</route>

<style scoped lang="scss">
.me-uid-box {
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

  .handlee {
    margin-top: 25px;
    text-align: center;
  }

  .dialog-content {
    padding: 1rem 1rem;
    color: black;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &>div:nth-child(1) {

      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;

      &>span:nth-child(2) {
        font-size: 15px;
        color: grey;
      }
    }
  }
}
</style>