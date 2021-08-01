<template>
    <div class="tabCard">
        <ul class="tabCard-head">
            <li
                v-for="(item, index) of $props.tabs"
                :key="item"
                :class="{ chosed: nowChosed == index }"
                @click="choseTab(index)"
            >
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<script setup>
// todo引入
// *===================↓↓↓↓↓↓===================* //
import { ref } from "@vue/reactivity";
const props = defineProps({
    tabs: {
        type: Array,
        default: [],
    },
});
const emit = defineEmits(["tabClick"]);
// *===================↑↑↑↑↑↑===================* //

// todo菜单点击切换
// *===================↓↓↓↓↓↓===================* //
let nowChosed = ref(0);
function choseTab(index) {
    nowChosed.value = index;
    emit("tabClick", index);
}
// *===================↑↑↑↑↑↑===================* //

defineExpose({});
</script>

<style lang="less" scoped>
@import url("~css/baseLess.less");
.tabCard {
    position: relative;
    position: sticky;
    top: 0;
    &-head {
        #clearMarPan();
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-color: white;
        z-index: 999;
        li {
            #clearMarPan();
            flex: 1;
            text-align: center;
            padding: 6px 0;
            cursor: pointer;
            &.chosed {
                position: relative;
                width: inherit;
                color: var(--color-tint);
                border-bottom: 2px solid var(--color-tint);
                &::after {
                    content: "";
                    background-color: rgba(88, 88, 88, 0.2);
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 100%;
                    @keyframes moveDown {
                        from {
                            bottom: 100%;
                        }
                        to {
                            bottom: 0%;
                        }
                    }
                    animation: moveDown 0.25s linear 0s 1 normal forwards;
                }
            }
        }
    }
}
</style>
