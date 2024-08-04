<script setup lang="ts" name="Me">
import Avatar from '@/assets/me/default_avatar.png';
import copy from '@/assets/icons/copy.svg'
import copySuccess from '@/assets/icons/copy-success.svg'
import {
    batchGenerateApi,
    bindUidApi,
    couponDataPageListApi,
    logoutUidApi,
    replaceUidApi,
    usedCountApi,
    availableCountApi,
    generateByNumApi,
    deleteUrlApi,
    queryUrlStatusApi,
    couponByUidApi
} from "@/api/user.ts";
import Clipboard from 'clipboard';

const router = useRouter();

const list = [
    { title: "获取uid", path: "/me/login" },
    { title: "查询创建的短链", path: "/me/shortlink" },
]

const httpUrl = ref<any>([])

const couponList = ref<any[]>([]) //卡券列表

const inputList = ref<string[]>(['']);

const checked = ref([]);

// 生成短链
// const getShortUrl = async () => {
//     if (checked.value.length > 0) {
//         let list: any = checked.value.map((v: any) => ({ couponId: v.couponId, uid: v.uid, couponPrice: v.discountDegree }))
//         const { code, data, msg } = await batchGenerateApi({ couponList: list });
//         if (code === 0) {
//             httpUrl.value = data.map((item: string) => ({ copyed: false, shortUrl: item }))
//             showToast('短链生成成功，点击复制链接')
//         } else {
//             showToast(msg)
//         }
//     } else {
//         showToast('请输入uid或者选择咖啡券')
//     }
// }

const generateByNum = async (item: any) => {
    const { code, data, msg } = await generateByNumApi({ dataId: item.dataId, couponNum: item.couponNum });
    if (code === 0) {
        showToast('创建链接成功');
        httpUrl.value = data.map((item: string) => ({ copyed: false, shortUrl: item }))
        showPop.value = false;
    } else {
        showToast(msg)
    }
}


