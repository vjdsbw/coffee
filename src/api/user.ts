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

    export interface replaceUid {
        newUid: string;
        oldUid: string
    }

    export interface CreatedShort {
        pageNo: number;
        pageSize: number;
        status: number;
    }

    export interface CouponDataPage {
        pageNo: number;
        pageSize: number;
    }

    export interface generateByNum {
        couponNum: number;
        dataId: string;
    }
    export interface CouponNoPage {
        pageNo: number;
        pageSize: number;
        uid: string;
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

// 批量生成短链
export const batchGenerateApi = (params: userType.generateUrlList) => http.post("/console/shortCode/batchGenerate", params);

// 查询已过期uid列表    
export const logoutUidApi = () => http.get("/console/logoutUid/list");

//替换已过期的uid
export const replaceUidApi = (params: userType.replaceUid) => http.post("/console/logoutUid/replace", params);

//分页查询短链
export const createdShortApi = (params: userType.CreatedShort) => http.get("/console/shortCode/pageList", params);

// 查询可用券数量
export const availableCountApi = () => http.get("/console/coupon/availableCount");

// 查询已下单数量
export const usedCountApi = () => http.get("/console/coupon/usedCount");

// 分页获取卡券数据列表
export const couponDataPageListApi = (params: userType.CouponDataPage) => http.get("/console/coupon/getCouponDataPageList", params);

//根据数量生成短链
export const generateByNumApi = (params: userType.generateByNum) => http.post("/console/shortCode/generateByNum", params);

//分页获取卡券编号列表 
export const couponNoPageListApi = (params: userType.CouponNoPage) => http.get("/console/coupon/getCouponNoPageList", params);

//删除链接
export const deleteUrlApi = (params: { url: string }) => http.post("/console/shortCode/deleteUrl", params);

// 查询链接状态
export const queryUrlStatusApi = (params: { url: string }) => http.get("/console/shortCode/queryUrlStatus", params);

// 查询手机号关联券使用情况 
export const couponPhoneDataApi = () => http.get("/console/coupon/couponPhoneData");

//刷新链接 
export const couponByUidApi = () => http.get("/console/coupon/refresh/couponByUid");