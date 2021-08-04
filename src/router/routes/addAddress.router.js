export default {
    path: "/addAddress",
    name: "addAddress",
    component: () => import("@/views/address/NewAddress"),
    meta: {
        title: "新增地址",
    },
};
