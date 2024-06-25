import http from "@/utils/http";
import qs from "qs";

namespace Store {
  export interface Address {
    lat: number;
    lon: number;
  }

  export interface id {
    storeId: number;
  }
}

// 登录  /store/detail
export const loginApi = (params: Store.Address) => http.get("/store/nearest", params);

export const nearestApi = (params: Store.Address) => http.get("/store/nearest", params);

export const shopDetailApi = (params: Store.id) => http.get("/store/detail", params);
