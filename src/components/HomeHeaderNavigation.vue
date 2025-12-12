<script setup lang="ts">
import { Management } from "@element-plus/icons-vue";
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, reactive, toRefs, computed } from 'vue' // 新增引入
import { ElMessage } from 'element-plus'
import { R } from "@/interface/R";
import http from "@/utils/httpRequest.js";
import { useIsLoginStore } from "@/pinia/useIsLoginStore"
import { getCookieValue } from "@/utils/jwtUtils";
import { on } from "events";
import SearchHeaders from "@/components/search/SearchHeaders.vue";
const router = useRouter()
const route = useRoute()
const isLoginStore = useIsLoginStore()
// 已經調用後端判斷是否成功登入,從pinia中獲取登入資訊
const isLoggedIn = computed(() => isLoginStore.getIsLoginData) // 綁定 Pinia

// 判斷是否隱藏導航列搜尋區塊（根據路由 meta 欄位）
const hideNavSearch = computed(() => route.meta.hideNavSearch === true)

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

const handleSignOut = function () {
  //TODO 調用Logout API使jwtToken在後端拉入黑名單中
  http({
    url: http.adornUrl('/ums/user/logout'),
    method: 'post',
    // data: http.adornData(data, false)
  }).then(({ data }: { data: R }) => {
    if (data.code == "200") {
      isLoginStore.setIsLoginData(false)
      ElMessage.success("成功訊息");
      sessionStorage.removeItem('jwtToken')

      //登出時使jwtToken過期並且清空,
      document.cookie = "jwtToken=; max-age=0; path=/;";


      router.push('/home')

      ElMessage.success("登出成功")
    } else {
      ElMessage.error("錯誤訊息");
    }

  }).catch(() => {
    ElMessage.error("請求出錯，請稍後再試");
  });


}
const handleGoHome = function () {

  router.push('/Home')

}
const avatar = ref<string>('')

const getAvatarUrl = function () {
  console.log("getAvatarUrl")
  avatar.value = getCookieValue('avatar')
  console.log("getAvatarUrl avatar.value:", avatar.value)
}
onMounted(() => {
  getAvatarUrl()
})
</script>

<template>
  <div class="home-header-navigation">


    <div class="home-header-navigation-logo-container">
      <!-- <el-image class="home-header-navigation-logo" src="https://element-plus.org/images/element-plus-logo.svg"></el-image> -->
      <img class="home-header-navigation-logo" alt="SecretBlog" v-on:click="handleGoHome"
        src="../assets/SecretBlog.svg"></img>
    </div>
    <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoCategory" type="primary" :icon="Menu"/>-->
    <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoUser" type="primary" :icon="User"/>-->

    <!-- 搜尋框區塊 - 使用 v-show 保持佈局穩定 -->
    <div class="home-header-navigation-search">
      <SearchHeaders v-if="!hideNavSearch" />
    </div>

    <div class="home-header-navigation-user-container">
      <el-dropdown @command="handleCommand" v-if="isLoggedIn">
        <el-avatar :size="50" :src="avatar" />
        <template #dropdown>
          <el-dropdown-menu>

            <el-dropdown-item>

              <router-link :to="{ name: 'User', params: { userId: getCookieValue('userId') } }">
                個人資料
              </router-link>


            </el-dropdown-item>
            <el-dropdown-item @click="handleSignOut">登出</el-dropdown-item>
            <el-dropdown-item disabled>暫無選項</el-dropdown-item>

          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>


    <div class="home-header-navigation-backend-container">
      <el-button style="height: 6vh;width: 6vh" @click="handleGoBackend" type="primary" :icon="Management" />
    </div>

    <div class="home-header-navigation-login-container">
      <button style="color: white; height: 6vh;width: 5vw" @click="navigateToAuth" v-if="!isLoggedIn">
        Login/SingUp
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-header-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4.785rem;
  background-color: rgba(255, 255, 255, 0.95);
  gap: 1rem;
  position: relative;
  z-index: 1000;
  padding: 0 2vw;
}

/* Logo 容器 - 固定在最左邊 */
.home-header-navigation-logo-container {
  display: flex;
  align-items: center;
}

.home-header-navigation-logo {
  height: 15vh;
  cursor: pointer;
  width: auto;

  /* 裁切圖片,將圖片底部略為裁減, 避免誤觸 */
  clip-path: inset(0% 0 37% 0);
}

/* 搜尋框容器 - 居中 */
.home-header-navigation-search {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
}

/* 右側用戶操作區域容器 */
.home-header-navigation-user-container,
.home-header-navigation-backend-container,
.home-header-navigation-login-container {
  display: flex;
  align-items: center;
}

/* Dark 模式樣式 */
.dark .home-header-navigation {
  background-color: rgba(35, 38, 40, 0.8);
}
</style>