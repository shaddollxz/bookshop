export default {
    path: "/orderDetail/:id",
    name: "orderDetail",
    component: () => import("@/views/order/OrderDetail"),
    meta: {
        title: "订单详情",
    },
};
