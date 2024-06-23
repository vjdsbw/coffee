<script setup lang="ts"  name="List">

const sections = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => {
    return {
        title: `Section${item}`,
        content: `Content for Section ${item}`,
        categories: [
            {
                title: `Category ${item}-1`,
                items: [`Item ${item}-1-1`, `Item ${item}-1-2`, `Item ${item}-1-3`]
            },
            {
                title: `Category ${item}-2`,
                items: [`Item ${item}-2-1`, `Item ${item}-2-2`, `Item ${item}-2-3`]
            },
            {
                title: `Category ${item}-3`,
                items: [`Item ${item}-3-1`, `Item ${item}-3-2`, `Item ${item}-3-3`]
            }
        ]

    }
}));

const activeSection = ref(0);
const contentRef = ref<HTMLElement | null>(null);
const activeCategories = ref<string | number>(''); // 为每个 section 单独维护激活的分类

const scrollToSection = (index: number) => {
    document.getElementById(`sidebarSelct${index}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
    });
};

const onScroll = () => {
    const contentElement = contentRef.value;
    if (!contentElement) return;
    const sectionElements = contentElement.querySelectorAll(".content-section");
    console.log(sectionElements, 'content-section')
    sectionElements.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < 0 && rect.bottom > 0) {
            activeSection.value = index;
            const categoryElements = section.querySelectorAll(".content-section-header-categories");
            categoryElements.forEach((category, cIndex) => {
                const categoryRect = category.getBoundingClientRect();
                if (categoryRect.top <= 100 && categoryRect.bottom >= 100) {
                    activeCategories.value = cIndex;
                }
            });
        }

        // if (rect.top <= 100 && rect.bottom >= 100) {
        //     activeSection.value = index;
        //     const categoryElements = section.querySelectorAll(".category");
        //     categoryElements.forEach((category, cIndex) => {
        //         const categoryRect = category.getBoundingClientRect();
        //         if (categoryRect.top <= 100 && categoryRect.bottom >= 100) {
        //             activeCategories.value = cIndex;
        //         }
        //     });
        // }
    });
    // activeSection.value = selectIndex;
};

onMounted(async () => {
    // await nextTick();
    const contentElement = contentRef.value;
    if (contentElement) {
        contentElement.addEventListener("scroll", onScroll);
    }
});

onUnmounted(() => {
    const contentElement = contentRef.value;
    if (contentElement) {
        contentElement.removeEventListener("scroll", onScroll);
    }
});
</script>


<template>
    <div class="list-box">
        <div class="box-top"> 
            <van-image round src="../src/assets/category/category-top.png"></van-image>
        </div>
        <div class="box-content">
            <!-- 左侧 Sidebar -->
            <van-sidebar v-model="activeSection">
                <van-sidebar-item v-for="(section, index) in sections" :key="section.title" :title="section.title"
                    @click="scrollToSection(index)"></van-sidebar-item>
            </van-sidebar>

            <!-- 右侧 Content -->
            <div class="content" ref="contentRef">
                <div class="content-section" v-for="(section, index) in sections" :key="index"
                    :id="'sidebarSelct' + index">
                    <div class="content-section-header">
                        <div class="content-section-header-title">{{ section.title }}</div>
                        <div class="content-section-header-categories">
                            <div v-for="(item, idx) in section.categories"
                                :class="{ 'active': activeCategories === idx && index == activeSection }">{{ item.title
                                }}
                            </div>
                        </div>
                    </div>

                    <div class="content-section-box" v-for="(item, idx) in section.categories" :key="idx">
                        <div class="content-section-box-title">{{ item.title }}</div>
                        <div class="content-section-box-card" v-for="(itm, ind) in item.items" :key="ind">{{ itm }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false,
        "authority": false
    }
}</route>

<style scoped lang="scss">
.list-box {

    .box-top {
        min-height: 2.4rem;
        padding: .2rem .2rem 0;
        background: #f3f3f3;
        position: relative;
        z-index: 3;

        &::before {
            content: "";
            display: block;
            background: #333999;
            height: 3.44rem;
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
        }
    }

    .box-content {
    display: flex;
    .van-sidebar {
        width: 6rem;
        height: 100vh;
        overflow: scroll;

        .van-sidebar-item--select {
            background-color: #9dc4e3;

            &::before {
                height: 90%;
            }
        }
    }
    .content {
        height: 100vh;
        overflow: scroll;
        flex: 1;

        .content-section {
            margin: 0px 0px 10px 0px;
            padding: 5px;
            border: 1px solid #9dc4e3;

            .content-section-header {
                position: sticky;
                top: 0;
                background: #fff;
                padding: 10px;
                z-index: 1;
                border-bottom: 1px solid #ddd;
                font-size: 10px;

                .content-section-header-title {
                    font-size: 1rem;
                }

                .content-section-header-categories {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    margin-top: 5px;
                    color: #9dc4e3;

                    .active {
                        color: red;
                    }
                }
            }

            .content-section-box {
                .content-section-box-title {
                    font-size: 1rem;
                }

                .content-section-box-card {
                    width: 100%;
                    height: 150px;
                    text-align: center;
                    margin: 5px 0px;
                    background-color: beige;
                }
            }
        }
    }
}

}


</style>
