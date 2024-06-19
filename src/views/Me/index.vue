<script setup lang="ts" name="Me">
import right from "@/assets/icons/right.png";
import { findMyApi } from '@/api/login';
import { Store } from "@/store";

const { user } = Store();
const myInfo = ref<any>({})

const list = [
  { title: "个人资料", path: "/info" },
  { title: "我的订单", path: "/order" },
  { title: "我的收藏", path: "/collect" },
  { title: "地址管理", path: "/address" },
  { title: "安全中心", path: "/safe" }
]

const getUserInfo = async () => {
  const { result } = await findMyApi({
    tokenString: user.token,
  });
  myInfo.value = result[0]
}

const toMyDetail = (str: string) => {
  console.log(str)
}

onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div class="me-box">
    <div class="back">
      <van-image :src="myInfo.userBg"></van-image>
    </div>
    <div class="container">
      <div class="info">
        <div class="person">
          <van-image :src="myInfo.userImg"></van-image>
          <div class="right">
            <div class="name-cn">
              {{ myInfo.nickName }}
            </div>
            <div class="content">
              {{ myInfo.desc ? myInfo.desc : '这家伙很懒，什么都没有留下！' }}
            </div>
          </div>
        </div>
        <van-cell-group>
          <van-cell v-for="item in list" :title="item.title" @click="toMyDetail(item.path)" is-link />
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
}</route>

<style scoped lang="scss">
.me-box {
  background-color: #f7f7f7;
  height: 100vh;

  .back {
    width: 100%;
    height: 13.43rem;

    .van-image {
      width: 100%;
      height: 100%;
    }
  }

  .container {
    .info {
      background-color: rgba(255, 255, 255, 0.6);
      width: 95%;
      margin: 0 auto;
      height: 22.65rem;
      transform: translateY(-2.5rem);
      border-start-start-radius: 0.78rem;
      border-start-end-radius: 0.78rem;

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

          .name-cn {
            color: #0055ff;
            font-weight: bold;
            font-size: 0.93rem;
          }

          .content {
            color: dimgray;
            font-size: 0.78rem;
            margin-top: 0.62rem;
          }
        }
      }

      .van-cell-group{
        margin-top: 3.12rem;
      }


    }
  }
}
</style>