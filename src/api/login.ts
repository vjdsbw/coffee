import http from '@/utils/http';

interface LoginForm {
    username: string;
    password: string;
}

// 首页轮播图
export const loginApi = (params: LoginForm) => http.get('/banner', params);

// 获取菜单列表
export const getAuthMenuListApi = () => http.get('/geeker/menu/list');

// 获取按钮权限
export const getAuthButtonListApi = () => http.get('/geeker/auth/buttons');

// 用户户退出登录
export const logoutApi = () => http.post('/geeker/logout');
