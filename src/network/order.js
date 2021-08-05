import request from "./request";

function createOrder(address_id) {
    return request({
        url: "/api/orders",
        method: "post",
        params: {
            address_id,
        },
    });
}

function getOrderMsg(id) {
    return request({
        url: "/api/orders/" + id,
        method: "get",
        params: {
            include: "orderDetails.goods,address",
        },
    });
}

function orderPreview() {
    return request({
        url: "/api/orders/preview",
        method: "get",
    });
}

function getOrderList(params) {
    return request({
        url: "/api/orders",
        method: "get",
        params,
    });
}

function getQRcode(id) {
    return request({
        url: "/api/orders/" + id + "/pay",
        method: "get",
        params: {
            type: "aliyun",
        },
    });
}

/**
1 	新订单
2 	支付完成
3 	已发货
4 	已确认收货
5 	已过期 
*/
function getOrderState(id) {
    return request({
        url: "/api/orders/" + id + "/status",
        method: "get",
    });
}

function isReceipt(id) {
    return request({
        url: "/api/orders/" + id + "/confirm",
        method: "patch",
    });
}

function getExpress(id) {
    return request({
        url: "/api/orders/" + id + "/express",
        method: "get",
    });
}

export { orderPreview, createOrder, getQRcode, getOrderState, getOrderList, getOrderMsg };
