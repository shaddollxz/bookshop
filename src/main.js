import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import {
    Button,
    Swipe,
    SwipeItem,
    Lazyload,
    Badge,
    Sidebar,
    SidebarItem,
    Collapse,
    CollapseItem,
    Tab,
    Tabs,
    Card,
    Tag,
    Image as VanImage,
} from "vant";

createApp(App)
    .use(Button)
    .use(Swipe)
    .use(SwipeItem)
    .use(Badge)
    .use(Sidebar)
    .use(SidebarItem)
    .use(Collapse)
    .use(CollapseItem)
    .use(Tab)
    .use(Tabs)
    .use(Card)
    .use(VanImage)
    .use(Tag)
    .use(Lazyload, {
        loading: "img/logo.png",
    })
    .use(store)
    .use(router)
    .mount("#app");
