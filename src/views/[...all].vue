<script lang="ts" setup name="All">
const route = useRoute();

</script>

<template>
    <div class="box">
        {{route.path}}
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
