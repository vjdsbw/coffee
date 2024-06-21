<script lang="ts" setup name="error">
const route = useRoute();

// const sections = ref([
//     { 
//         title: "Section 1", 
//         content: "Content for Section 1", 
//         categories: [
//             { 
//                 title: "Category 1-1", 
//                 items: ["Item 1-1-1", "Item 1-1-2", "Item 1-1-3"]
//             },
//             { 
//                 title: "Category 1-2", 
//                 items: ["Item 1-2-1", "Item 1-2-2", "Item 1-2-3"]
//             }
//         ]
//     },
//     { 
//         title: "Section 2", 
//         content: "Content for Section 2", 
//         categories: [
//             { 
//                 title: "Category 2-1", 
//                 items: ["Item 2-1-1", "Item 2-1-2", "Item 2-1-3"]
//             },
//             { 
//                 title: "Category 2-2", 
//                 items: ["Item 2-2-1", "Item 2-2-2", "Item 2-2-3"]
//             }
//         ]
//     },
//     { 
//         title: "Section 3", 
//         content: "Content for Section 3", 
//         categories: [
//             { 
//                 title: "Category 3-1", 
//                 items: ["Item 3-1-1", "Item 3-1-2", "Item 3-1-3"]
//             },
//             { 
//                 title: "Category 3-2", 
//                 items: ["Item 3-2-1", "Item 3-2-2", "Item 3-2-3"]
//             }
//         ]
//     },
//     { 
//         title: "Section 4", 
//         content: "Content for Section 4", 
//         categories: [
//             { 
//                 title: "Category 4-1", 
//                 items: ["Item 4-1-1", "Item 4-1-2", "Item 4-1-3"]
//             },
//             { 
//                 title: "Category 4-2", 
//                 items: ["Item 4-2-1", "Item 4-2-2", "Item 4-2-3"]
//             }
//         ]
//     },
//     { 
//         title: "Section 5", 
//         content: "Content for Section 5", 
//         categories: [
//             { 
//                 title: "Category 5-1", 
//                 items: ["Item 5-1-1", "Item 5-1-2", "Item 5-1-3"]
//             },
//             { 
//                 title: "Category 5-2", 
//                 items: ["Item 5-2-1", "Item 5-2-2", "Item 5-2-3"]
//             }
//         ]
//     },
//     // 其他 section
// ]);
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
