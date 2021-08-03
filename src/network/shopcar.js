import request from "./request";

function addCar({ goods_id, num }) {
    return request({
        url: "/api/carts",
        method: "post",
        data: { goods_id, num: num ?? 1 },
    });
}

function carList() {
    return request({
        url: "/api/carts?include=goods",
        method: "get",
    });
}

function changeGoodNum(id, num) {
    return request({
        url: "/api/carts/" + id,
        method: "put",
        data: {
            num,
        },
    });
}

function deleteCar(id) {
    return request({
        url: "/api/carts/" + id,
        method: "delete",
    });
}

function changeCarChose(cart_ids) {
    return request({
        url: "/api/carts/checked",
        method: "patch",
        data: {
            cart_ids,
        },
    });
}

export { addCar, carList, changeGoodNum, deleteCar, changeCarChose };
