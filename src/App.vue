<template>
    <router-view v-slot="{ Component }">
        <keep-alive exclude="detali">
            <component :is="Component" />
        </keep-alive>
    </router-view>
    <div id="Placeholder"></div>
    <nav>
        <ul>
            <li>
                <router-link to="/">
                    <i class="iconfont icon-shouye"></i>
                    <div>首页</div>
                </router-link>
            </li>
            <li>
                <router-link to="/category">
                    <i class="iconfont icon-fenlei"></i>
                    <div>分类</div>
                </router-link>
            </li>
            <li>
                <router-link to="/shopcar">
                    <van-badge :content="10" max="9">
                        <i class="iconfont icon-gouwuchekong"></i>
                    </van-badge>
                    <div>购物车</div>
                </router-link>
            </li>
            <li>
                <router-link to="/personal">
                    <i class="iconfont icon-gerenzhongxin"></i>
                    <div>我的</div>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<style lang="less">
@import url("~css/global.less");
@import url("~css/iconfont.css");

#Placeholder {
    width: 100%;
    height: var(--height-foot);
}
nav {
    height: var(--height-foot);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background-color: #f6f6f6;
    box-shadow: 0 -5px 1px rgba(100, 100, 100, 0.2);
    ul {
        padding: 10px 0;
        display: flex;
        justify-content: space-evenly;
        li > a {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--color-text);
            &.router-link-exact-active {
                color: var(--color-tint);
            }
            div {
                color: inherit;
            }
        }
    }
}
</style>
