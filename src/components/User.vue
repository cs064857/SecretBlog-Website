<template>
    <div class="page-wrapper">
        <HomeHeaderNavigation ref="headerRef"></HomeHeaderNavigation>
        <div class="user-summary-main">
            <div class="user-summary-nav">
                <h2 style="text-align: center;">使用者資訊</h2>

                <el-menu class="user-nav-menu" :default-active="activeMenu" text-color="#fff"
                    active-text-color="#409EFF" @select="handleMenuSelect">
                    <el-menu-item index="UserInformation">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>個人資料</span>
                    </el-menu-item>

                    <el-menu-item index="UserSummary">
                        <el-icon>
                            <Document />
                        </el-icon>
                        <span>摘要</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="user-summary-container">

                <!-- <UserInformation :userSummary="userSummary" /> -->

                <div class="user-summary-container-main">


                    <div class="user-summary-main-content">
                        <router-view />

                        <!-- <Articles></Articles> -->
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script lang="ts" setup>
import HomeHeaderNavigation from "@/components/HomeHeaderNavigation.vue";
import UserSummary from "./UserSummary.vue";
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref, computed, watch } from "vue";
import http from "@/utils/httpRequest.js";
import { ElMessage } from "element-plus";
import type { R } from "@/interface/R.ts";
import { User, Document } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();

// 根據當前路由名稱計算 activeMenu
const activeMenu = computed(() => {
    return route.name as string || 'UserSummary';
});

/**
 * 處理導航選單選擇事件
 * @param index 選中的選單項 index（對應路由名稱）
 */
const handleMenuSelect = (index: string) => {
    console.log("選單選擇：", index);
    router.push({
        name: index,
        params: {
            userId: route.params.userId
        }
    });
};

</script>
<style lang="css" scoped>
.page-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.user-summary-main {
    width: 100%;
    height: 100%;
    background-color: var(--bg-hex-1a1514);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.user-summary-nav {
    width: 200px;
    min-width: 200px;
    height: 100%;
    background-color: var(--bg-hex-111111);
    border-right: 1px solid #333333;
}

/* el-menu 導航選單樣式 */
.user-nav-menu {
    height: 100%;
    width: 100%;
    background-color: var(--bg-hex-111111);
    border-right: none;
    --el-menu-bg-color: var(--bg-hex-111111);
    --el-menu-hover-bg-color: var(--bg-hex-1f1f1f);
    --el-menu-text-color: #ffffff;
    --el-menu-active-color: #409EFF;
}






.user-summary-container {
    width: calc(100% - 200px);
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    overflow-y: auto;
}

.user-summary-container-main {
    width: 80%;
    height: auto;
    min-height: 100%;


    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}

.user-summary-main-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;

    padding: 20px;
}
</style>
