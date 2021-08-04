import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import {
    Checkbox,
    CheckboxGroup,
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
    Form,
    Field,
    Image as VanImage,
    Stepper,
    SwipeCell,
    Cell,
    CellGroup,
} from "vant";
import { checkerProps } from "vant/lib/checkbox/Checker";

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
    .use(Form)
    .use(Tag)
    .use(Field)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Stepper)
    .use(SwipeCell)
    .use(Cell)
    .use(CellGroup)
    .use(Lazyload, {
        loading: "img/logo.png",
    })
    .use(store)
    .use(router)
    .mount("#app");
