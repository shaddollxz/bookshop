<template>
    <div>
        <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(image, index) in $props.Urls" :key="index">
                <a href="#">
                    <img v-lazy="image.img_url" :title="image.title" />
                </a>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script setup>
const props = defineProps({
    Urls: {
        style: Array,
        default: [],
    },
});
const emit = defineEmits([]);

defineExpose({});
</script>

<style lang="less" scoped>
.van-swipe {
    height: 200px;
    img {
        height: 100%;
        width: 100%;
    }
}
</style>
