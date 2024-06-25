<script setup lang="ts" name="ChooseShop"></script>

<template>
    <div class="choose-shop-box">
        <div class="choose-shop-btn">
            <van-button plain type="primary">门店自提</van-button>
        </div>
        <van-search show-action placeholder="输入地址寻找周边门店">
            <template #label>
                <div>南京</div>
            </template>
            <template #action>
                <van-icon name="scan" size="1.5rem" />
            </template>
        </van-search>
        <div class="shop-list">
            <div class="shop-list-item" v-for="item in 10" :key="item">
                <div class="shop-list-item-top">
                    <div>
                        <van-tag size="large" color="#6d86c4" type="primary">瑞幸咖啡</van-tag>
                        <span>无锡国家工业设计园店(No.13372)</span>
                    </div>
                    <div>28m</div>
                </div>
                <div class="shop-list-item-bottom">
                    <div class="shop-time">
                        <van-icon name="underway-o" />
                        <span>07:30-18:00</span>
                    </div>
                    <div class="shop-address">
                        <div>
                            <van-icon name="location-o" />
                            <span>玄武区中央路 284号金谷创客一层 107 号</span>
                        </div>
                        <div class="shop-address-detail">查看详情</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false,
        "authority": false
    }
}</route>

<style scoped lang="scss">
.choose-shop-box {
    height: 100vh;
    overflow: scroll;
    background-color: #f5f5f5;

    .choose-shop-btn {
        text-align: center;
        padding: 0.2rem 3rem;

        .van-button {
            width: 19rem;
            border: 2px solid #6d86c4;
            border-radius: 2rem;
        }
    }

    :deep(.van-search) {
        background-color: #f5f5f5;
        padding-right: 12px;
        display: flex;
        align-items: center;

        .van-search__content {
            background-color: #fff;
            border-radius: 0.4rem 0px 0px 0.4rem;
            display: flex;
            align-items: center;
            height: 3rem;

            .van-search__label {
                border-right: 0.01rem solid #e5e5e5;

                &>div {
                    padding-right: 1.28rem;
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAPCAYAAAAVk7TYAAAAAXNSR0IArs4c6QAAAWlJREFUOBGtVLtOhEAUdbCh2Bj4Cj/A0sbCxMTSgpgYyVIAvYmfsaUNhFD4KOi0MrGxtfAT9gcsDMXGQiJ4zjoz2R0RNsJN4M6999xzYF5iS1qSJDcYnjZNs61yQ70Q4hMcV1EUXZBL8JXnuVNV1TuEljFzYxkEv8C7E8fxh0XSIAhKJO7HEjB4HijE3FKMA9d1z/EVrxyPZeRzHMdXfFrM87yFbdvHKMxVcaCfk4+8ikeLMeH7/hvcER76IbbkkXyap3VDpGm6V9f1M1ATjdx8sLAs6yAMw19LsvZnio9ANJwgrlRuQ1+xr02I/a1iLKDhCW6KRW4Y95nETWVfK/xPMaKxZe9wJC5bO40kccQb6bWwU4xIEMzg+HTZTOK6MD83SCcCRXy1wKa5hj8zsZi+W0wdz2jvdPf+GclJBAvguY7aGMt8rxCbWre+ZjMGRVFMyrJ8hMA+Si+4dQ5XD60BHyfMsmz3P0zfFwd58PIssl4AAAAASUVORK5CYII=) 100% no-repeat;
                    background-size: 1rem 0.5rem;
                }
            }

            .van-cell {
                margin-left: 1rem;
            }
        }

        .van-search__action {
            background-color: #fff;
            border-radius: 0px 0.4rem 0.4rem 0px;
            display: flex;
            align-items: center;
            height: 3rem;
        }
    }

    .shop-list {
        margin-top: 1rem;
        height: calc(100vh - 9rem);
        overflow: scroll;
        padding: 0 0.5rem;

        .shop-list-item {
            background-color: #fff;
            border-radius: 0.5rem;
            padding: 1rem 0.5rem;
            margin-bottom: 1rem;

            .shop-list-item-top {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .van-tag {
                    margin-right: 0.5rem;
                }
            }

            .shop-list-item-bottom {
                .shop-time {
                    .van-icon {
                        margin-right: 0.5rem;
                        vertical-align: middle;
                    }

                    span {
                        font-size: 0.9rem;
                        line-height: 0.5rem;
                        color: #666;
                        vertical-align: middle;
                    }
                }

                .shop-address {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .shop-address-detail {
                        font-size: 1rem;
                        vertical-align: middle;
                        color: #6d86c4;
                    }

                    .van-icon {
                        margin-right: 0.5rem;
                        vertical-align: middle;
                    }

                    span {
                        font-size: 0.9rem;
                        line-height: 0.5rem;
                        color: #666;
                        vertical-align: middle;
                    }

                }
            }
        }
    }
}
</style>
