<template>
    <div class="register">
        <head-nav>
            <template #default>用户注册</template>
        </head-nav>

        <div class="view">
            <div class="avatar">
                <img src="~img/logo.png" alt="" />
            </div>

            <van-form @submit="onSubmit">
                <van-field
                    v-model="userInfo.name"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[
                        {
                            required: true,
                            message: '请填写用户名',
                            formatter: () => userInfo.name.trim(),
                        },
                    ]"
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
                            message: '密码长度要大于六位',
                            validator: () => userInfo.password.length > 6,
                        },
                    ]"
                />
                <van-field
                    v-model="userInfo.password_confirmation"
                    type="password"
                    name="确认密码"
                    label="确认密码"
                    placeholder="确认密码"
                    :rules="[
                        {
                            required: true,
                            message: '请再次填写密码',
                            validator: () => userInfo.password == userInfo.password_confirmation,
                        },
                    ]"
                />
                <van-field
                    v-model="userInfo.email"
                    type="text"
                    name="电子邮箱"
                    label="电子邮箱"
                    placeholder="电子邮箱"
                    :rules="[{ required: true, message: '请填写电子邮箱', pattern: /.+@.+?\..+/ }]"
                />
                <div style="margin: 16px;" class="jump">
                    <router-link to="/login">已有账号？立即登录</router-link>
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
import { register } from "network/personal";
import HeadNav from "components/common/HeadNav";
import { reactive } from "@vue/reactivity";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
import { Toast } from "vant";

// todo收集用户信息
// *===================↓↓↓↓↓↓===================* //
const userInfo = reactive({ name: "", email: "", password: "", password_confirmation: "" });

function onSubmit() {
    register(userInfo).then((res) => {
        if (res.status == 201) {
            Toast("注册成功");
            setTimeout(() => {
                router.push("/login");
            }, 1500);
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
