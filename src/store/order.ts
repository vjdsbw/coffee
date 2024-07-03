import { defineStore } from 'pinia';

interface OrderState {
    oderInfo: any,
    placeInfo: any,
    orderList: any
    orderCheck: any
    orderIdList: any,
}

export const useOrderStore = defineStore({
    id: 'order',
    // 修改默认值之后，需清除 localStorage 数据
    state: (): OrderState => ({
        oderInfo: {},
        placeInfo: [],
        orderList: [],
        orderCheck: [],
        orderIdList: []
    }),
    getters: {
        getPlaceInfo: state => state.placeInfo
    },
    actions: {
        savePlaceInfo(list: any[]) {
            this.placeInfo = list
        },
        saveOrderList(list: any[]) {
            this.orderList = list
        },
        saveOrderCheck(list: any[]) {
            this.orderCheck = list
        },
        saveOrderIdList(list: any[]) {
            this.orderIdList = list
        },
    },
});