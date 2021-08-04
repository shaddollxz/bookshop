<template>
    <div class="goodCard">
        <div class="good-img"><img :src="data.cover_url" /></div>
        <div class="good-desc">
            <div class="good-title">
                <span>{{ data.title }}</span>
            </div>
            <div class="good-btn">
                <div class="price">
                    ￥
                    <small>{{ data.price }}</small>
                    &nbsp;
                    <span class="num">x{{ $props.num }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRef } from "@vue/reactivity";
const props = defineProps({
    goodMsg: {
        type: Object,
        default: {},
    },
    num: {
        type: Number,
        default: 1,
    },
});
const emit = defineEmits([]);

//todo 获得商品信息
const data = toRef(props, "goodMsg");

defineExpose({});
</script>

<style lang="less" scoped>
.goodCard {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 20px 10px;
    background-color: #f6f6f6;
    .good-img {
        margin-left: 30px;
        flex: 1;
        text-align: center;
        img {
            height: auto;
            width: 120px;
        }
    }
    .good-desc {
        margin-left: 30px;
        flex: 5;
        .good-title {
            margin-bottom: 5px;
        }
    }
}
</style>
