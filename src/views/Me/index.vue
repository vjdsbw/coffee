<script setup lang="ts" name="Me">
import Avatar from '@/assets/me/default_avatar.png'
import {bindUidApi, generateShortCodeApi, getCouponListApi} from "@/api/user.ts";

const router = useRouter()

const uid = ref<any>()
const httpUrl = ref<any>()


const list = [
    {title: "我的订单信息", path: "/me/orderInfo"},
    {title: "我的咖啡信息", path: "/me/coffeeInfo"},
    // {title: "咖啡卡卷", path: "/me/cardRollBinding"},
]

const couponList = ref<{ text: string, value: string }[]>([]) //卡券列表

const fieldValue = ref();
const showPicker = ref(false);
const inputList = ref<any>(['']);

const checked = ref([]);
const checkboxRefs = ref<any>([]);
const toggle = (index: any) => {
    checkboxRefs.value?.[index]?.toggle();
};

onBeforeUpdate(() => {
    checkboxRefs.value = [];
});

function getRandomInt(min: number, max: number): number {
    // 确保min小于max
    if (min > max) {
        [min, max] = [max, min];
    }
    // 生成min和max之间的随机整数
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 生成短链
const getShortUrl = () => {
    if (fieldValue.value && uid.value) {
        // generateShortCodeApi({couponId: fieldValue.value ?? getRandomInt(100, 100000), uid: uid.value ?? 'b93c995d-d6b9-469d-9bec-0cd167e3bfc41720102820651', couponPrice: getRandomInt(100, 1000)}).then(res => {
        const price: any = couponList.value?.filter((v: any) => v?.couponId === fieldValue.value)
        console.log(price?.discountDegree)
        generateShortCodeApi({
            couponId: fieldValue.value,
            uid: uid.value,
            couponPrice: price?.discountDegree ?? 100
        }).then(res => {
            httpUrl.value = res.data
            showToast('短链生成成功，点击复制链接')
            console.log(res)
        })
    } else {
        showToast('请输入uid或者选择咖啡券')
    }
}

const onConfirm = ({selectedOptions}: any) => {
    showPicker.value = false;
    fieldValue.value = selectedOptions[0].value;
};

const showSelectCoupon = () => {
    if (couponList.value.length !== 0) {
        showPicker.value = true
    } else {
        showToast('请先输入uid加载咖啡券')
    }
}

// 复制生成的短链
const copyUrl = async () => {
    console.log(httpUrl.value, '短链')
    try {
        if (httpUrl.value) {
            await navigator.clipboard.writeText(httpUrl.value);
            // showToast('复制链接成功,3秒后跳转')
            // setTimeout(() => {
            //     window.open(httpUrl.value)
            // }, 3000)
        } else {
            showToast('暂无链接，请先生成短链')
        }
    } catch (err) {
        showToast('复制链接失败')
        console.error('Failed to copy text: ', err);
    }
}

// 根据输入的uid绑定咖啡券
const bindUid = () => {
    // bindUidApi({uidList: ['b93c995d-d6b9-469d-9bec-0cd167e3bfc41720102820651']}).then(res => {
    if (inputList.value.length > 0 && inputList.value[0] !== '') {
        // bindUidApi({uidList: [uid.value]})
        bindUidApi({uidList: inputList.value})
            .then(res => {
                console.log('获取卡券', res)
                if (res.code === 0) {
                    getCoupon()
                }

                if (res.code === 500) {
                    showToast(res.msg);
                }
            })
    } else {
        showToast('请输入uid')
    }
}

// 获取咖啡卡券
const getCoupon = () => {
    couponList.value = [];
    getCouponListApi().then(res => {
        if (res.code === 0) {
            res.data?.map((v: any) => {
                couponList.value.push({text: v?.coffeeStockTitle, value: v?.couponId},)
            })
        }

        if (res.code === 500) {
            showToast(res.msg);
        }
    })
}

const addInput = () => {
    inputList.value.push('')
}

const copyUrl2 = () => {
    console.log(inputList.value)
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
                    <van-cell v-for="item in list" :title="item.title" icon="newspaper-o" is-link
                              @click="router.push(item.path)"/>
                </van-cell-group>
            </div>
            <div class="short-url">
                <van-cell-group inset>
                    <!--                              <van-field v-model="uid" :autosize='{ maxHeight: 100 }' clearable placeholder="请输入链接/uid" rows="1" type="textarea" />
                              <van-field v-model="httpUrl"  clearable placeholder="请输入链接/uid"  />-->
                    <!--                    <van-field v-model="fieldValue" is-link label="选择咖啡券" readonly @click="showSelectCoupon"/>
                                        <van-popup v-model:show="showPicker" position="bottom" round>
                                            <van-picker :columns="couponList" @cancel="showPicker = false" @confirm="onConfirm"/>
                                        </van-popup>-->

                    <van-button class="addBtn" color="#7585BE" round size="small" @click="addInput">添加uid</van-button>
                    <van-field v-for="(item,index) in inputList" :key="index" v-model="inputList[index]" clearable placeholder="请输入链接/uid"/>

                    <van-checkbox-group v-model="checked">
                        <van-cell-group inset>
                            <van-cell v-for="(item, index) in couponList" :key="item" :title="`复选框 ${item}`" clickable @click="toggle(index)">
                                <template #right-icon>
                                    <van-checkbox :ref="(el:any) => checkboxRefs[index] = el" :name="item" @click.stop/>
                                </template>
                            </van-cell>
                        </van-cell-group>
                    </van-checkbox-group>


                    <div class="edit-btn">
                        <van-button color="#7585BE" round size="small" @click="bindUid">绑定咖啡券</van-button>
                        <van-button color="#7585BE" round size="small" @click="getShortUrl">生成短链</van-button>
                        <van-button color="#7585BE" round size="small" @click="copyUrl">复制链接</van-button>
                    </div>
                </van-cell-group>

            </div>
        </div>
    </div>
</template>

<route lang="json">{
"meta": {
"layout": false,
"authority": true
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
                    //font-size: 0.78rem;
                    //margin-top: 0.62rem;
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

            .short-url {
                position: relative;

                .addBtn {
                    position: absolute;
                    right: 0;
                    margin-left: 1.5rem;
                    height: 50px;
                }
            }

        }

        .edit-btn {
            margin: .5rem 0;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;

            & > button {
                margin: .5rem .8rem;
                width: 25%;
            }
        }
    }
}
</style>