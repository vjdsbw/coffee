<script setup lang="ts" name="layout">
import homeActive from '@/assets/icons/home_active.png';
import home from '@/assets/icons/home.png';
import menuPActive from '@/assets/icons/menu_active.png';
import menuP from '@/assets/icons/menu.png';
import myActive from '@/assets/icons/my_active.png';
import my from '@/assets/icons/my.png';
import shopbagActive from '@/assets/icons/shopbag_active.png';
import shopbag from '@/assets/icons/shopbag.png';
import { Store } from "@/store";

const { user } = Store();

const active = ref('/home');
const router = useRouter()
const tabbarChange = (name:string) => {
    if(name === '/home' ||name === '/category' ){
        router.push(name);
    }else if((name === '/cart' ||name === '/me') && user.token){
        router.push(name);
    }else{
        router.push('/login');
    }
}
</script>

<template>
    <div>
        <router-view></router-view>
        <div style="height: 4rem;background-color: #f7f8fa"></div>
        <van-tabbar v-model="active" fixed @change="tabbarChange">
            <van-tabbar-item name="/home">
                <span>首页</span>
                <template #icon="props">
                    <van-image :src="props.active ? homeActive : home" />
                </template>
            </van-tabbar-item>
            <van-tabbar-item name="/category">
                <span>菜单</span>
                <template #icon="props">
                    <van-image :src="props.active ? menuPActive : menuP" />
                </template>
            </van-tabbar-item>
            <van-tabbar-item name="/cart">
                <span>购物车</span>
                <template #icon="props">
                    <van-image :src="props.active ? shopbagActive : shopbag" />
                </template>
            </van-tabbar-item>
            <van-tabbar-item name="/me">
                <span>我的</span>
                <template #icon="props">
                    <van-image :src="props.active ? myActive : my" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<style scoped lang="scss"></style>