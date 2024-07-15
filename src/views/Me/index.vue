<script setup lang="ts" name="Me">
import Avatar from '@/assets/me/default_avatar.png';
import copy from '@/assets/icons/copy.svg'
import copySuccess from '@/assets/icons/copy-success.svg'
import { batchGenerateApi, bindUidApi, getCouponPageListApi } from "@/api/user.ts";
import Clipboard from 'clipboard';

const httpUrl = ref<any>([])

const couponList = ref<{ text: string, value: string, uid: string, couponPrice: number, validDate: string }[]>([]) //卡券列表

const inputList = ref<string[]>(['']);

const checked = ref([]);
const checkboxRefs = ref<any>([]);
const toggle = (item: any, index: any) => {
    console.log(checked.value, index)
    checkboxRefs.value?.[index]?.toggle();
};

onBeforeUpdate(() => {
    checkboxRefs.value = [];
});

// 生成短链
const getShortUrl = async () => {
    if (couponList.value.length !== 0) {
        let list: any = checked.value?.map((v: any) => {
            return {
                couponId: v.value as string,
                uid: v.uid as string,
                couponPrice: v.couponPrice as number
            }
        })
        const { code, data, msg } = await batchGenerateApi({ couponList: list });
        if (code === 0) {
            httpUrl.value = data.map((item: string) => ({ copyed: false, shortUrl: item }))
            showToast('短链生成成功，点击复制链接')
        } else {
            showToast(msg)
        }
    } else {
        showToast('请输入uid或者选择咖啡券')
    }
}

// 复制生成的短链
const copyUrl = async () => {
    console.log(httpUrl.value, '短链')
    try {
        if (httpUrl.value) {
            const list = httpUrl.value.map((item: any) => item.shortUrl)
            await navigator.clipboard.writeText(list);
        } else {
            showToast('暂无链接，请先生成短链')
        }
    } catch (err) {
        showToast('复制链接失败')
        console.error('Failed to copy text: ', err);
    }
}

// 根据输入的uid绑定咖啡券
const bindUid = async () => {
    const list = inputList.value.filter(item => item !== '');
    if (list.length > 0) {
        const { msg } = await bindUidApi({ uidList: list })
        showToast(msg)
    } else {
        showToast('请输入uid')
    }
}



// 分页获取咖啡券
const getCouponBy = async () => {
    showPop.value = true
    onRefresh()
}

const addInput = () => {
    inputList.value.push('')
}

const delUid = () => {
    if (inputList.value.length > 1) {
        inputList.value.pop()
    }
}

const pageNum = ref<number>(1);
const showPop = ref<boolean>(false);
const loading = ref(false);
const onRefresh = async () => {
    pageNum.value = 0;
    couponList.value = [];
    onLoad()
};

const finishedloading = ref(false);
const finished = ref(false);
const onLoad = async () => {
    pageNum.value++;
    finished.value = false;
    const { code, data, msg } = await getCouponPageListApi({ pageNo: pageNum.value, pageSize: 20 })
    if (code === 0) {
        const list = data.dataList.map((v: any) => ({ text: v?.coffeeStockTitle, value: v?.couponId, uid: v?.uid, couponPrice: v.discountDegree, validDate: v.validDateDesc }));
        couponList.value = [...couponList.value, ...list];
        // 加载状态结束
        finishedloading.value = false;
        loading.value = false
        if (couponList.value.length >= data.totalCount) {
            finished.value = true;
        }
    } else {
        showToast(msg);
    }
};


const onCopy = (httpItem: any) => {
    const clipboard = new Clipboard('.copy', {
        text: () => httpItem.shortUrl
    })
    clipboard.on('success', () => httpItem.copyed = true)
    clipboard.on('error', () => showToast('复制失败'));
}
</script>

