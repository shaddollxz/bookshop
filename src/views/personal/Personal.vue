<template>
    <div class="personal">
        <head-nav>
            <template #default>个人中心</template>
        </head-nav>

        <div class="main">
            <div class="main-my">
                <div class="main-my-img"><img :src="user.avatar_url" alt="" /></div>
                <div class="main-my-msg">
                    <p>昵称：{{ user.name }}</p>
                    <p>登录名：{{ user.email }}</p>
                </div>
            </div>
            <div class="main-btns">
                <van-cell title="我的收藏" is-link />
                <van-cell title="我的订单" is-link @click="jumpTo('order')" />
                <van-cell title="账号管理" is-link />
                <van-cell title="地址管理" is-link @click="jumpTo('address')" />
                <van-cell title="关于我们" is-link @click="Toast('制作:shaddollxz')" />
            </div>
            <van-button type="danger" @click="logOut">退出登录</van-button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({});
const emit = defineEmits([]);
import HeadNav from "components/common/HeadNav";
import { Toast } from "vant";
import { logout, getUserMsg } from "network/personal";
import { useRouter, useRoute } from "vue-router";
import { reactive } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
const router = useRouter();

// todo获得登录用户信息
// *===================↓↓↓↓↓↓===================* //
const user = reactive({});
onMounted(() => {
    getUserMsg().then(({ data }) => {
        Object.assign(user, data);
    });
});
// *===================↑↑↑↑↑↑===================* //

// todo页面跳转
// *===================↓↓↓↓↓↓===================* //
function jumpTo(page, query) {
    router.push({ path: `/${page}`, query: query || {} });
}
// *===================↑↑↑↑↑↑===================* //

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
.main {
    position: relative;

    &-my {
        display: flex;
        text-align: left;
        &-img {
            flex: 1;
        }
        &-msg {
            flex: 3;
            p {
                margin-left: 50px;
            }
        }
    }
    &-btns {
        margin: 20px;
    }
    .van-button {
        display: block;
        width: 40vw;
        position: relative;
        margin: 40px auto;
    }
}
</style>
