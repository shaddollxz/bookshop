<template>
    <div class="main">
        <head-nav>
            <template #default>收获地址</template>
        </head-nav>

        <van-address-list
            v-model="choseAddressID"
            :list="list"
            disabled-text="以下地址超出配送范围"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
        />
    </div>
</template>

<script setup>
import HeadNav from "components/common/HeadNav";
import { reactive, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { getAddress } from "network/adress";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const props = defineProps({});
const emit = defineEmits([]);

// todo获得地址列表
// *===================↓↓↓↓↓↓===================* //
let choseAddressID = ref(0);
const list = reactive([]);
onMounted(() => {
    getAddress().then(({ data }) => {
        list.push(
            ...data.data.map((value) => {
                return {
                    id: value.id,
                    tel: value.phone,
                    name: value.name,
                    address: `${value.province} ${value.city} ${value.county} ${value.address}`,
                    isDefault: !!value.is_default,
                };
            })
        );
    });
});
// *===================↑↑↑↑↑↑===================* //

// todo修改，新增
// *===================↓↓↓↓↓↓===================* //
function onAdd() {
    router.push("/addAddress");
}
function onEdit(item) {
    router.push({ path: "/addAddress", query: { id: item.id } });
}
// *===================↑↑↑↑↑↑===================* //

defineExpose({});
</script>

<style lang="less" scoped>
.choseAddress {
    height: 100%;
    width: 100%;
}
</style>
