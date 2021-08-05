<template>
    <div class="goodsList">
        <!-- 后台返回有重复数据，这里只能不设置key -->
        <template v-for="item in $props.goodsData" :key="item">
            <goods :data="item"></goods>
        </template>
    </div>
</template>

<script setup>
import { ref, watch } from "@vue/runtime-core";
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
