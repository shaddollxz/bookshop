<template>
    <div class="login">
        <head-nav>
            <template #default>用户注册</template>
        </head-nav>

        <div class="view">
            <div class="avatar">
                <img src="~img/logo.png" alt="" />
            </div>

            <van-form @submit="onSubmit">
                <van-field
                    v-model="userInfo.email"
                    type="text"
                    name="电子邮箱"
                    label="电子邮箱"
                    placeholder="电子邮箱"
                    :rules="[{ required: true, message: '请填写电子邮箱', pattern: /.+@.+?\..+/ }]"
                />
                <van-field
                    v-model="userInfo.password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[
                        {
                            required: true,
                            message: '密码长度要大于五位',
                            validator: () => userInfo.password.length > 5,
                        },
                    ]"
                />
                <div style="margin: 16px;" class="jump">
                    <router-link to="/register">没有账号？立即注册</router-link>
                    <van-button round block type="info" color="#42b983" native-type="submit">
                        提交
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({});
const emit = defineEmits([]);
import { login } from "network/personal";
import HeadNav from "components/common/HeadNav";
import { reactive } from "@vue/reactivity";
import { Toast } from "vant";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();

// todo
// *===================↓↓↓↓↓↓===================* //
const userInfo = reactive({
    password: "123123",
    email: "test@a.com",
});
function onSubmit() {
    login(userInfo).then((res) => {
        if (res.status == 200) {
            const data = res.data;
            window.localStorage.setItem("access_token", data.access_token);
            Toast("登录成功,一秒后返回");
            setTimeout(() => {
                router.go(-1);
            }, 1000);
        }
    });
}
// *===================↑↑↑↑↑↑===================* //

defineExpose({});
</script>

<style lang="less" scoped>
.avatar {
    text-align: center;
    margin: 30px auto;
    img {
        border-radius: 50%;
        border: 1px solid #111111;
    }
}
.jump {
    margin-top: 20px;
    text-align: center;
    a {
        color: var(--color-tint);
    }
    button {
        margin-top: 20px;
    }
}
</style>
