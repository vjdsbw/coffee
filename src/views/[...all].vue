<script lang="ts" setup name="All">
const route = useRoute();
</script>

<template>
    <div class="box">
        {{route.path}}
        <!-- <n-result v-if="route.path === '/500'" status="500" title="500 服务器错误" description="服务器出错可能说明该雇更多程序员了"> </n-result>
        <n-result v-else status="404" title="404 资源不存在" description="生活总归带点荒谬"></n-result> -->
    </div>
</template>

<route lang="json">{
	"meta": {
		"layout": false,
        "authority":false
	}
}</route>

<style scoped lang="scss">
.box {
    margin: auto;
}
</style>
