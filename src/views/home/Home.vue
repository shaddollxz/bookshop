<template>
    <head-nav>
        <template #default>主页</template>
    </head-nav>
    <div class="wrapper" ref="wrapper">
        <div class="content">
            <div class="headRoll"></div>
            <recommend :renderData="recommendData"></recommend>
            <tab-card @tabClick="tabClick" :tabs="tabs_cn"></tab-card>
            <keep-alive>
                <goods-list :goodsData="currentGoodsData"></goods-list>
            </keep-alive>
        </div>
    </div>
</template>

<script setup>
// todo导入
// *===================↓↓↓↓↓↓===================* //
const props = defineProps({});
const emit = defineEmits([]);
import HeadNav from "components/common/HeadNav";
import Recommend from "./components/Recommend";
import TabCard from "components/content/TabCard";
import GoodsList from "components/content/goods/GoodsList";
import { getHomeAllData, getHomeGoods } from "network/home";
import { computed, nextTick, onMounted, reactive, ref, watchEffect } from "@vue/runtime-core";
import BetterScroll from "better-scroll";
// *===================↑↑↑↑↑↑===================* //

// todo对推荐列表进行网络请求
// *===================↓↓↓↓↓↓===================* //
const recommendData = ref(null);
onMounted(() => {
    getHomeAllData().then(({ data }) => {
        recommendData.value = data.goods.data;
    });
});
// *===================↑↑↑↑↑↑===================* //

// todo下拉商品列表的且换
// *===================↓↓↓↓↓↓===================* //
const tabs_cn = ["畅销", "新书", "精选"];
const tabs_en = ["sales", "new", "recommend"];
let currentPage = ref("sales");
function tabClick(item) {
    currentPage.value = tabs_en[item];
    getHomeGoods(currentPage.value, goodsData.sales.page).then(({ data }) => {
        goodsData[currentPage.value].list = data.goods.data;
    });
}
// *===================↑↑↑↑↑↑===================* //

// todo对下拉商品数据进行网络请求
// *===================↓↓↓↓↓↓===================* //
const goodsData = reactive({
    sales: { page: 1, list: [] },
    recommend: { page: 1, list: [] },
    new: { page: 1, list: [] },
});
const currentGoodsData = computed(() => {
    return goodsData[currentPage.value].list;
});
onMounted(() => {
    getHomeGoods("sales", goodsData.sales.page).then(({ data }) => {
        goodsData.sales.list = data.goods.data;
    });
});
// *===================↑↑↑↑↑↑===================* //

// todo滑动加载 使用了better-scroll
// *===================↓↓↓↓↓↓===================* //
const wrapper = ref(null);
let bs;
onMounted(() => {
    bs = new BetterScroll(wrapper.value, {
        probeType: 3,
        click: true,
        pullUpLoad: true,
        pullDownRefresh: true,
    });
    bs.on("scroll", ({ y }) => {});
    bs.on("pullingUp", () => {
        console.log("use");
        bs.refresh();
    });
});
watchEffect(async () => {
    await nextTick();
    bs.refresh();
});
// *===================↑↑↑↑↑↑===================* //
defineExpose({});
</script>

<style lang="less" scoped>
.headRoll {
    height: 230px;
    width: 100%;
    background-color: wheat;
    img {
        width: 100%;
        height: auto;
    }
}
.recommend {
    padding-bottom: 5px;
}
.wrapper {
    position: absolute;
    top: var(--height-head);
    bottom: var(--height-foot);
    left: 0;
    right: 0;
    overflow: hidden;
    .content {
        position: relative;
    }
}
</style>
