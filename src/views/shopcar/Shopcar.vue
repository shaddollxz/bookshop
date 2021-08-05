<template>
    <div class="shopcar">
        <head-nav>
            <template #default>购物车</template>
        </head-nav>

        <van-checkbox-group ref="checkboxGroup" v-model="chosed">
            <template v-if="shopcarsData.length > 0">
                <template v-for="item of shopcarsData" :key="item.id">
                    <good-car
                        :carId="item.id"
                        :goodMsg="item.goods"
                        v-model:num="item.num"
                        @removeCar="removeCar"
                    ></good-car>
                </template>
            </template>
        </van-checkbox-group>

        <div class="bottom">
            <van-checkbox @click="choseAll">反选</van-checkbox>
            <div class="right">
                <span>
                    合计：
                    <small>￥</small>
                    {{ allPrice }}
                </span>
                <van-button type="warning" @click="previewOrder">结算</van-button>
            </div>
        </div>

        <when-nothing :isEmpty="!shopcarsData.length"></when-nothing>
    </div>
</template>

<script>
export default {
    name: "shopcar",
};
</script>

<script setup>
const props = defineProps({});
const emit = defineEmits([]);
import { computed, onMounted, reactive, ref, watch } from "@vue/runtime-core";
import HeadNav from "components/common/HeadNav";
import GoodCar from "./components/GoodCar";
import WhenNothing from "./components/WhenNothing";
import { carList, deleteCar, changeCarChose } from "network/shopcar";
import { debounce } from "@/util/SDT";
import { Toast } from "vant";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
import { useStore } from "vuex";
const store = useStore();

// todo获得购物车信息
// *===================↓↓↓↓↓↓===================* //
const shopcarsData = reactive([]);
const chosed = ref([]);
onMounted(async () => {
    Toast.loading("获取数据中。。。");
    const { data } = await carList();
    data.data.forEach((value) => {
        if (value.is_checked) {
            chosed.value.push(value.id);
        }
    });
    shopcarsData.push(...data.data);
});
// *===================↑↑↑↑↑↑===================* //

// todocheckBox的处理
// *===================↓↓↓↓↓↓===================* //
const checkboxGroup = ref(null);
function choseAll() {
    checkboxGroup.value.toggleAll();
}

let allPrice = computed(() => {
    return shopcarsData.reduce((result, current) => {
        if (chosed.value.includes(current.id)) {
            return result + current.num * current.goods.price;
        } else {
            return result;
        }
    }, 0);
});
// *===================↑↑↑↑↑↑===================* //

// todo购物车操作
// *===================↓↓↓↓↓↓===================* //
function removeCar(id) {
    deleteCar(id).then((res) => {
        if (res.status < 400) {
            for (let i = 0; i < shopcarsData.length; i++) {
                if (shopcarsData[i].id == id) {
                    shopcarsData.splice(i, 1);
                }
            }
            Toast("移除成功");
        }
    });
}

watch(
    chosed,
    debounce(() => {
        changeCarChose(chosed.value).then((res) => {
            if (res.status < 400) {
                // console.log("success");
            }
        });
    }, 1500)
);
// *===================↑↑↑↑↑↑===================* //
function previewOrder() {
    store.commit("addToShopCar", chosed.value);
    router.push("/preview");
}

defineExpose({});
</script>

<style lang="less" scoped>
.bottom {
    position: fixed;
    bottom: calc(var(--height-foot) + 5px);
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .van-checkbox {
        margin-left: 10px;
    }
    span {
        margin-right: 10px;
    }
    .van-button {
        width: 80px;
        border-radius: 25%;
        margin-right: 10px;
    }
}
</style>
