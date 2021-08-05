<template>
    <div>
        <van-popup v-bind="$attrs" position="bottom" :style="{ height: '30%' }">
            <div class="popup">
                <van-button type="primary" @click="pay($props.orderID)">支付宝支付</van-button>
                <van-button type="info" @click="Toast('暂不支持')">微信支付</van-button>
            </div>
        </van-popup>

        <van-popup v-model:show="showQR" @closed="orderClose">
            <div class="QRcode">
                <p>支付宝</p>
                <img :src="QRurl" alt="" />
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { Toast } from "vant";
import { getQRcode, getOrderState } from "network/order";
import { ref, toRef } from "@vue/reactivity";
import { useRouter, useRoute } from "vue-router";
import { watch } from "@vue/runtime-core";
const router = useRouter();
const props = defineProps({
    orderID: {
        type: Number,
        default: 0,
    },
});
const emit = defineEmits(["changeShowPay"]);

// todo支付
// *===================↓↓↓↓↓↓===================* //
let showQR = ref(false);
let QRurl = ref("");
let timer;
function pay(orderId) {
    getQRcode(orderId).then(({ data }) => {
        QRurl.value = data.qr_code_url;
        emit("changeShowPay", false);
        showQR.value = true;
        timer = setInterval(() => {
            getOrderState(orderId).then(({ data }) => {
                if (data == 2) {
                    QRurl.value = false;
                    Toast("支付完成");
                    clearInterval(timer);
                    setTimeout(() => {
                        router.replace("/order/" + orderID);
                    }, 1000);
                }
            });
        }, 2500);
    });
}
function orderClose() {
    Toast("取消支付");
    clearInterval(timer);
    router.go(-1);
}
// *===================↑↑↑↑↑↑===================* //
defineExpose({});
</script>

<style lang="less" scoped>
.popup {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    .van-button {
        display: block;
        width: 70vw;
        height: 50px;
    }
}
.QRcode {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    text-align: center;
}
</style>
