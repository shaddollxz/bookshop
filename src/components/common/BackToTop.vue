<template>
    <div class="backToTop" @click="$emit('rollTo')"></div>
</template>

<script setup>
defineEmits(["rollTo"]);
</script>

<style lang="less" scoped>
.backToTop {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 1px 1px rgba(11, 11, 11, 0.3);
    background-image: url("~img/backToTop.png");
    background-size: 100% 100%;
    background-color: aliceblue;
    cursor: pointer;
    z-index: 9999;
}
</style>
