export default {
    path: "/home",
    name: "Home",
    component: () => import("views/home/Home"),
    meta: {
        title: "主页",
    },
};
