<script lang="ts" setup>

const onClickLeft = () => history.back()
const message = ref('')
const checked = ref('1')
const checked2 = ref('1')
</script>

<template>
  <div class="cart-box">
    <van-nav-bar left-arrow left-text="返回" title="备注特殊要求" @click-left="onClickLeft"/>

    <div class="cart-box-content">
      <div class="type">
        <div class="type-item">
          <span> 无接触配送：</span>
          <span>
            <van-radio-group v-model="checked" direction="horizontal">
  <van-radio name="1">需要</van-radio>
  <van-radio name="2">不需要</van-radio>
      </van-radio-group>
          </span>
        </div>
        <div class="type-item">
          <span> 纸巾：</span>
          <span>
            <van-radio-group v-model="checked2" direction="horizontal">
   <van-radio name="1">需要</van-radio>
  <van-radio name="2">不需要</van-radio>
</van-radio-group>
          </span>
        </div>
      </div>
      <van-cell-group class="text" inset>
        <van-field
            v-model="message"
            autosize
            class="textarea"
            maxlength="50"
            placeholder="请备注内容(口味备注不在此留言)"
            rows="6"
            show-word-limit
            type="textarea"
        />
      </van-cell-group>
      <van-button class="submit" type="primary" @click="onClickLeft">提交</van-button>
    </div>
  </div>

</template>
<route lang="json">{
"meta": {
"layout": "",
"authority":true
}
}
</route>
<style lang="scss" scoped>
.cart-box {
  background-color: #fff;
  height: 100vh;

  .cart-box-content {
    height: 40%;
    background: #f6f6f6;
    border-radius: .24rem;
    margin: .4rem;
    padding: .2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, .8);


    .type {
      width: 95%;
      color: #333;

      .type-item {
        display: flex;
        margin: 5px 0;
      }
    }

    .text {
      width: 95%;
      height: 60%;

      .textarea {
        height: 100%;
        background-color: #e7e7e7;

      }
    }

    .submit {
      width: 95%;
    }
  }


}
</style>