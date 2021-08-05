<template>
    <div class="orderPreview">
        <head-nav>
            <template #default>订单预览</template>
        </head-nav>

        <div class="main">
            <div class="address">
                <van-cell is-link @click="changeAddress">
                    <template #title>
                        <span>姓名：{{ address.name }}</span>
                        <span>联系电话：{{ address.phone }}</span>
                        <p>
                            地址：{{
                                `${address.province} ${address.city} ${address.county} ${address.address}`
                            }}
                        </p>
                    </template>
                </van-cell>
            </div>
        </div>
        <br />

        <div class="goods">
            <template v-for="(item, index) of carList" :key="index">
                <good-card :goodMsg="item.goods" :num="item.num"></good-card>
            </template>
        </div>

        <van-submit-bar
            :price="allPrice * 100"
            button-text="生成订单"
            @submit="onSubmit(address.id)"
        />

        <pay v-model:show="showPay" :orderID="orderId" @changeShowPay="changeShowPay"></pay>
    </div>
</template>

<script>
export default {
    name: "previewOrder",
};
</script>

<script setup>
import { computed, onMounted, reactive, ref } from "@vue/runtime-core";
import HeadNav from "components/common/HeadNav";
import GoodCard from "./components/GoodCard";
import Pay from "./components/Pay";
import { orderPreview, createOrder } from "network/order";
import { getAddressMsg } from "network/adress";
import { Toast } from "vant";
import { useStore } from "vuex";
const store = useStore();
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const props = defineProps({});
const emit = defineEmits([]);

// todo获得地址及选择的购物车信息
// *===================↓↓↓↓↓↓===================* //
const address = ref(false);
const carList = reactive([]);
let allPrice = computed(() => {
    return carList.reduce((result, current) => {
        return result + current.goods.price * current.num;
    }, 0);
});
onMounted(() => {
    orderPreview().then(({ data }) => {
        if (store.state.chosedAddressID) {
            getAddressMsg(store.state.chosedAddressID).then(({ data }) => {
                address.value = data;
            });
        } else {
            //? 地址
            data.address.forEach((item) => {
                if (item.is_default) {
                    address.value = item;
                }
            });
            //? 没有默认地址用第一个
            if (!address.value) {
                address.value = data.address[0];
            }
        }

        //? 购买的商品
        data.carts.forEach((item) => {
            if (item.is_checked) {
                carList.push(item);
            }
        });
    });
});
// *===================↑↑↑↑↑↑===================* //

// todo修改地址
// *===================↓↓↓↓↓↓===================* //
function changeAddress() {
    router.push({ path: "/address", query: { func: "chose" } });
}
// *===================↑↑↑↑↑↑===================* //

// todo提交生成
// *===================↓↓↓↓↓↓===================* //
let showPay = ref(false);
let orderId = ref(0);
function onSubmit(id) {
    createOrder(id).then((res) => {
        if (res.status == 200) {
            Toast("订单创建成功");
            showPay.value = true;
            orderId.value = res.data.id;
            console.log(orderId.value);
        }
    });
}
function changeShowPay(value) {
    showPay.value = value;
}
// *===================↑↑↑↑↑↑===================* //

defineExpose({});
</script>

<style lang="less" scoped>
@import url("~css/baseLess.less");
.address {
    .van-cell {
        display: flex;
        align-items: center;
        span {
            margin-right: 10px;
        }
    }
}
.goodCard {
    margin-bottom: 10px;
}
.van-submit-bar {
    bottom: var(--height-foot) !important;
}
</style>
