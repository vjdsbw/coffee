import { defineStore } from 'pinia';
import piniaPersistConfig from './piniaPersist';

interface UserState {
    token: string;
}

export const useUserStore = defineStore({
    id: 'user', // id必填，且需要唯一
    state: (): UserState => {
        return {
            token: '',
        };
    },
    actions: {
        setToken(token: UserState['token']) {
            this.token = token;
        },
    },
    persist: piniaPersistConfig('user')
});
