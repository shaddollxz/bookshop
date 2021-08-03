import { createRouter, createWebHistory } from "vue-router";
import { SDIDB } from "@/util/SDT";

function importAll(r) {
    const routes = [];
    r.keys().forEach((item) => {
        routes.push(r(item).default);
    });
    return routes;
}
const routes = importAll(require.context("./", true, /\.router\.js/));

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.needLogin && !window.localStorage.getItem("access_token")) {
        next("/login");
    }
    next();
    document.title = to.meta.title;
});

export default router;
