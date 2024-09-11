import { defineStore } from 'pinia';
import piniaPersistConfig from './piniaPersist';

interface UserState {
    token: string;
    code: string;
    sign:string
}

export const useUserStore = defineStore({
    id: 'user', // id必填，且需要唯一
    state: (): UserState => {
        return {
            token: "",
            code: "",
            sign:"",
        };
    },
    actions: {
        setToken(token: UserState['token']) {
            this.token = token;
        },
        setCode(Code: UserState['token']) {
            this.code = Code;
        },
        setSign(sign: UserState['sign']) {
            this.sign = sign;
        },
    },
    persist: piniaPersistConfig('user')
});
