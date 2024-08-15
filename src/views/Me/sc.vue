<script setup lang="ts" name="Me-Sc">
import { couponNoPageListApi } from '@/api/user';
const onClickLeft = () => history.back();
const searchUid = ref<string>('');

const scList = ref<any[]>([]);

const finishedloading = ref<boolean>(false);

const finished = ref<boolean>(false);

const refreshing = ref<boolean>(false);

const pageNum = ref<number>(0)

const onRefresh = () => {
    pageNum.value = 0;
    scList.value = [];
    onLoad()
};

const onLoad = async () => {
    pageNum.value++;
    finished.value = false;
    const { code, data, msg } = await couponNoPageListApi({ pageNo: pageNum.value, pageSize: 50, uid: searchUid.value })
    if (code === 0) {
        scList.value = [...scList.value, ...data];
        finishedloading.value = false;
        refreshing.value = false;
        if (data.length < 50) {
            finished.value = true;
        }
    } else {
        showToast(msg)
    }
};
</script>

<template>
    <div class="me-sc-box">
        <van-nav-bar title="SC列表" left-text="返回" left-arrow @click-left="onClickLeft" />
        <van-search v-model="searchUid" show-action placeholder="请输入搜索关键词" @search="onRefresh">
            <template #action>
                <div @click="onRefresh">搜索</div>
            </template>
        </van-search>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="finishedloading" :finished="finished" finished-text="没有更多了" @load="onLoad"
                :immediate-check="false">
                <van-cell-group>
                    <van-cell v-for="(sc, index) in scList" :key="index">
                        <template #title>
                            <van-tag type="primary" style="margin-right: 10px;">{{ index + 1 }}</van-tag>
                            <span>{{ sc }}</span>
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-list>
        </van-pull-refresh>

    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false,
        "authority": true
    }
}</route>

<style scoped lang="scss">
.me-sc-box {
    background-color: #f5f5f5;
    height: 100vh;
    overflow-y: scroll;

    .van-search {
        margin-top: 10px
    }
}
</style>