<template>
    <head-nav>
        <template #default>分类</template>
    </head-nav>

    <div class="main">
        <div class="left">
            <van-sidebar v-model="activeKey">
                <van-collapse v-model="activeName" accordion>
                    <van-collapse-item
                        v-for="value of categoryIds"
                        :key="value.id"
                        :title="value.name"
                        :name="value.name"
                    >
                        <van-sidebar-item
                            @click="choseGoodsClass(item.id)"
                            v-for="item of value.children"
                            :key="item.id"
                            :title="item.name"
                        ></van-sidebar-item>
                    </van-collapse-item>
                </van-collapse>
            </van-sidebar>
        </div>
        <div class="right">
            <div class="order">
                <van-tabs v-model="orderActive" @click="orderBy">
                    <van-tab title="销量排序"></van-tab>
                    <van-tab title="价格排序"></van-tab>
                    <van-tab title="评论排序"></van-tab>
                </van-tabs>
            </div>
            <div class="goodsList wrapper" ref="wrapper">
                <div class="content">
                    <template
                        v-for="(item, index) of getGoodsData.dataCatch[currentPage].list"
                        :key="index"
                    >
                        <van-card
                            @click="goDetali(item.id)"
                            :num="2"
                            :price="item.price"
                            :desc="'已售出：' + item.sales"
                            :title="item.title"
                            :thumb="item.cover_url"
                        />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getCategoryData, getByClass, getByOrder } from "network/category";
import HeadNav from "components/common/HeadNav";
import { reactive, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import BetterScroll from "better-scroll";
import { throttle } from "../../util/SDT";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();

// todo通过状态模式集成获得数据的方法
// *===================↓↓↓↓↓↓===================* //
class GetGoodsData {
    constructor() {
        this.dataCatch = {
            sales: {
                list: [],
                page: 0,
            },
        };
        this.stateCatch = [getByOrder, "sales", 1];
    }
    //! 因为缓存获得的数据是异步执行的，所以判断有无以缓存数据得单独写成一个函数在同步中初始化
    addNewDataCatch(type) {
        if (!this.dataCatch[type]) {
            this.dataCatch[type] = { page: 1 };
            this.dataCatch[type].list = [];
        }
    }
    catchData(type, data) {
        if (this.dataCatch[type]) {
            this.dataCatch[type].list.push(...data);
            this.dataCatch[type].page += 1;
        }
    }
    run(fn, currentPage, page) {
        this.stateCatch.length = 0;
        this.stateCatch.push(fn, currentPage, page);
        return fn(currentPage, page);
    }
    runCatch() {
        this.stateCatch[0](this.stateCatch[1], (this.stateCatch[2] += 1)).then(({ data }) => {
            this.dataCatch[currentPage.value].list.push(...data.goods.data);
        });
    }
}
const getGoodsData = reactive(new GetGoodsData());
let currentPage = ref("sales");
// *===================↑↑↑↑↑↑===================* //

// todo获得分类数据
// *===================↓↓↓↓↓↓===================* //
let activeKey = ref(0);
const activeName = ref("");

const categoryIds = ref([]);
onMounted(() => {
    getCategoryData().then(({ data }) => {
        categoryIds.value = data.categories;
        getGoodsData.catchData(currentPage.value, data.goods.data);
    });
});

// todo根据分类显示商品
function choseGoodsClass(category_id) {
    console.log(category_id);
    if (!getGoodsData.dataCatch[(currentPage.value = category_id)]) {
        getGoodsData.addNewDataCatch(currentPage.value);
        getGoodsData.run(getByClass, currentPage.value).then(({ data }) => {
            getGoodsData.catchData(currentPage.value, data.goods.data);
        });
    }
}
// *===================↑↑↑↑↑↑===================* //

// todo获得排序商品
// *===================↓↓↓↓↓↓===================* //
const orderActive = ref(0);
const orderTypes = ["sales", "price", "comments_count"];
function orderBy(index) {
    if (!getGoodsData.dataCatch[(currentPage.value = orderTypes[index])]) {
        getGoodsData.addNewDataCatch(currentPage.value);
        getGoodsData.run(getByOrder, currentPage.value).then(({ data }) => {
            getGoodsData.catchData(currentPage.value, data.goods.data);
        });
    }
}
// *===================↑↑↑↑↑↑===================* //

// todo下拉加载
// *===================↓↓↓↓↓↓===================* //
const wrapper = ref(null);
onMounted(() => {
    const bs = new BetterScroll(wrapper.value, { probeType: 3, click: true, pullUpLoad: true });
    bs.on("scroll", ({ y }) => {});
    //? 上拉时触发
    bs.on(
        "pullingUp",
        throttle(() => {
            console.log("use");
            getGoodsData.runCatch();
            bs.finishPullUp();
            bs.refresh();
        }, 200)
    );
});
// *===================↑↑↑↑↑↑===================* //

// todo跳转到商品详情页
// *===================↓↓↓↓↓↓===================* //
function goDetali(id) {
    router.push({ path: "/detali", query: { id } });
}
// *===================↑↑↑↑↑↑===================* //
defineExpose({});
</script>

<style lang="less" scoped>
.main {
    display: flex;
    .left {
        flex: 1;
        .van-sidebar {
            width: 100%;
        }
    }
    .right {
        position: relative;
        height: calc(100vh - var(--height-foot) - var(--height-head));
        flex: 2.3;
        .order {
            height: 40px;
        }
        .goodsList {
            gap: 3px 0;
            position: absolute;
            width: 100%;
            right: 0;
            left: auto;
            top: .order[height];
            bottom: 0;
            overflow: hidden;
        }
    }
}
</style>
