<template>
    <div class="personal">
        <head-nav>
            <template #default>个人中心</template>
        </head-nav>

        <van-button type="danger" @click="logOut">注销</van-button>
    </div>
</template>

<script setup>
const props = defineProps({});
const emit = defineEmits([]);
import HeadNav from "components/common/HeadNav";
import { Toast } from "vant";
import { logout } from "network/personal";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();

// todo注销登录
// *===================↓↓↓↓↓↓===================* //
function logOut() {
    logout().then((res) => {
        console.log(res);
        if (res.status == 204) {
            Toast("注销成功，一秒后返回主页");
            window.localStorage.removeItem("access_token");
            setTimeout(() => {
                router.push("/home");
            }, 1000);
        }
    });
}
// *===================↑↑↑↑↑↑===================* //

defineExpose({});
</script>

<style lang="less" scoped>
@import url("~css/baseLess.less");
button {
    width: 40vw;
    #setSelfCenter();
}
</style>
