import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { Button, Swipe, SwipeItem, Lazyload, Badge } from "vant";

createApp(App)
    .use(Button)
    .use(Swipe)
    .use(SwipeItem)
    .use(Badge)
    .use(Lazyload, {
        loading: "img/logo.png",
    })
    .use(store)
    .use(router)
    .mount("#app");
