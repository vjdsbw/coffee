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
        cityName:string;
    },
    latAndLon: {
        lat: number | null;
        lon: number | null
    },
    limitPrice: number
    total: {
        totalPrice: number;
        totalNum: number;
    }
}


export const useGlobalStore = defineStore({
    id: 'global',
    // 修改默认值之后，需清除 localStorage 数据
    state: (): GlobalState => ({
        shop: {
            address: '',
            distance: '',
            isShopClosed: '',
            name: '',
            number: '',
            storeId: null,
            workTime: '',
            cityName:"",
        },
        latAndLon: {
            lat: null,
            lon: null
        },
        limitPrice: 0,
        total: {
            totalPrice: 0,
            totalNum: 0,
        }
    }),
    getters: {
        shopGet: state => state.shop,
        limitPriceGet: state => state.limitPrice,
        totalGet: state => state.total,
        latAndLonGet: state => state.latAndLon,
    },
    actions: {
        // Set GlobalState
        setShop(info: GlobalState['shop']) {
            this.shop = info;
        },
        setLimitPrice(price: GlobalState['limitPrice']) {
            this.limitPrice = price;
        },
        setTotal(nums: GlobalState['total']) {
            this.total = nums;
        },
        setLatAndLon(address: GlobalState['latAndLon']) {
            this.latAndLon = address;
        }
    },
});
