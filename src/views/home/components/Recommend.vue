<template>
    <div class="recommend">
        <div class="recommend-item" v-for="item of renderData" :key="item.id">
            <a @click.prevent="goDetali(item.id)">
                <img :src="item.cover_url" :alt="item.title" :title="item.description" />
                <p>{{ item.title }}</p>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, toRef } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const props = defineProps({
    renderData: {
        type: Array,
        default: [],
    },
});
const emit = defineEmits([]);

const renderData = toRef(props, "renderData");

function goDetali(id) {
    router.push({ path: "/detali", query: { id } });
}

defineExpose({});
</script>

<style lang="less" scoped>
@import url("~css/baseLess.less");
.recommend {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 5px 0 10px 0;
    gap: 0 1px;
    overflow-x: scroll;
    &-item {
        flex: 0 0 25vw;
        width: 25vw;
        height: auto;
        a {
            cursor: pointer;
            img {
                width: 100%;
                height: auto;
            }
            p {
                margin: 5px 0;
                font-size: 0.7rem;
                text-align: center;
                #limitTextLength();
            }
        }
    }
}
</style>
