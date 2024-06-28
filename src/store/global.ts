import { defineStore } from 'pinia';

interface GlobalState {
    shop: {
        address: string;
        distance: string;
        isShopClosed: string
        name: string;
        number: string;
        storeId: number | null;
        workTime: string;
    },
    latAndLon:{
        lat:number | null;
        lon:number | null
    }
}


export const useGlobalStore = defineStore({
    id: 'global',
    // 修改默认值之后，需清除 localStorage 数据
    state: (): GlobalState => ({
        shop: {
            address:'',
            distance: '',
            isShopClosed: '',
            name:'',
            number: '',
            storeId: null,
            workTime: '',
        },
        latAndLon:{
            lat:null,
            lon:null
        }
    }),
    getters: {
        shopGet: state => state.shop,
    },
    actions: {
        // Set GlobalState
        setShop(info: GlobalState['shop']) {
            this.shop = info;
        },
    },
});
