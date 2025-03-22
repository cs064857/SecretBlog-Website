<script setup lang="ts">
import {Management} from "@element-plus/icons-vue";
import {useRouter, useRoute} from 'vue-router'

const router = useRouter()
const route = useRoute()
const handleGoBackend = function () {//進入後台管理系統
  router.push('/AdminVue')
}
const navigateToAuth = function () {//進入註冊/登入系統頁面
  ///TODO 將當前頁面路徑儲存至sessionStorage中,以便登入後跳轉至原頁面
  sessionStorage.setItem('redirect', route.fullPath)
  router.push('/auth')
}


</script>

<template>
        <div class="home-header-navigation">
          <el-image class="home-header-navigation-logo" src="https://element-plus.org/images/element-plus-logo.svg">
          </el-image>
          <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoCategory" type="primary" :icon="Menu"/>-->
          <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoUser" type="primary" :icon="User"/>-->
          <el-button style="height: 6vh;width: 6vh" @click="handleGoBackend" type="primary" :icon="Management"/>
          <button style="color: white; height: 6vh;width: 5vw" @click="navigateToAuth" >Login/SingUp</button>

        </div>
</template>

<style scoped>
.home-header-navigation-logo{
  background-color: #DD4A68;

  height: 8vh;

  width:auto;
  /*position:absolute;*/
  position:relative;
  right:78%;
}

.home-header-navigation {
    /* padding-right: 3vw; */
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
    /*height:100%;*/
    height: 4.785rem;
    background-color: darkslateblue;
    gap: 1vw

}
</style>
