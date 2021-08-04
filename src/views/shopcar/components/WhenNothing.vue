<template>
    <div class="whenNothing" v-show="$props.isEmpty">
        <p>购物车里还没有放东西</p>
        <van-button @click="goHome" type="info">去逛逛</van-button>
    </div>
</template>

<script setup>
const props = defineProps({
    isEmpty: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits([]);
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

function goHome() {
    router.push("/home");
}

defineExpose({});
</script>

<style lang="less" scoped>
@import url("~css/baseLess.less");
.whenNothing {
    #setSelfCenter();
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
    p {
        font-size: 2rem;
    }
    .vant-button {
        width: 100%;
    }
}
</style>
