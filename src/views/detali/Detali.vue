<template>
    <div class="detali">
        <head-nav>
            <template #default>商品详情 {{ id }}</template>
        </head-nav>

        <van-image width="100" height="100" lazy-load :src="goodMsg.detali.cover_url" />

        <van-card
            :num="goodMsg.detali.stock"
            :price="goodMsg.detali.price + '.00'"
            :desc="goodMsg.detali.description"
            :title="goodMsg.detali.title"
            :thumb="goodMsg.detali.cover_url"
        >
            <template #tags>
                <van-tag plain type="danger">标签</van-tag>
                <van-tag plain type="danger">标签</van-tag>
            </template>
            <template #footer>
                <van-button size="small" type="info">加入购物车</van-button>
                <van-button size="small" type="danger">直接购买</van-button>
            </template>
        </van-card>

        <van-tabs v-model="tagActive">
            <van-tab title="概述" class="detalis">
                <div v-html="goodMsg.detali.details"></div>
            </van-tab>
            <van-tab title="热评">
                <div v-for="value of goodMsg.detali.comments" :key="value">
                    {{ value }}
                </div>
            </van-tab>
            <van-tab title="相似图书">
                <!-- 这里的数据的收藏与首页的不同 -->
                <goods-list :goodsData="goodMsg.like"></goods-list>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
export default {
    name: "detali",
};
</script>

<script setup>
const props = defineProps({});
const emit = defineEmits([]);
import { reactive, ref, toRef } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import HeadNav from "components/common/HeadNav";
import { useRouter, useRoute } from "vue-router";
const route = useRoute();
import { getGoodsMsg } from "network/detali";
import GoodsList from "components/content/goods/GoodsList";

// todo获得商品的详情
// *===================↓↓↓↓↓↓===================* //
const id = route.query.id;
const goodMsg = reactive({
    detali: {},
    like: {},
});
onMounted(() => {
    getGoodsMsg(id).then(({ data }) => {
        goodMsg.detali = data.goods;
        goodMsg.like = data.like_goods;
        console.log(goodMsg.detali.comments);
    });
});
// *===================↑↑↑↑↑↑===================* //

// todo
// *===================↓↓↓↓↓↓===================* //
const tagActive = ref(0);
// *===================↑↑↑↑↑↑===================* //
</script>

<style lang="less" scoped>
.detali {
    .van-image {
        height: auto !important;
        width: 100% !important;
    }
}
</style>
