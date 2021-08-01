<template>
    <head-nav>
        <template #default>主页</template>
    </head-nav>
    <tab-card v-show="beFixed" @tabClick="tabClick" :tabs="tabs_cn"></tab-card>
    <div class="wrapper" ref="wrapper">
        <div class="content">
            <div ref="headRollAndRecommend">
                <swiper :Urls="urls"></swiper>
                <recommend :renderData="recommendData"></recommend>
            </div>
            <tab-card v-show="!beFixed" @tabClick="tabClick" :tabs="tabs_cn"></tab-card>
            <goods-list :goodsData="currentGoodsData"></goods-list>
        </div>
    </div>
    <back-to-top v-show="beFixed" @rollTo="rollTo"></back-to-top>
</template>

<script setup>
// todo导入
// *===================↓↓↓↓↓↓===================* //
const props = defineProps({});
const emit = defineEmits([]);
import Swiper from "./components/Swiper";
import BackToTop from "components/common/BackToTop";
import HeadNav from "components/common/HeadNav";
import Recommend from "./components/Recommend";
import TabCard from "components/content/TabCard";
import GoodsList from "components/content/goods/GoodsList";

import { getHomeAllData, getHomeGoods } from "network/home";
import { computed, nextTick, onMounted, reactive, ref, watchEffect } from "@vue/runtime-core";
import BetterScroll from "better-scroll";
// *===================↑↑↑↑↑↑===================* //

// todo请求轮播图地址
// *===================↓↓↓↓↓↓===================* //
const urls = reactive([]);
// *===================↑↑↑↑↑↑===================* //

// todo对推荐列表进行网络请求
// *===================↓↓↓↓↓↓===================* //
const recommendData = ref(null);
onMounted(() => {
    getHomeAllData().then(({ data }) => {
        recommendData.value = data.goods.data;
        urls.push(...data.slides);
    });
});
// *===================↑↑↑↑↑↑===================* //

// todo对下拉商品数据进行网络请求
// *===================↓↓↓↓↓↓===================* //
const goodsData = reactive({
    sales: { page: 1, list: [], isLoaded: true },
    recommend: { page: 1, list: [], isLoaded: false },
    new: { page: 1, list: [], isLoaded: false },
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

// todo下拉商品列表的切换
// *===================↓↓↓↓↓↓===================* //
const tabs_cn = ["畅销", "新书", "精选"];
const tabs_en = ["sales", "new", "recommend"];
let currentPage = ref("sales");
function tabClick(item) {
    currentPage.value = tabs_en[item];
    //? 首次点击时请求数据，以后的数据从下拉里获得
    if (!goodsData[currentPage.value].isLoaded) {
        getHomeGoods(currentPage.value, goodsData.sales.page).then(({ data }) => {
            goodsData[currentPage.value].list = data.goods.data;
            goodsData[currentPage.value].isLoaded = true;
        });
    }
    bs.refresh();
}
// *===================↑↑↑↑↑↑===================* //

// todo滑动加载 使用了better-scroll
// *===================↓↓↓↓↓↓===================* //
const wrapper = ref(null);
const headRollAndRecommend = ref(null);
let beFixed = ref(false);
let bs;
onMounted(() => {
    bs = new BetterScroll(wrapper.value, {
        probeType: 3,
        click: true,
        pullUpLoad: true,
    });
    bs.on("scroll", ({ y }) => {
        beFixed.value = -y > headRollAndRecommend.value.offsetHeight;
    });
    //? 上拉时触发
    bs.on("pullingUp", () => {
        getHomeGoods(currentPage.value, (goodsData[currentPage.value].page += 1)).then(
            ({ data }) => {
                goodsData[currentPage.value].list.push(...data.goods.data);
            }
        );
        bs.finishPullUp();
        bs.refresh();
    });
});
// *===================↑↑↑↑↑↑===================* //

// todo滚动到顶部
// *===================↓↓↓↓↓↓===================* //
function rollTo() {
    bs.scrollTo(0, 0, 500);
}
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
.tabCard {
    z-index: 999;
}
.wrapper {
    position: absolute;
    top: var(--height-head);
    bottom: var(--height-foot);
    left: 0;
    right: 0;
    overflow: hidden;
}
.backToTop {
    position: fixed;
    right: 20px;
    bottom: calc(var(--height-foot) + 20px);
}
</style>
