import http from "@/utils/http.ts";

export namespace userType {
    export interface shortCode {
        couponId: string
        uid: string

    }
}


// 生成短链
export const generateShortCodeApi = (params: userType.shortCode) => http.get("/console/shortCode/generate", params);
// 获取卡券列表
export const getCouponListApi = () => http.get("/console/coupon/getCouponList");

// 查询我的订单列表
export const getOrderListApi = () => http.get("/api/order/orderList");
