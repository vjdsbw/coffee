<script setup lang="ts" name="App"></script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="slide">
      <component :is="Component" :key="route" />
    </transition>
  </router-view>
</template>

<style scoped lang="scss"></style>