<script setup lang="ts" name="List">

const refreshLoading = ref(false);
const onRefresh = () => {
    setTimeout(() => {
        refreshLoading.value = false;
    }, 1000);
};

const list = ref<number[]>([]);
const loading = ref(false);
const finished = ref(false);

const onLoad = () => {
    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    setTimeout(() => {
        for (let i = 0; i < 10; i++) {
            list.value.push(list.value.length + 1);
        }

        // 加载状态结束
        loading.value = false;

        // 数据全部加载完成
        if (list.value.length >= 40) {
            finished.value = true;
        }
    }, 1000);
};

</script>


<template>
    <div class="list-box">
        <van-pull-refresh v-model="refreshLoading" success-text="刷新成功" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <van-cell v-for="item in list" :key="item" :title="item" />
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<style scoped lang="scss">
.list-box {
    margin: 10px 0px;
}
</style>