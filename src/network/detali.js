import request from "./request";

function getGoodsMsg(id) {
    return request({
        url: "/api/goods/" + id,
    });
}

export { getGoodsMsg };
