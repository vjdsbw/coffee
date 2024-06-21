<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
// 模拟数据

const sections = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => {
    return {
        title: `Section ${item}`,
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
const activeCategories = ref(''); // 为每个 section 单独维护激活的分类
const contentRef = ref(null);

const scrollToSection = (index) => {
    const headerOffset = 60; // 固定头部的高度
    const sectionElement = document.getElementById(`section-${index}`);
    const elementPosition = sectionElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY + headerOffset;
    if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth",top: offsetPosition, });
        activeCategories.value = 0; // 重置分类为第一个
    }
};

const scrollToCategory = (sectionIndex, categoryIndex) => {
    const headerOffset = 60; // 固定头部的高度
    const categoryElement = document.getElementById(`section-${sectionIndex}-category-${categoryIndex}`);
    const elementPosition = categoryElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
   
    if (categoryElement) {
        console.log(offsetPosition,"XXXXXXXXXXXXXXX");
        categoryElement.scrollIntoView({ behavior: "smooth", top: offsetPosition, });
        activeCategories.value[sectionIndex] = categoryIndex; // 设置当前分类为激活
    }
};

const onScroll = () => {
    const contentElement = contentRef.value;
    if (!contentElement) {
        console.log("Content element not found");
        return;
    }

    const sectionElements = contentElement.querySelectorAll(".section");
    sectionElements.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            activeSection.value = index;
            const categoryElements = section.querySelectorAll(".category");
            categoryElements.forEach((category, cIndex) => {
                const categoryRect = category.getBoundingClientRect();
                if (categoryRect.top <= 100 && categoryRect.bottom >= 100) {
                    activeCategories.value[index] = cIndex;
                }
            });
        }
    });
};

onMounted(async () => {
    await nextTick();
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
    <div class="container">
        <!-- 左侧 Sidebar -->
        <van-sidebar v-model="activeSection">
            <van-sidebar-item v-for="(section, index) in sections" :key="section.title" :title="section.title"
                @click="scrollToSection(index)"></van-sidebar-item>
        </van-sidebar>

        <!-- 右侧 Content -->
        <div class="content" ref="contentRef">
            <section v-for="(section, index) in sections" :key="section.title" :id="'section-' + index" class="section">
                <div class="section-header">
                    <div>{{ section.title }}</div>
                    <div class="categories">
                        <span v-for="(category, cIndex) in section.categories" :key="category.title"
                            :class="{ 'active': activeCategories[index] === cIndex }"
                            @click="scrollToCategory(index, cIndex)">
                            {{ category.title }}
                        </span>
                    </div>
                </div>
                <div v-for="(category, cIndex) in section.categories" :key="category.title"
                    :id="'section-' + index + '-category-' + cIndex" class="category">
                    <h3>{{ category.title }}</h3>
                    <div v-for="item in category.items" :key="item" class="item">{{ item }}</div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    height: 100vh;
    overflow: hidden;

    .content {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        position: relative;

        .section {
            margin-bottom: 20px;
            padding: 20px;
            background: #fff;
            border: 1px solid #ddd;
        }

        .section-header {
            position: sticky;
            top: 0;
            background: #fff;
            padding: 10px;
            z-index: 1;
            border-bottom: 1px solid #ddd;
            font-size: 10px;

            .categories {
                display: flex;
                gap: 10px;

                span {
                    cursor: pointer;
                    padding: 5px 10px;
                    border: 1px solid transparent;
                    border-radius: 5px
                }
            }
        }

        .category {
            margin-top: 20px;

            .item {
                padding: 5px 10px;
                margin: 5px 0;
                background: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
        }
    }

}

.van-sidebar {
    width: 6rem;
    border-right: 1px solid #f0f0f0;
}

.categories span.active {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
}

h2 {
    margin: 0 0 10px 0;
}

h3 {
    margin: 10px 0;
}
</style>
