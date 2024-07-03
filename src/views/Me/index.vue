<script setup lang="ts" name="Me">

import {generateShortCodeApi} from "@/api/user.ts";

const myInfo = ref<any>({})
const url = ref<any>('')
const totalNum = ref<any>('')
const type = ref<any>('')
const router = useRouter()
const list = [
  {title: "我的订单信息", path: "/me/orderInfo"},
  {title: "我的咖啡信息", path: "/me/coffeeInfo"},
  {title: "咖啡卡卷", path: "/me/cardRollBinding"},
]

const getUserInfo = async () => {
  console.log(myInfo)
}

const toMyDetail = (str: string) => {
  router.push(str)
}

const getShortUrl = () => {
  generateShortCodeApi({couponId: '', uid: '', couponPrice: 0}).then(res => {
    console.log(res)
  })

}
onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div class="me-box">
    <div class="back">
      <div class="person">
        <van-image round src="../src/assets/me/userPic.png"></van-image>
        <div class="right">
          <div class="content">
            这家伙很懒，什么都没有留下！
          </div>
        </div>
      </div>
      <div class="wallet-box">
        <div class="wallet-item" @click="router.push('/me/coffeeInfo')">
          <div class="coffee-num">1杯</div>
          <div class="coffee-text ">剩余可下咖啡</div>
        </div>
        <hr class="line"/>
        <div class="wallet-item">
          <div class="coffee-num">1杯</div>
          <div class="coffee-text">累计下单成功</div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="info">
        <van-cell-group>
          <van-cell v-for="item in list" :title="item.title" icon="newspaper-o" is-link @click="toMyDetail(item.path)"/>
        </van-cell-group>
      </div>
      <div class="short-url">
        <van-cell-group inset>
          <van-field
              v-model="url"
              :autosize='{ maxHeight: 100}'
              clearable
              placeholder="请输入链接"
              rows="1"
              type="textarea"
          />

          <van-field
              v-model="totalNum"
              clearable
              placeholder="请输入条数"
              type="text"
          />
          <van-field
              v-model="type"
              clearable
              placeholder="请输入支付类型"
              type="text"
          />

          <van-field
              v-model="type"
              clearable
              placeholder="请选择优惠券"
              type="text"
          />

          <div class="edit-btn">
            <van-button color="#7585BE" round>复制编辑</van-button>
            <van-button color="#7585BE" round>清空编辑</van-button>
            <van-button color="#7585BE" round @click="getShortUrl">生成短链</van-button>
            <van-button color="#7585BE" round>查询状态</van-button>
            <van-button color="#7585BE" round>删除链接</van-button>
            <van-button color="#7585BE" round>券型删除</van-button>
          </div>


        </van-cell-group>

      </div>
    </div>
  </div>
</template>

<route lang="json">{
"meta": {
"layout": "index",
"authority":true
}
}
</route>

<style scoped lang="scss">
.me-box {
  background-color: #f5f5f5;
  height: 91vh;

  .back {
    width: 100%;
    height: 20%;
    //border: 1px solid rgba(208, 29, 29, 0.86);
    box-sizing: border-box;
    background: url("@/assets/me/headerBg.png") no-repeat top;
    background-size: 100% 70%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .person {
      display: flex;

      .van-image {
        width: 3.75rem;
        height: 3.75rem;
        border-radius: 50%;
        margin: 0.62rem;
      }

      .right {
        flex-grow: 1;
        margin-top: 0.46rem;
        align-content: center;

        .content {
          //font-size: 0.78rem;
          //margin-top: 0.62rem;
          height: .6rem;
          font-size: 1.2rem;
          color: #fff;
          font-weight: bolder;
          word-break: break-all;
          word-wrap: break-word;
          line-height: .6rem;

        }
      }
    }

    .wallet-box {
      width: calc(100% - 1rem);
      margin: 0 auto .2rem auto;
      height: 4.42rem;
      box-shadow: 0 .04rem .12rem 0 rgba(0, 0, 0, .2);
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      background: #fff;
      position: relative;

      .wallet-item {
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;

        .coffee-num, .coffee-text {
          width: 100%;
          height: 45%;
          display: flex;
          flex-wrap: wrap-reverse;
          justify-content: center;
          align-content: center;
          font-size: 1rem;
          font-weight: 500;
        }

        .coffee-num {
          color: #639ad0;
        }

        .coffee-text {
          color: #666666;
        }
      }

      .line {
        position: absolute;
        right: 50%;
        top: 20%;
        height: 30px;
        background-color: #e5e5e5;
      }
    }
  }

  .container {
    .info {
      background-color: rgba(255, 255, 255, 0.6);
      width: 95%;
      margin: 0 auto;
      //height: 22.65rem;
      height: 80%;
      transform: translateY(-2.5rem);
      border-start-start-radius: 0.78rem;
      border-start-end-radius: 0.78rem;


      .van-cell-group {
        margin-top: 3.12rem;
      }


    }

    .edit-btn {
      margin: .5rem 0;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;

      & > button {
        margin: .5rem 1rem;
        width: 25%;
      }
    }
  }
}
</style>