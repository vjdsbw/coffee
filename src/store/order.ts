import { defineStore } from 'pinia';

interface OrderState {
    orderList: any
    orderCheck: any
    orderProduct: any,
    orderSettlement: any
}

export const useOrderStore = defineStore({
    id: 'order',
    // 修改默认值之后，需清除 localStorage 数据
    state: (): OrderState => ({
        orderList: [], //购物车列表
        orderCheck: [],//购物车选中的购物车商品
        orderProduct: {}, //商品详情
        orderSettlement: [] //结算商品
    }),
    getters: {

    },
    actions: {
        saveOrderList(list: any[]) {
            this.orderList = list
        },
        saveOrderCheck(list: any[]) {
            this.orderCheck = list
        },
        saveOrderProduct(obj: any) {
            this.orderProduct = obj
        },
        saveOrderSettlement(list: any[]) {
            this.orderSettlement = list
        }
    },
});