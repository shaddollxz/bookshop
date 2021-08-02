import request from "./request";

function getCategoryData(page = 1) {
    return request({
        url: "/api/goods",
        params: {
            page,
        },
    });
}

function getByOrder(type, page, isreverse = false) {
    return request({
        url: "/api/goods",
        params: {
            [type]: isreverse ? 0 : 1,
            page,
        },
    });
}

function getByClass(category_id, page) {
    return request({
        url: "/api/goods",
        params: {
            category_id,
            page,
        },
    });
}

export { getCategoryData, getByClass, getByOrder };
