<template>
    <div class="detali">
        <head-nav>
            <template #default>商品详情</template>
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
                <van-button size="small" type="info" @click="addToCar">加入购物车</van-button>
                <van-button size="small" type="danger" @click="goOrderPage">直接购买</van-button>
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
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
const store = useStore();
import HeadNav from "components/common/HeadNav";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
import { getGoodsMsg } from "network/detali";
import GoodsList from "components/content/goods/GoodsList";
import { addCar } from "network/shopcar";
import { Toast } from "vant";

// todo获得商品的详情
// *===================↓↓↓↓↓↓===================* //
const tagActive = ref(0);
const id = route.query.id;
const goodMsg = reactive({
    detali: {},
    like: {},
});
onMounted(() => {
    getGoodsMsg(id).then(({ data }) => {
        goodMsg.detali = data.goods;
        goodMsg.like = data.like_goods;
    });
});
// *===================↑↑↑↑↑↑===================* //

// todo购物车操作
// *===================↓↓↓↓↓↓===================* //
function addToCar() {
    return new Promise((resolve, reject) => {
        addCar({ goods_id: goodMsg.detali.id })
            .then(async (res) => {
                if (res.status < 400) {
                    Toast("商品已加入购物车");
                    resolve();
                }
            })
            .catch((err) => {
                Toast.fail(err);
                reject();
            });
    });
}

function goOrderPage() {
    addToCar().then(() => {
        router.push("/preview");
    });
}
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
