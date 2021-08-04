import { Notify } from "vant";
import request from "./request";

function register({ name, email, password, password_confirmation }) {
    return request({
        method: "post",
        url: "/api/auth/register",
        data: {
            name,
            email,
            password,
            password_confirmation,
        },
    });
}

function login({ email, password }) {
    return request({
        method: "post",
        url: "/api/auth/login",
        data: { email, password },
    });
}

function logout() {
    return request({ url: "/api/auth/logout", method: "post" });
}

function getUserMsg() {
    return request({
        url: "/api/user",
        method: "get",
    });
}

export { register, login, logout, getUserMsg };