<template>
    <div class="me-box">
        <div class="back">
            <div class="person">
                <van-image :src="Avatar" round></van-image>
                <div class="right">
                    <div class="content">你好，管理员</div>
                </div>
            </div>
            <div class="wallet-box">
                <div class="wallet-item">
                    <div class="coffee-num">1杯</div>
                    <div class="coffee-text ">剩余可下咖啡</div>
                </div>
                <hr class="line" />
                <div class="wallet-item">
                    <div class="coffee-num">1杯</div>
                    <div class="coffee-text">累计下单成功</div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="short-url">
                <van-cell-group inset>
                    <div class="edit-btn">
                        <van-button class="addBtn" color="#7585BE" round size="small"
                            @click="addInput">添加uid</van-button>
                        <van-button :disabled="!(inputList.length > 1)" class="addBtn" color="#7585BE" round
                            size="small" @click="delUid">删除uid</van-button>
                        <van-button class="addBtn" color="#7585BE" round size="small"
                            @click="getCouponBy">选择卡卷</van-button>
                    </div>

                    <!--动态添加uid输入框-->
                    <van-field v-for="(_item, index) in inputList" :key="index" v-model="inputList[index]" clearable
                        placeholder="请输入链接/uid" />

                    <div class="edit-btn">
                        <van-button color="#7585BE" round size="small" @click="bindUid">绑定咖啡券</van-button>
                        <van-button color="#7585BE" round size="small" @click="getShortUrl">批量生成短链</van-button>
                        <van-button color="#7585BE" round size="small" @click="copyUrl">复制链接</van-button>
                    </div>

                </van-cell-group>
                <div class="short-url-copy">
                    <div v-for="(item, index) in httpUrl" :key="index">
                        <span>{{ item.shortUrl }}</span>
                        <van-icon class="copy" :name="item.copyed ? copySuccess : copy" @click="onCopy(item)" />
                    </div>
                </div>
            </div>
        </div>

        <van-popup v-model:show="showPop" closeable position="bottom" :style="{ height: '50%' }">
            <van-pull-refresh v-model="loading" @refresh="onRefresh">
                <van-list v-model:loading="finishedloading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <van-checkbox-group v-model="checked" style="margin-top: 20px;">
                        <van-cell-group inset>
                            <van-cell v-for="(item, index) in couponList" :key="index" :title="item.text" clickable
                                @click="toggle(item, index)">
                                <template #right-icon>
                                    <van-checkbox :ref="(el: any) => checkboxRefs[index] = el" :name="item"
                                        @click.stop />
                                </template>
                                <template #label>
                                    <div>
                                        <span>劵值:{{ item.couponPrice }} </span>
                                        <span style="margin-left: 10px;">有效期:{{ item.validDate }} </span>
                                    </div>
                                </template>
                            </van-cell>
                        </van-cell-group>
                    </van-checkbox-group>
                </van-list>
            </van-pull-refresh>
        </van-popup>

    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false,
        "authority": true
    }
}</route>

<style scoped lang="scss">
.me-box {
    background-color: #f5f5f5;
    height: 91vh;

    .back {
        width: 100%;
        height: 20%;
        box-sizing: border-box;
        background: url("@/assets/me/headerBg.png") no-repeat top;
        background-size: 100% 70%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        .person {
            display: flex;
            align-items: center;

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
                    font-size: 1.2rem;
                    color: #fff;
                    font-weight: bolder;
                    word-break: break-all;
                    word-wrap: break-word;
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

                .coffee-num,
                .coffee-text {
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
        .short-url {
            margin-top: 15px;

            .edit-btn {
                margin: .5rem 0;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;

                &>button {
                    margin: .5rem .8rem;
                    width: 25%;
                }
            }

            .short-url-copy {
                padding: 10px 16px;
                color: black;
                background-color: #f5f5f5;

                &>div {
                    margin: .5rem 0rem;
                    font-size: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    span {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        -o-text-overflow: ellipsis;
                    }
                }
            }
        }
    }

    .short-url-copy {
        padding: 10px 16px;
        color: black;
        background-color: #f5f5f5;

        &>div {
            margin: .5rem 0rem;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
            }
        }
    }
}
</style>