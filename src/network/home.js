/*
 * @Author: shaddollxz
 * @Date: 2021-07-31 15:26:22
 * @LastEditTime: 2021-08-01 16:09:16
 * @Description: home页面需要的网络请求函数
 */
import request from "./request";

function getHomeAllData() {
    return request({
        url: "/api/index",
    });
}
function getHomeGoods(type, page) {
    return request({
        url: `/api/index`,
        params: {
            page,
            [type]: 1,
        },
    });
}

export { getHomeAllData, getHomeGoods };
