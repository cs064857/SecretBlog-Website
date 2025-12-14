<template>
<div class="page-wrapper">
    <HomeHeaderNavigation ref="headerRef"></HomeHeaderNavigation>
    <div class="user-summary-main">
        <div class="user-summary-nav">
            <h2>nav導航列</h2>
            <div class="user-summary-main-nav">
                <div class="user-summary-main-nav-item">
                    <span style="cursor: pointer;" @click="handleGoInformation()">個人資料</span>
                </div>
                <div class="user-summary-main-nav-item">
                    <span style="cursor: pointer;" @click="handleGoSummary()">摘要</span>
                </div>
            </div>
        
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
import { useRouter ,useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import http from "@/utils/httpRequest.js";
import { ElMessage } from "element-plus";
import type { R } from "@/interface/R.ts";

const router = useRouter();
const route = useRoute();



const handleGoSummary = function(){
    console.log("handleSummary")
    router.push({
        name:'UserSummary',
        params:{
            userId:route.params.userId
        }
    })
}

const handleGoInformation = function(){
    console.log("UserInformation")
    router.push({
        name:'UserInformation',
        params:{
            userId:route.params.userId
        }
    })
}

</script>
<style lang="css" scoped>

.page-wrapper{
    display: flex;
    flex-direction: column; /* 垂直排列 */
    height: 100vh;          /* 佔滿視窗高度 */
    overflow: hidden;       /* 防止外層出現捲軸 */
}

.user-summary-main{
    width: 100%;
    height: 100%;
    background-color: var(--bg-hex-1a1514);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}


.user-summary-nav{
    width: 15%;
    height: 100%;
    background-color: var(--bg-hex-033f03);

}

.user-summary-container{
    width: 85%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    overflow-y: auto; 
}

.user-summary-container-main{
    width: 80%;
    height: auto;
    min-height: 100%;


    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}
.user-summary-main-nav{
    width: 80%;
    height: 200px;
    background-color: var(--bg-hex-b97610);
}


.user-summary-main-content{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;

    padding: 20px;
}




</style>
