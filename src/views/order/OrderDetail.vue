<template>
    <div class="orderDetal">
        <head-nav>
            <template #default>订单详情</template>
        </head-nav>

        <div class="main">
            <template v-for="item of orderMsg?.orderDetails?.data" :key="item.id">
                <good-card :num="item.num" :goodMsg="item.goods"></good-card>
            </template>

            <div class="confirm">
                <p>订单状态：{{ orderStatus[orderMsg.status - 1] }}</p>
                <p>订单编号：{{ orderMsg.order_no }}</p>
                <p>下单时间：{{ orderMsg.created_at }}</p>
            </div>
            <div class="delivery">
                <p>商品总金额：{{ orderMsg.amount }}</p>
                <p>配送地址：{{ sendToWhere }}</p>
                <p>配送方式：{{ orderMsg.express_type || "暂未发货" }}</p>
            </div>
            <div class="recommend">
                <van-button type="primary" v-if="!(orderMsg.status - 1)" @click="toPay">
                    去支付
                </van-button>
                <van-button>确认订单</van-button>
            </div>
        </div>
        <pay v-model:show="showPay" :orderID="orderMsg.id" @changeShowPay="changeShowPay"></pay>
    </div>
</template>

<script>
export default {
    name: "orderDetail",
};
</script>

<script setup>
import { computed, onMounted, ref } from "@vue/runtime-core";
import HeadNav from "components/common/HeadNav";
import GoodsList from "components/content/goods/GoodsList";
import GoodCard from "./components/GoodCard.vue";
import Pay from "./components/Pay";
import { getOrderMsg } from "network/order";
import { useRouter, useRoute } from "vue-router";
import { Toast } from "vant";
const router = useRouter();
const route = useRoute();
const props = defineProps({});
const emit = defineEmits([]);

// todo获取订单信息
// *===================↓↓↓↓↓↓===================* //
const orderStatus = ["待支付", "支付完成", "已发货", "已收货", "已过期"];
let orderID = route.params.id;
let orderMsg = ref({});
onMounted(() => {
    getOrderMsg(orderID).then(
        (res) => {
            if (res.status < 400) {
                orderMsg.value = res.data;
            }
        },
        (error) => {
            if (error == 404) {
                Toast("没有该订单");
                setTimeout(() => {
                    router.go(-1);
                }, 1000);
            }
        }
    );
});
let sendToWhere = computed(() => {
    let address = orderMsg.value?.address || {};
    return `${address.province} ${address.city} ${address.county} ${address.address}`;
});
// *===================↑↑↑↑↑↑===================* //

// todo支付
// *===================↓↓↓↓↓↓===================* //
let showPay = ref(false);
function toPay() {
    showPay.value = true;
}
function changeShowPay(value) {
    showPay.value = value;
}
// *===================↑↑↑↑↑↑===================* //

defineExpose({});
</script>

<style lang="less" scoped>
.main {
    background-color: rgb(204, 193, 193);
    > div {
        background-color: white;
        margin-bottom: 11px;
    }
}
.confirm {
    padding: 5px 13px;
}
.delivery {
    padding: .confirm[padding];
}
.recommend {
    padding-top: 5px;
    .van-button {
        width: 45vw;
        display: block;
        margin: 8px auto;
    }
}
</style>
