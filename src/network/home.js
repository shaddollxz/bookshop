/*
 * @Author: shaddollxz
 * @Date: 2021-07-31 15:26:22
 * @LastEditTime: 2021-07-31 15:43:08
 * @Description: home页面需要的网络请求函数
 */
import request from "./request";

function getHomeAllData() {
    return request({
        url: "/api/index",
    });
}

export { getHomeAllData };
