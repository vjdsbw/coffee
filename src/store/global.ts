import { defineStore } from 'pinia';

interface GlobalState {
    tabBarActive: string;
}

type ObjToKeyValArray<T> = {
    [K in keyof T]: [T[K], K];
}[keyof T];

export const useGlobalStore = defineStore({
    id: 'global',
    // 修改默认值之后，需清除 localStorage 数据
    state: (): GlobalState => ({
        tabBarActive:"/home",
    }),
    getters: {},
    actions: {
        // Set GlobalState
        setGlobalState(...args: ObjToKeyValArray<GlobalState>) {
            this.$patch({ [args[1]]: args[0] });
        }
    },
});
