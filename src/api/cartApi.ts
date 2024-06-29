import http from "@/utils/http";

export namespace Cart {

    export interface cartList {
        storeId: number;
        code?: string
    }

    export interface cart {

    }

}

// 查询购物车列表
export const cartListApi = (params: Cart.cartList) => http.get("api/product/shoppingCart/list", params);

//提交订单
