import http from '@/utils/http';

// 首页轮播图
export const bannerApi = () => http.get('/banner');

// 获取菜单列表
export const productsApi = (params:{key: string,value: number| string}) => http.get('/typeProducts', params);

// 购物车
export const findAllShopcartApi = (params:{tokenString: string}) => http.get('/findAllShopcart',params);

