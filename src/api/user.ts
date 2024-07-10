import http from "@/utils/http";

export namespace userType {
    export interface shortCode {
        couponId: string
        uid: string
        couponPrice: number
    }

    export interface bindUid {
        uidList: string[]
    }

    export interface rxLogin {
        mobile: string;
        uid: string;
        validateCode: string;
    }

    export interface rxSend {
        mobile: string;
        type: string
    }

    export interface couponList {
        pageNo: number;
        pageSize: number
    }

    export interface generateUrlList {
        couponList: [
            {
                couponId: string,
                couponPrice: number,
                uid: string
            }
        ]

    }
}

// 生成短链
export const generateShortCodeApi = (params: userType.shortCode) => http.post("/console/shortCode/generate", params);
// 获取卡券列表
export const getCouponListApi = () => http.get("/console/coupon/getCouponList");

// 查询我的订单列表
export const getOrderListApi = () => http.get("/api/order/orderList");

//  批量绑定uid
export const bindUidApi = (data: userType.bindUid) => http.post("/console/coupon/bindUid", data);

// 验证码
export const sendCodeApi = (params: userType.rxSend) => http.get("/api/notify/v1/send_code", params);
// 瑞幸登录
export const rxLoginApi = (params: userType.rxLogin) => http.get("/api/notify/v1/rx_login", params);

// 分页获取咖啡券
export const getCouponPageListApi = (params: userType.couponList) => http.get("/console/coupon/getCouponPageList", params);

// /console/shortCode/batchGenerate 批量生成短链
export const batchGenerateApi = (params: userType.generateUrlList) => http.post("/console/shortCode/batchGenerate", params);
