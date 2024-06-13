<script setup lang="ts" name="layout">
import { showToast } from 'vant';
 const onChange = (index:number) => showToast(`标签 ${index}`);
</script>

<template> 
    <div>
        <router-view></router-view> 
        <van-tabbar route fixed @change="onChange">
            <van-tabbar-item replace to="/home" icon="home-o">菜单</van-tabbar-item>
            <van-tabbar-item replace to="/bar" icon="cart-o">购物车</van-tabbar-item>
            <van-tabbar-item replace to="/me" icon="user-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<style scoped lang="scss"></style>