<template>
    <div class="container">
        <!-- 左侧 Sidebar -->
        <van-sidebar v-model="activeSection">
            <van-sidebar-item v-for="(section, index) in sections" :key="section.title" :title="section.title"
                @click="scrollToSection(index)" />
        </van-sidebar>

        <!-- 右侧 Content -->
        <div class="content" ref="contentRef" @scroll="onScroll">
            <section v-for="(section, index) in sections" :key="section.title" :id="'section-' + index" class="section">
                <h2>{{ section.title }}</h2>
                <p>{{ section.content }}</p>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { Sidebar, SidebarItem } from 'vant';
import 'vant/lib/index.css';

// 模拟数据
const sections = ref([
    { title: 'Section 1', content: 'Content for Section 1' },
    { title: 'Section 2', content: 'Content for Section 2' },
    { title: 'Section 3', content: 'Content for Section 3' },
    { title: 'Section 4', content: 'Content for Section 4' },
    { title: 'Section 5', content: 'Content for Section 5' },
    { title: 'Section 6', content: 'Content for Section 6' },
]);

const activeSection = ref(0);
const contentRef = ref(null);

// 节流函数
const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
};

const scrollToSection = (index) => {
    const sectionElement = document.getElementById(`section-${index}`);
    if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
};

const onScroll = () => {
    const contentElement = contentRef.value;
    if (!contentElement) {
        return;
    }

    const scrollTop = contentElement.scrollTop;
    const sectionElements = contentElement.querySelectorAll('.section');

    sectionElements.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            activeSection.value = index;
        }
    });
};

onMounted(async () => {
    await nextTick();
    const contentElement = contentRef.value;
    if (contentElement) {
        contentElement.addEventListener('scroll', throttle(onScroll, 100));
    }
});

onUnmounted(() => {
    const contentElement = contentRef.value;
    if (contentElement) {
        contentElement.removeEventListener('scroll', throttle(onScroll, 100));
    }
});
</script>

<style scoped>
.container {
    display: flex;
    height: 100vh;
    overflow: hidden;
}

.van-sidebar {
    width: 200px;
    border-right: 1px solid #f0f0f0;
}

.content {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

.section {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border: 1px solid #ddd;
    height: 100vh;
}

h2 {
    margin: 0 0 10px 0;
}
</style>