<template>
    <div class="goods">
        <a @click.prevent="goDetali(data.id)">
            <img v-lazy="data.cover_url" :alt="data.description" />
        </a>
        <div class="goods-info">
            <p>{{ data.title }}</p>
            <div class="goods-info-msg">
                <div>
                    <i class="iconfont icon-jiage"></i>
                    <span>{{ data.price }}</span>
                </div>
                <div class="collect">
                    <i
                        class="iconfont"
                        :class="isColloect ? 'icon-shoucang' : 'icon-shoucang1'"
                    ></i>
                    <span>{{ data.stock }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, toRef } from "@vue/reactivity";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
});
const emit = defineEmits([]);

const data = toRef(props, "data");
let isColloect = ref(false);
function goDetali(id) {
    router.push({ path: "/detali", query: { id } });
}

defineExpose({});
</script>

<style lang="less" scoped>
@import url("~css/baseLess.less");
.goods {
    text-align: center;
    img {
        width: 100%;
        height: auto;
        border-radius: 20%;
        border: 1px solid orangered;
    }
    &-info {
        p {
            margin: 10px 5px;
            font-size: 1.1rem;
            #limitTextLength();
        }
        &-msg {
            display: flex;
            justify-content: space-evenly;
            margin-bottom: 7px;
            span {
                font-size: 0.8rem;
                padding: 0 5px;
            }
        }
    }
}
</style>
