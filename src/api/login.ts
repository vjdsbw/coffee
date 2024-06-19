import http from '@/utils/http';
import qs from 'qs'

interface LoginForm {
    appkey:string;
    phone: string;
    password: string;
}

// 登录
export const loginApi = (params: LoginForm) => http.post('/login', qs.stringify(params));

// 获取菜单列表
export const findMyApi = (params: {tokenString: string}) => http.get('/findMy',params);

// 获取按钮权限
export const getAuthButtonListApi = () => http.get('/geeker/auth/buttons');

// 用户户退出登录
export const logoutApi = () => http.post('/geeker/logout');// 用户户退出登录
