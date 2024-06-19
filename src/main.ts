import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import pinia from '@/store';
import router from '@/routes'

createApp(App).use(router).use(pinia).mount('#app')
