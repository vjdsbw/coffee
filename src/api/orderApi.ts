import http from "@/utils/http";

namespace Order {

    export interface Cancel {
        orderChild: string;
        orderId: string;
        uid: string
    }

    export interface Create {
        productList: any;
        storeId: number;
    }

    export interface Detail {
        code: string;
        orderId: string;
    }

    export interface OrderList {
        code: string;
    }
}

//  取消订单  /api/order/createOrder 创建订单前预校验订单
export const cancelOrderApi = (params: Order.Cancel) => http.get("/api/order/cancelOrder", params);

//  创建订单  
export const createOrderApi = (params: Order.Create) => http.post("/api/order/createOrder", params);

// 查询取餐码 
export const orderDetailApi = (params: Order.Detail) => http.get("/api/order/orderDetail", params);

// 查询我的订单列表 
export const orderListApi = (params: Order.Detail) => http.get("/api/order/orderList", params);

// 预创建订单 
export const preCreateOrderApi = (params: Order.Create) => http.post("/api/order/orderPreview", params);

//取消订单 
export const orderCancelApi = () => http.post("/api/order/orderCancel");
