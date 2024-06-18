import http from '@/utils/http';

// interface LoginForm {
//     username: string;
//     password: string;
// }

// 首页轮播图
export const bannerApi = () => http.get('/banner');

// 获取菜单列表
export const productsApi = (params:{key: string,value: number| string}) => http.get('/typeProducts', params);

// 获取按钮权限
export const getAuthButtonListApi = () => http.get('/geeker/auth/buttons');

// 用户户退出登录
export const logoutApi = () => http.post('/geeker/logout');