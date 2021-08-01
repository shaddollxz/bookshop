<template>
    <head-nav>
        <template #default>商品详情 {{ id }}</template>
    </head-nav>
</template>

<script setup>
const props = defineProps({});
const emit = defineEmits([]);
import { toRef } from "@vue/reactivity";
import HeadNav from "components/common/HeadNav";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const id = toRef(route.query, "id");
console.log(route);
defineExpose({});
</script>

<style lang="less" scoped></style>
