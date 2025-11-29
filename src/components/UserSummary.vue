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
                    <!-- <UserLikes></UserLikes> -->
                    <!-- <Articles></Articles> -->
                </div>
            </div>
        </div>
    </div>
</div>

</template>
<script lang="ts" setup>
import HomeHeaderNavigation from "@/components/HomeHeaderNavigation.vue";
import UserLikes from "./UserLikes.vue";
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
        name:'UserLikes',
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
    background-color: #1a1514;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}


.user-summary-nav{
    width: 15%;
    height: 100%;
    background-color: #033f03;

}

.user-summary-container{
    width: 85%;
    height: 100%;
    background-color: #743824;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}

.user-summary-container-main{
    width: 80%;
    height: auto;
    min-height: 100%;
    background-color: #30cc57;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}
.user-summary-main-nav{
    width: 80%;
    height: 200px;
    background-color: #b97610;
}


.user-summary-main-content{
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
    background-color: #6c1c9b;
    padding: 20px;
}




</style>
