<script setup lang="ts">
import { useFetch } from '@vueuse/core'

const { isFetching, error, data } = useFetch('https://restapi.amap.com/v3/ip?key=	a0e0ebabac17b0282d882728bd676a8d');
console.log(isFetching, error, data,'xxxxxxxxxxxxxx')

</script>

<template>
  <div>
    home
  </div>
</template>

<route lang="json">{
    "meta": {
       "layout": "index"
    }
  }</route>

<style scoped lang="scss">

</style>