// 复制生成的短链
const copyUrl = async () => {
    if (httpUrl.value.length === 0) return showToast('暂无链接，请先生成短链');
    const list = httpUrl.value.map((item: any) => item.shortUrl).join('\n')
    try {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(list);
        } else {
            // 创建 textarea
            let textarea: any = document.createElement("textarea");
            textarea.value = list;
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
    checked.value = [];
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

const urlLink = ref<string>()
const delUrlLink = async () => {
    const { code, data, msg } = await deleteUrlApi({ url: urlLink.value! })
    code === 0 ? showToast('删除成功') : showToast(msg);
}

const checkUrlStatus = async () => {
    const { code, data, msg } = await queryUrlStatusApi({ url: urlLink.value! })
    code === 0 ? showToast(data) : showToast(msg);
}

const pageNum = ref<number>(1);
const showPop = ref<boolean>(false);
const loading = ref(false);
const onRefresh = async () => {
    pageNum.value = 0;
    couponList.value = [];
    activeNames.value = ''
    onLoad()
};

const finishedloading = ref(false);
const finished = ref(false);
const onLoad = async () => {
    pageNum.value++;
    finished.value = false;
    const { code, data, msg } = await couponDataPageListApi({ pageNo: pageNum.value, pageSize: 20 })
    if (code === 0) {
        couponList.value = [...couponList.value, ...data.dataList.map((item: any) => ({ ...item, couponNum: 1 }))];
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

const uidOutList = ref<{ phone: string, oldUid: string, newUid: string }[]>([]);
const uidOutShow = ref<boolean>(false)
const activeNames = ref();
const logoutUid = async () => {
    const { code, data, msg } = await logoutUidApi();
    if (code === 0) {
        if (data.length === 0) return showToast('暂无过期uid')
        uidOutList.value = data.map((item: { phone: string, uid: string }) => ({ phone: item.phone, oldUid: item.uid, newUid: "" }));
        uidOutShow.value = true;
    } else {
        showToast(msg)
    }
}

const submitNewUid = async (item: { phone: string, oldUid: string, newUid: string }) => {
    const { code, msg } = await replaceUidApi({ newUid: item.newUid, oldUid: item.oldUid });
    code === 0 ? showToast('替换成功') : showToast(msg)
    uidOutShow.value = false;
}

const availabeleAndUsedCount = ref<{
    availableCount: number,
    usedCount: number,
}>({
    availableCount: 0,
    usedCount: 0,
})
const getAvailableCount = async () => {
    const { code, data } = await availableCountApi();
    if (code === 0) {
        availabeleAndUsedCount.value.availableCount = data;
    }
}

const getUsedCount = async () => {
    const { code, data } = await usedCountApi();
    if (code === 0) {
        availabeleAndUsedCount.value.usedCount = data;
    }
}

const refreshCoupons = async () => {
    const { data, code, msg } = await couponByUidApi();
    code === 0 ? showToast('刷新成功') : showToast(msg)
}


onMounted(() => {
    getAvailableCount();
    getUsedCount();
})
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
                    <div class="coffee-num">{{ availabeleAndUsedCount.availableCount }}杯</div>
                    <div class="coffee-text ">剩余可下咖啡</div>
                </div>
                <hr class="line" />
                <div class="wallet-item">
                    <div class="coffee-num">{{ availabeleAndUsedCount.usedCount }}杯</div>
                    <div class="coffee-text">累计下单成功</div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="info">
                <van-cell-group>
                    <van-cell v-for="item in list" :title="item.title" icon="newspaper-o" is-link
                        @click="router.push(item.path)" />
                </van-cell-group>
            </div>
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
                        <!-- <van-button color="#7585BE" round size="small" @click="getShortUrl">批量生成</van-button> -->
                        <van-button color="#7585BE" round size="small" @click="copyUrl">复制链接</van-button>
                        <van-button color="#7585BE" round size="small" @click="logoutUid">过期uid</van-button>
                        <van-button color="#7585BE" round size="small" @click="refreshCoupons">刷新券</van-button>
                    </div>
                </van-cell-group>
                <van-cell-group inset style="margin-top: 10px;">
                    <!--动态添加uid输入框-->
                    <van-field v-model="urlLink" clearable placeholder="请输入链接" />
                    <div class="edit-btn">
                        <van-button color="#7585BE" style="width: 100px;" round size="small" :disabled="!urlLink"
                            @click="checkUrlStatus">查询链接状态</van-button>
                        <van-button color="#7585BE" round size="small" :disabled="!urlLink"
                            @click="delUrlLink">删除链接</van-button>
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
                <van-list v-model:loading="finishedloading" :finished="finished" finished-text="没有更多了" @load="onLoad"
                    :immediate-check="false">
                    <van-collapse v-model="activeNames" accordion>
                        <van-collapse-item v-for="(item, index) in couponList" :key="item.dataId" :name="index"
                            :title="item.coffeeStockTitle">
                            <div style="color: black;">
                                <div style="display: flex;justify-content: space-between;align-items: center;">
                                    <div>劵价格:¥{{ item.discountDegree }}</div>
                                    <div style="text-align: right;"> 可用张数:{{ item.availableCount }}</div>
                                </div>
                                <div style="margin-top: 10px;">
                                    <van-field v-model="item.couponNum" center clearable label="生成链接个数"
                                        placeholder="生成链接个数" style="padding: 0px;">
                                        <template #button>
                                            <van-button
                                                :disabled="item.couponNum < 1 || item.couponNum > item.availableCount"
                                                size="small" color="#7585BE" type="primary"
                                                @click="generateByNum(item)">提交</van-button>
                                        </template>
                                    </van-field>
                                </div>
                            </div>
                        </van-collapse-item>
                    </van-collapse>
                </van-list>
            </van-pull-refresh>
        </van-popup>

        <van-popup v-model:show="uidOutShow" closeable position="bottom" :style="{ height: '50%' }">
            <van-collapse v-model="activeNames" accordion>
                <van-collapse-item v-for="(item, index) in uidOutList" :key="index" :name="index">
                    <template #title>
                        <div class="out-title">
                            <div><span>uid:</span>{{ item.oldUid }}</div>
                        </div>
                    </template>
                    <div class="out-title">
                        <div><span>手机号:</span> {{ item.phone }}</div>
                        <van-field v-model="item.newUid" center clearable label="新uid" placeholder="请输入新的uid">
                            <template #button>
                                <van-button :disabled="!item.newUid" size="small" color="#7585BE" type="primary"
                                    @click="submitNewUid(item)">提交</van-button>
                            </template>
                        </van-field>
                    </div>
                </van-collapse-item>
            </van-collapse>
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

    .van-collapse {
        margin-top: 2rem;

        .out-title {
            color: black;
            font-size: 12px;

            div {
                width: 95%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;

                span {
                    font-weight: 600;
                }
            }

            .van-field {
                padding: 0px;
            }
        }
    }
}
</style>