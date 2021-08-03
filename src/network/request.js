/*
 * @Author: shaddollxz
 * @Date: 2021-07-31 15:19:54
 * @LastEditTime: 2021-08-02 22:36:35
 * @Description: 全局的axios请求封装
 */

import axios from "axios";

export default function request(options) {
    const instance = axios.create({
        baseURL: "https://api.shop.eduwork.cn/",
        timeout: 3000,
    });

    instance.interceptors.request.use(
        (req) => {
            let token;
            if ((token = window.localStorage.getItem("access_token"))) {
                req.headers.Authorization = "Bearer " + token;
            }
            return req;
        },
        (error) => {}
    );

    instance.interceptors.response.use(
        (res) => {
            return res;
        },
        (error) => {
            if (error) {
                try {
                    if (error.response?.status == 401) {
                        return Promise.reject("登录后再尝试进行操作");
                    }
                    if (error.response?.data) {
                        return Promise.reject(
                            error.response.data.errors[
                                Object.keys(error.response.data.errors)[0]
                            ][0]
                        );
                    }
                } catch {}
            }
        }
    );

    return instance(options);
}
