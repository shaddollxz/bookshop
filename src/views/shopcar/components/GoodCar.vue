<template>
    <div class="goodCar">
        <van-swipe-cell>
            <div class="good-item">
                <van-checkbox :name="$props.carId"></van-checkbox>
                <div class="good-img"><img :src="$props.goodMsg.cover_url" /></div>
                <div class="good-desc">
                    <div class="good-title">
                        <span>{{ $props.goodMsg.title }}</span>
                    </div>
                    <div class="good-btn">
                        <div class="price">
                            ￥
                            <small>{{ $props.goodMsg.price }}</small>
                        </div>
                        <van-stepper
                            integer
                            :min="1"
                            :max="10"
                            v-model="num"
                            name="10"
                            async-change
                        ></van-stepper>
                    </div>
                </div>
            </div>
            <template #right>
                <van-button square type="danger" @click="$emit('removeCar', $props.carId)">
                    删除
                </van-button>
            </template>
        </van-swipe-cell>
    </div>
</template>

<script setup>
import { isRef, reactive, ref, toRef } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import { throttle } from "@/util/SDT";
import { changeGoodNum } from "network/shopcar";

const props = defineProps({
    goodMsg: {
        type: Object,
        default: {},
    },
    num: {
        type: Number,
        default: 1,
    },
    carId: {
        type: Number,
        default: null,
    },
});
const emit = defineEmits(["update:num", "removeCar", "changeGoodNum"]);

// todo商品数量
// *===================↓↓↓↓↓↓===================* //
let num = ref(props.num);
watch(
    num,
    throttle((n, o) => {
        emit("update:num", n);
        changeGoodNum(props.carId, n).then((res) => {
            if (res.status < 400) {
                // console.log("修改数量成功");
            }
        });
    }),
    1500
);
// *===================↑↑↑↑↑↑===================* //

defineExpose({});
</script>

<style lang="less" scoped>
.good-item {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 10px;
    .van-checkbox {
        flex: 1;
        margin-left: 10px;
    }
    .good-img {
        flex: 4;
        text-align: center;
        img {
            height: auto;
            width: 100px;
        }
    }
    .good-desc {
        flex: 5;
    }
}
.van-button {
    width: 100%;
    height: 100%;
}
</style>
