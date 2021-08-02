export default {
    path: "/login",
    name: "login",
    component: () => import("@/views/personal/Login"),
    meta: {
        title: "用户登录",
    },
};
