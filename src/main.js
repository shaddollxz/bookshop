import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { Button, Swipe, SwipeItem, Lazyload } from "vant";

createApp(App)
    .use(Button)
    .use(Swipe)
    .use(SwipeItem)
    .use(Lazyload)
    .use(store)
    .use(router)
    .mount("#app");
