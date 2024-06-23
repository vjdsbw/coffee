import http from '@/utils/http';

interface Address {
    lat:string;
    lon : string;
}

// 登录
export const loginApi = (params: Address) => http.get('/store/nearest',params);