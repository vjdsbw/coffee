import http from "@/utils/http";

namespace Store {
  export interface Address {
    lat: number;
    lon: number;
  }

  export interface id {
    storeId: number;
  }
}

// 登录 
export const loginApi = (params: Store.Address) => http.get("/api/store/nearest", params);

//查询最近门店
export const nearestApi = (params: Store.Address) => http.get("/api/store/nearest", params);

//查询门店详情
export const shopDetailApi = (params: Store.id) => http.get("/api/store/detail", params);

//查询门店列表
export const shopListApi =(params: Store.Address)=>http.get("/api/store/list",params)

//查询菜单
export const productMenuApi =(params: Store.id)=>http.get("/api/product/menuList",params)
