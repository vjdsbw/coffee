<script setup lang="ts" name="ShortLink">
import { createdShortApi } from '@/api/user'
import copy from '@/assets/icons/copy.svg'
import copySuccess from '@/assets/icons/copy-success.svg'
import Clipboard from 'clipboard';
const onClickLeft = () => history.back();

const activeStatus = ref(1);

const pageNum = ref<number>(0);

const loading = ref(false);

const shortLinkList = ref<any[]>([]);

const activeNames = ref()

const onRefresh = async () => {
    pageNum.value = 0;
    shortLinkList.value = [];
    onLoad()
};

const finishedloading = ref(false);
const finished = ref(false);
const onLoad = async () => {
    pageNum.value++;
    finished.value = false;
    const { code, data, msg } = await createdShortApi({ pageNo: pageNum.value, pageSize: 20, status: activeStatus.value })
    if (code === 0) {
        shortLinkList.value = [...shortLinkList.value, ...data.dataList.map((item:any)=>({...item,copyed:false}))];
        finishedloading.value = false;
        loading.value = false;
        if (data.dataList.length < 20) {
            finished.value = true;
        }
    } else {
        showToast(msg);
    }
};

const onCopy = (item: any) => {
    const clipboard = new Clipboard('.copy', {
        text: () => item.url
    })
    clipboard.on('success', () => item.copyed = true)
    clipboard.on('error', () => showToast('复制失败'));
}

onMounted(() => {
    onRefresh()
})

</script>

<template>
    <div class="ShortLink-box">
        <van-nav-bar title="已生成的短链" left-text="返回" left-arrow @click-left="onClickLeft" />
        <van-tabs v-model:active="activeStatus" color="#7585be" title-active-color="#7585be" @click-tab="onRefresh">
            <van-tab name="1" title="待使用"></van-tab>
            <van-tab name="2" title="已使用"></van-tab>
        </van-tabs>
        <div class="ShortLink-box-list">
            <van-pull-refresh v-model="loading" @refresh="onRefresh">
                <van-list v-model:loading="finishedloading" offset="20" :finished="finished" finished-text="没有更多了"
                    @load="onLoad" :immediate-check="false">
                    <van-collapse v-model="activeNames" accordion>
                        <van-collapse-item v-for="(item, index) in shortLinkList" :key="item.shortCode" :name="index"
                            :title="item.coffeeStockTitle">
                            <div class="out-title">
                                <div>
                                    <div>劵价格:¥{{ item.price }}</div>
                                    <div style="text-align: right;">{{ item.statusDesc }}</div>
                                </div>
                                <div>
                                    <div>url:{{ item.url }}</div>
                                    <van-icon class="copy" :name="item.copyed ? copySuccess : copy" @click="onCopy(item)" />
                                </div>
                                <div>有效期:{{ item.validDateDesc }}</div>
                            </div>
                        </van-collapse-item>
                    </van-collapse>
                </van-list>
            </van-pull-refresh>
        </div>

    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false,
        "authority": true
    }
}</route>

<style scoped lang="scss">
.ShortLink-box {
    background-color: #f5f5f5;
    height: 100vh;
    overflow: scroll;

    .ShortLink-box-list {
        margin-top: 1rem;
        height: calc(100vh - 5.9rem);
        overflow: scroll;

        .out-title {
            color: black;

            &>div {
                display: flex;
                align-items: center;
                justify-content: space-between;

                &>div {
                    width: 90%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    -o-text-overflow: ellipsis;
                }
            }
        }
    }
}
</style>