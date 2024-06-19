import { defineStore } from 'pinia';
import piniaPersistConfig from './piniaPersist';

interface GlobalState {
    layout: 'vertical' | 'classic' | 'transverse' | 'columns';
    assemblySize: string;
    language: string | null;
    maximize: boolean;
    primary: string;
    isDark: boolean;
    isGrey: boolean;
    isWeak: boolean;
    asideInverted: boolean;
    isCollapse: boolean;
    breadcrumb: boolean;
    breadcrumbIcon: boolean;
    tabs: boolean;
    tabsIcon: boolean;
    footer: boolean;
}

type ObjToKeyValArray<T> = {
    [K in keyof T]: [T[K], K];
}[keyof T];

export const useGlobalStore = defineStore({
    id: 'global',
    // 修改默认值之后，需清除 localStorage 数据
    state: (): GlobalState => ({
        // 布局模式 (纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns)
        layout: 'vertical',
        // element 组件大小
        assemblySize: 'default',
        // 当前系统语言
        language: 'zh-CN',
        // 当前页面是否全屏
        maximize: false,
        // 主题颜色
        primary: '#009688',
        // 深色模式
        isDark: false,
        // 灰色模式
        isGrey: false,
        // 色弱模式
        isWeak: false,
        // 侧边栏反转 (目前仅支持 'vertical' 模式)
        asideInverted: false,
        // 折叠菜单
        isCollapse: false,
        // 面包屑导航
        breadcrumb: true,
        // 面包屑导航图标
        breadcrumbIcon: true,
        // 标签页
        tabs: true,
        // 标签页图标
        tabsIcon: true,
        // 页脚
        footer: true
    }),
    getters: {},
    actions: {
        // Set GlobalState
        setGlobalState(...args: ObjToKeyValArray<GlobalState>) {
            this.$patch({ [args[1]]: args[0] });
        }
    },
    persist: piniaPersistConfig('global')
});
