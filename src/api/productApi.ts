import http from "@/utils/http";

namespace Product {

  export interface proId {
    productId: number;
  }

  export interface priceCal {
    storeId: number
    productId: string;
    selectedAttrList: { attrCode: string, itemCode: string }[],
  }

  export interface addCard {
    amount: number
    price: string;
    storeId: number
    productId: string;
    selectedAttrList: { attrCode: string, itemCode: string }[],
  }

  export interface storeId {
    storeId: number
  }
  export interface removeId {
    id: string
  }
  export interface updateAmount{
    id: string,
    num: number
  }

}

// 查询商品详情
export const productDetailApi = (params: Product.proId) => http.get("/api/product/productDetail", params);

// 选择SKU后计算价格  
export const productPriceCalApi = (params: Product.priceCal) => http.post("/api/product/productPriceCal", params);

// 加入购物车 
export const addCartApi = (params: Product.addCard) => http.post("/api/product/shoppingCart/add", params);

//查询购物车列表
export const cartListApi = (params: Product.storeId) => http.get("/api/product/shoppingCart/list", params);

//删除购物车商品
export const removeProductApi = (params: Product.removeId) => http.post("/api/product/shoppingCart/removeProduct", params);

//修改购物车商品数量
export const updateProductAmountApi = (params: Product.updateAmount) => http.post("/api/product/shoppingCart/updateAmount", params);

//可购买的最高价格 
export const purchasablePriceApi = () => http.get("/api/product/purchasablePrice");