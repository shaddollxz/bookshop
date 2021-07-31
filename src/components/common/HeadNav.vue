<template>
    <div class="headNav">
        <div class="left" @click="goback">
            <slot name="left">
                <i class="iconfont icon-zuo"></i>
            </slot>
        </div>
        <div class="center">
            <slot>图书商城</slot>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
    },
});
const emit = defineEmits([]);
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

function goback() {
    router.go(-1);
}

defineExpose({});
</script>

<style lang="less" scoped>
.headNav {
    height: 45px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    background-color: var(--color-tint);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    font-size: var(--font-size-normal);
    .left,
    .right {
        margin: 20px;
    }
    .center {
        flex: 1;
    }
}
</style>
