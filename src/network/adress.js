import request from "./request";

function getAddress() {
    return request({
        url: "/api/address",
        method: "get",
    });
}

function addAddress({ name, address, phone, province, city, county, is_default }) {
    return request({
        url: "/api/address",
        method: "post",
        data: {
            name,
            address,
            phone,
            province,
            city,
            county,
            is_default,
        },
    });
}

function changeAddress(id, data) {
    return request({
        url: "/api/address/" + id,
        method: "put",
        data,
    });
}

function deleteAddress(address) {
    return request({
        url: "/api/address/" + address,
        method: "delete",
    });
}

function getAddressMsg(id) {
    return request({
        url: "/api/address/" + id,
        method: "get",
    });
}

export { getAddress, addAddress, getAddressMsg, changeAddress, deleteAddress };
