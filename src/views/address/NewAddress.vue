<template>
    <div>
        <head-nav>
            <template #default>{{ title }}</template>
        </head-nav>

        <van-address-edit
            :area-list="areaList"
            :address-info="addressInfo"
            show-delete
            show-set-default
            show-search-result
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"
            @change-detail="onChangeDetail"
        />
    </div>
</template>

<script>
export default {
    name: "newAddress",
};
</script>

<script setup>
const props = defineProps({});
const emit = defineEmits([]);
import { reactive, ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import HeadNav from "components/common/HeadNav";
import { getAddressMsg, addAddress, changeAddress } from "network/adress";
import { areaList } from "@vant/area-data";
import { Toast } from "vant";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

// todo如果是修改，在这里获得修改的数据
// *===================↓↓↓↓↓↓===================* //
let addressInfo = ref({});
let isEdit = ref(false);
onMounted(() => {
    if (route.query.id) {
        isEdit.value = true;
        getAddressMsg(route.query.id).then(({ data }) => {
            let { province, city, county } = data;
            areaCode = getAreaCode(county);

            let areaCode = (addressInfo.value = {
                name: data.name,
                tel: data.phone,
                province,
                city,
                county,
                areaCode,
                addressDetail: data.address,
                isDefault: !!data.is_default,
            });
        });
    }
});
let title = computed(() => {
    return isEdit.value ? "修改地址" : "新增地址";
});

function getAreaCode(county) {
    let areaCode;
    Object.entries(areaList.county_list).forEach((item) => {
        if (county == item[1]) {
            areaCode = item[0];
        }
    });
    return areaCode;
}
// *===================↑↑↑↑↑↑===================* //

// todo具体操作
// *===================↓↓↓↓↓↓===================* //
function onSave(data) {
    const parmas = {
        name: data.name,
        phone: data.tel,
        province: data.province,
        city: data.city,
        county: data.county,
        address: data.addressDetail,
        is_default: data.isDefault ? 1 : 0,
    };
    if (isEdit.value) {
        changeAddress(route.query.id, parmas).then((res) => {
            if (res.status < 400) {
                Toast("修改成功");
                setTimeout(() => {
                    router.go(-1);
                }, 1000);
            }
        });
    } else {
        addAddress(parmas).then((res) => {
            if (res.status < 400) {
                Toast("添加成功");
                setTimeout(() => {
                    router.go(-1);
                }, 1000);
            }
        });
    }
}
function onDelete() {
    router.go(-1);
}
function onChangeDetail() {}
// *===================↑↑↑↑↑↑===================* //

defineExpose({});
</script>

<style lang="less" scoped></style>
