<script setup lang="ts">
import {Management} from "@element-plus/icons-vue";
import {useRouter, useRoute} from 'vue-router'
import { ref, onMounted ,reactive,toRefs, computed} from 'vue' // 新增引入
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false) // 登入狀態追蹤

onMounted(() => {
  // 檢查 cookie 中是否有 jwtToken
  const cookies = document.cookie.split(';')
  isLoggedIn.value = cookies.some(cookie => cookie.startsWith('jwtToken'))
})

const handleGoBackend = function () {//進入後台管理系統
  router.push('/AdminVue')
}
const navigateToAuth = function () {//進入註冊/登入系統頁面
  sessionStorage.setItem('redirect', route.fullPath)
  router.push('/auth')
}


const handleCommand = (command) => {
  // console.log('handleCommand', command)
}

const handleSignOut = function(){
  sessionStorage.removeItem('jwtToken')
  document.cookie = "jwtToken=; max-age=0; path=/;";

  isLoggedIn.value = false
  router.push('/home')
  window.location.reload()
  ElMessage.success("登出成功")
}
const handleGoHome = function(){

  router.push('/Home')

}
</script>

<template>
        <div class="home-header-navigation">
          
          <!-- <el-image class="home-header-navigation-logo" src="https://element-plus.org/images/element-plus-logo.svg"></el-image> -->
          <img class="home-header-navigation-logo" style="cursor:pointer" alt="SecretBlog" v-on:click="handleGoHome" src="../assets/SecretBlog.svg"></img>
          <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoCategory" type="primary" :icon="Menu"/>-->
          <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoUser" type="primary" :icon="User"/>-->
          
          <el-dropdown @command="handleCommand" v-if="isLoggedIn">
            <el-avatar :size="50" src="https://linux.do/user_avatar/linux.do/j3n5en/144/305927_2.gif" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleSignOut">登出</el-dropdown-item>
                <el-dropdown-item disabled>暫無選項</el-dropdown-item>
                
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button style="height: 6vh;width: 6vh" @click="handleGoBackend" type="primary" :icon="Management"/>
          
          <button
            style="color: white; height: 6vh;width: 5vw"
            @click="navigateToAuth"
            v-if="!isLoggedIn"
          >
            Login/SingUp
          </button>
        </div>
</template>

<style scoped>
.home-header-navigation-logo{
  /* background-color: #DD4A68; */

  height: 27vh;

  width:auto;
  /*position:absolute;*/
  position:relative;
  right:75%;
  top:10%
}

.dark .home-header-navigation {
    /* padding-right: 3vw; */
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
    /*height:100%;*/
    height: 4.785rem;
    background-color: rgba(35, 38, 40, 0.8);
    gap: 1vw;
    position: relative;
    z-index: 1000;
}
</style>
