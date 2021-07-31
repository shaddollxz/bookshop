/*
 * @Author: shaddollxz
 * @Date: 2021-07-31 15:19:54
 * @LastEditTime: 2021-07-31 15:42:45
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
            return req;
        },
        (error) => {}
    );

    instance.interceptors.response.use(
        (res) => {
            return res;
        },
        (error) => {}
    );

    return instance(options);
}
