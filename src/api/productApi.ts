import http from "@/utils/http";

namespace Product {

  export interface id {

    productId : number;

  }

}

// 查询商品详情
export const productDetailApi = (params: Product.id) => http.get("/api/product/productDetail", params);

