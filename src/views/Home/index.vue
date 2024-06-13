<script setup lang="ts">
import axios from 'axios'
import MapContainer from "../../components/MapContainer.vue";

const getLocaltion = async ()=>{
  const data = await axios({
    url:'https://restapi.amap.com/v3/ip?key=a0e0ebabac17b0282d882728bd676a8d',
    method:'get'
  })
  console.log(data)

}

onMounted(()=>{
  getLocaltion()
})

</script>

<template>
  <div>

    <MapContainer></MapContainer>
  </div>
</template>

<route lang="json">{
    "meta": {
       "layout": "index"
    }
  }</route>

<style scoped lang="scss">
 
</style>