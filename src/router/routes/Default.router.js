export default {
    path: "/",
    name: "Default",
    component: () => import("views/home/Home"),
    meta: {
        title: "主页",
    },
};
