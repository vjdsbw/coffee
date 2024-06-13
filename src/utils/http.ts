import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    noLoading?: boolean;
}

enum ResultEnum {
    SUCCESS = 200,
    ERROR = 500,
    OVERDUE = 401,
    TIMEOUT = 3000,
    TYPE = 'success'
}

// 请求响应参数
interface ResultData {
    code: number;
    msg: string;
    data?: any;
}

const config = {
    // 默认地址请求地址，可在 .env.** 文件中修改
    baseURL: (import.meta as any).env.VITE_API_URL,
    // 设置超时时间Property 'env' does not exist on type 'ImportMe
    timeout: ResultEnum.TIMEOUT as number,
    // 跨域时候允许携带凭证
    withCredentials: true
};

//校验网络请求状态码
// const checkStatus = (status: number) => {
//     switch (status) {
//         case 400:
//             Message('请求失败！请您稍后重试', { type: 'error' });
//             break;
//         case 401:
//             Message('登录失效！请您重新登录', { type: 'error' });
//             break;
//         case 403:
//             Message('当前账号无权限访问！', { type: 'error' });
//             break;
//         case 404:
//             Message('你所访问的资源不存在！', { type: 'error' });
//             break;
//         case 405:
//             Message('请求方式错误！请您稍后重试', { type: 'error' });
//             break;
//         case 408:
//             Message('请求超时！请您稍后重试', { type: 'error' });
//             break;
//         case 500:
//             Message('服务异常！', { type: 'error' });
//             break;
//         case 502:
//             Message('网关错误！', { type: 'error' });
//             break;
//         case 503:
//             Message('服务不可用！', { type: 'error' });
//             break;
//         case 504:
//             Message('网关超时！', { type: 'error' });
//             break;
//         default:
//             Message('请求失败', { type: 'error' });
//     }
// };

class RequestHttp {
    service: AxiosInstance;
    public constructor(config: AxiosRequestConfig) {
        // instantiation
        this.service = axios.create(config);
        console.log(config, 'service');
        //请求拦截器 token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
        this.service.interceptors.request.use(
            (config: CustomAxiosRequestConfig) => {
                // const { user } = Store();
                // if (config.headers && typeof config.headers.set === 'function' && user.token) {
                //     config.headers.set('x-access-token', user.token);
                // }
                return config;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        //响应拦截器 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息/
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const { data } = response;
                // const { user } = Store();
                // // 登陆失效
                // if (data.code === ResultEnum.OVERDUE) {
                //     user.setToken('');
                //     router.replace('/login');
                //     Message(data.msg, { type: 'error' });
                //     return data;
                // }
                // // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
                // if (data.code && data.code !== ResultEnum.SUCCESS) {
                //     Message(data.msg, { type: 'error' });
                //     return data;
                // }
                // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
                return data;
            },
            async (error: AxiosError) => {
                // const { response } = error;
                // // 请求超时 && 网络错误单独判断，没有 response
                // if (error.message.indexOf('timeout') !== -1) Message('请求超时！请您稍后重试', { type: 'error' });
                // if (error.message.indexOf('Network Error') !== -1) Message('网络错误！请您稍后重试', { type: 'error' });
                // // 根据服务器响应的错误状态码，做不同的处理
                // if (response) checkStatus(response.status);
                // // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
                // if (!window.navigator.onLine) router.replace('/500');
                return Promise.reject(error);
            }
        );
    }

    //常用请求方法封装
    get(url: string, params?: object, _object = {}): Promise<ResultData> {
        return this.service.get(url, { params, ..._object });
    }
    post(url: string, params?: object | string, _object = {}): Promise<ResultData> {
        return this.service.post(url, params, _object);
    }
    put(url: string, params?: object, _object = {}): Promise<ResultData> {
        return this.service.put(url, params, _object);
    }
    deletea(url: string, params?: any, _object = {}): Promise<ResultData> {
        return this.service.delete(url, { params, ..._object });
    }
    download(url: string, params?: object, _object = {}): Promise<BlobPart> {
        return this.service.post(url, params, { ..._object, responseType: 'blob' });
    }
}

export default new RequestHttp(config);
