/** @format */

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useUserStore } from './user';
import { useGlobalStore } from './global';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const Store = () => {
    return {
        user: useUserStore(),
        global: useGlobalStore(),
    };
};

export default pinia;
