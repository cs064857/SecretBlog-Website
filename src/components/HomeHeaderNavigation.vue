<script setup lang="ts">
import { Management } from "@element-plus/icons-vue";
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, reactive, toRefs, computed, watch, nextTick } from 'vue' // 新增引入
import { ElMessage } from 'element-plus'
import { R } from "@/interface/R";
import http from "@/utils/httpRequest.js";
import { useIsLoginStore } from "@/pinia/useIsLoginStore"
import { getCookieValue } from "@/utils/jwtUtils";
// import { on } from "events";
import SearchHeaders from "@/components/search/SearchHeaders.vue";
import { storeToRefs } from "pinia"; // 引入 storeToRefs

const router = useRouter()
const route = useRoute()
const isLoginStore = useIsLoginStore()
// 已經調用後端判斷是否成功登入,從pinia中獲取登入資訊
const { isLogin: isLoggedIn } = storeToRefs(isLoginStore)

const isMounted = ref(false)
const avatar = ref<string>('')
const userId = ref<string | null>(null)
const signOutSubmitting = ref(false)

// 判斷是否隱藏導航列搜尋區塊（根據路由 meta 欄位）
const hideNavSearch = computed(() => route.meta.hideNavSearch === true)

const handleGoBackend = function () {//進入後台管理系統
  router.push('/AdminVue')
}
const navigateToAuth = function (type: 'login' | 'register' = 'login') { // 進入註冊/登入系統頁面
  sessionStorage.setItem('redirect', route.fullPath)
  if (type === 'login') {
    router.push('/auth/login')
  } else {
    router.push('/auth/register')
  }
}


const handleCommand = (command) => {
  // console.log('handleCommand', command)
}

const handleSignOut = function () {
  if (signOutSubmitting.value) return
  signOutSubmitting.value = true

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


      router.push('/Home/2?page=1')

      ElMessage.success("登出成功")
    } else {
      ElMessage.error("錯誤訊息");
    }

  }).catch(() => {
    ElMessage.error("請求出錯，請稍後再試");
  }).finally(() => {
    signOutSubmitting.value = false
  });


}
const handleGoHome = function () {

  router.push('/Home/2?page=1')

}

const updateUserInfo = function () {
  console.log("updateUserInfo from cookies")
  avatar.value = getCookieValue('avatar') || ''
  userId.value = getCookieValue('userId')
  console.log("updated avatar:", avatar.value, "userId:", userId.value)
}

// 監聽登入狀態變化，及時同步 Cookie 數據
watch(isLoggedIn, (newVal) => {
  if (newVal) {
    updateUserInfo()
  } else {
    avatar.value = ''
    userId.value = null
  }
})

onMounted(() => {
  updateUserInfo()
  // 延遲標記掛載完成，避開 Pinia Hydration 的同步 Patch 週期
  nextTick(() => {
    isMounted.value = true
  })
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
      <el-dropdown @command="handleCommand" v-if="isMounted && isLoggedIn">
        <el-avatar :size="50" :src="avatar" />
        <template #dropdown>
          <el-dropdown-menu>

            <el-dropdown-item>

              <router-link v-if="userId" :to="{ name: 'User', params: { userId: userId } }">
                個人資料
              </router-link>


            </el-dropdown-item>
            <el-dropdown-item :disabled="signOutSubmitting" @click="handleSignOut">登出</el-dropdown-item>
            <el-dropdown-item disabled>暫無選項</el-dropdown-item>

          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>




    <div class="home-header-navigation-login-container" v-if="!isLoggedIn">
      <el-button class="auth-btn login-btn" @click="navigateToAuth('login')" type="primary">
        Log In
      </el-button>
      <el-button class="auth-btn signup-btn" @click="navigateToAuth('register')">
        Sign Up
      </el-button>
    </div>

    <div class="home-header-navigation-backend-container">
      <el-button style="height: 6vh;width: 6vh" @click="handleGoBackend" type="primary" :icon="Management" />
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
  background-color: var(--bg-rgba-255-255-255-0p95);
  gap: 1rem;
  position: relative;
  z-index: 1000;
  padding: 0 2vw;
  box-sizing: border-box;
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
  gap: 0.8rem;
}

.auth-btn {
  height: 2.5rem;
  min-width: 5rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.login-btn {
  /* 這裡可以額外自定義樣式 */
}

.signup-btn {
  background-color: transparent;
  border: 1px solid var(--el-color-primary);
  color: var(--el-color-primary);
}

.signup-btn:hover {
  background-color: var(--el-color-primary-light-9);
}

/* Dark 模式樣式 */
.dark .home-header-navigation {
  background-color: var(--bg-rgba-35-38-40-0p8);
}
</style>
