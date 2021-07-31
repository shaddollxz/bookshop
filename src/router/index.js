import { createRouter, createWebHistory } from "vue-router";

function importAll(r) {
    const routes = [];
    r.keys().forEach((item) => {
        routes.push(r(item).default);
    });
}
const routes = importAll(require.context("./", true, /\.router\.js/));

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
