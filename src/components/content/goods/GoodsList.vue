<template>
    <div class="goodsList">
        <template v-for="item in $props.goodsData" :key="item.id">
            <goods :data="item"></goods>
        </template>
    </div>
</template>

<script setup>
import { watch } from "@vue/runtime-core";
import Goods from "./Goods";
const props = defineProps({
    goodsData: {
        type: Object,
        default: {},
    },
});
const emit = defineEmits([]);

defineExpose({});
</script>

<style lang="less" scoped>
.goodsList {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    .goods {
        width: 46%; //! 控制商品卡片的列数
    }
}
</style>
