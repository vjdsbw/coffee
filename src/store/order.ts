import { defineStore } from 'pinia';

interface OrderState {
    oderInfo: any,
    placeInfo: any
}

export const useOrderStore = defineStore({
    id: 'order',
    // 修改默认值之后，需清除 localStorage 数据
    state: (): OrderState => ({
        oderInfo: {},
        placeInfo: []
    }),
    getters: {
        getPlaceInfo: state => state.placeInfo
    },
    actions: {
        savePlaceInfo(list: any[]) {
            this.placeInfo = list
        }
    },
});