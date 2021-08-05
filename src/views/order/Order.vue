<template>
    <div class="order">
        <head-nav>
            <template #default>我的订单</template>
        </head-nav>

        <div class="main">
            <tab-card :tabs="tabs" @tabClick="tabClick"></tab-card>

            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <div
                    class="orderItem"
                    v-for="item of orderList"
                    :key="item?.id"
                    @click="toDetail(item.id)"
                >
                    <div class="baseMsg">
                        <p>订单编号：{{ item.order_no }}</p>
                        <p>下单时间：{{ item.created_at }}</p>
                    </div>
                    <div class="amount">
                        <p>总价：￥{{ item.amount }}</p>
                        <p>订单状态：{{ orderStatus[item.status - 1] }}</p>
                    </div>
                    <template v-for="(good, index) of item.goods.data" :key="good">
                        <good-card
                            :goodMsg="good"
                            :num="item.orderDetails.data[index].num"
                        ></good-card>
                    </template>
                </div>
            </van-list>
        </div>
    </div>
</template>

<script setup>
import {
    computed,
    nextTick,
    onBeforeMount,
    onMounted,
    reactive,
    ref,
    watch,
} from "@vue/runtime-core";
import HeadNav from "components/common/HeadNav";
import TabCard from "components/content/TabCard";
import GoodCard from "./components/GoodCard";
import { getOrderList } from "network/order";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const props = defineProps({});
const emit = defineEmits([]);

// todo标签栏
// *===================↓↓↓↓↓↓===================* //
const orderStatus = ["待支付", "支付完成", "已发货", "已收货", "已过期"];
// *===================↑↑↑↑↑↑===================* //

// todo初始化及下拉刷新
// *===================↓↓↓↓↓↓===================* //
let loading = ref(false);
let finished = ref(false);
let isFirstTime = true;
let total_pages;
let lock = true; //? list组件不知道为啥会一直刷新，手动用锁解决
let allOrder = reactive([]); //? 展示的数据根据这个数组筛选
async function onLoad() {
    //! 先请求一次获得所有页数 然后倒序拿到数据
    if (isFirstTime) {
        const { data } = await getOrderList();
        total_pages = data.meta.pagination.total_pages;
        isFirstTime = false;
        console.log(total_pages);
    }
    if (lock) {
        lock = false;
        const { data } = await getOrderList({
            page: total_pages--,
            include: "goods,orderDetails",
        });
        console.log(total_pages);
        allOrder.push(...data.data);
        lock = true;
        if (!total_pages) {
            finished.value = true;
        }
    }
}
// *===================↑↑↑↑↑↑===================* //

// todo菜单切换
// *===================↓↓↓↓↓↓===================* //
const tabs = reactive(["全部", "待支付", "支付完成", "已发货", "已收货", "已过期"]);
let index = ref(0);
function tabClick(newValue) {
    index.value = newValue;
}
let orderList = computed(() => {
    return allOrder
        .filter((value) => {
            if (index.value == 0) {
                return true;
            } else {
                return value.status == index.value;
            }
        })
        .sort((a, b) => {
            let atime = Date.parse(a.created_at);
            let btime = Date.parse(b.created_at);
            return btime - atime;
        });
});
// *===================↑↑↑↑↑↑===================* //

// todo跳转页面
// *===================↓↓↓↓↓↓===================* //
function toDetail(id) {
    router.push("/orderDetail/" + id);
}
// *===================↑↑↑↑↑↑===================* //
defineExpose({});
</script>

<style lang="less" scoped>
.tabCard {
    font-size: 0.8rem;
}
.tabCard {
    position: relative;
}
.van-list {
    .orderItem {
        background-color: wheat;
        font-size: 0.8rem;
        padding: 5px 10px;
        margin-bottom: 10px;
        .amount {
            font-size: 1.1rem;
        }
    }
}
</style>
