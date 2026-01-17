<script setup lang="ts">
import { Management, Bell, Loading, UserFilled } from "@element-plus/icons-vue";
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, reactive, toRefs, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { R } from "@/interface/R";
import http from "@/utils/httpRequest.js";
import { useIsLoginStore } from "@/pinia/useIsLoginStore"
import { getCookieValue } from "@/utils/jwtUtils";
import { getInboxList, markInboxAsRead, markAllAsRead, type UmsUserInbox } from "@/api/userInbox";
// import { on } from "events";
import SearchHeaders from "@/components/search/SearchHeaders.vue";
import { storeToRefs } from "pinia"; // 引入 storeToRefs
import { clearAuthClientState } from '@/utils/httpRequest'

const router = useRouter()
const route = useRoute()
const isLoginStore = useIsLoginStore()
// 已經調用後端判斷是否成功登入,從pinia中獲取登入資訊
const { isLogin: isLoggedIn } = storeToRefs(isLoginStore)

const isMounted = ref(false)
const avatar = ref<string>('')
const userId = ref<string | null>(null)
const signOutSubmitting = ref(false)

const notifications = ref<UmsUserInbox[]>([])
const inboxPage = ref(1)
const inboxLoading = ref(false)
const inboxNoMore = ref(false)
const inboxTotal = ref(0)
const isNotificationOpen = ref(false)

const loadNotifications = (): Promise<void> => {
  return new Promise((resolve) => {
    if (inboxLoading.value || inboxNoMore.value) {
      resolve()
      return
    }
    inboxLoading.value = true
    getInboxList({ routePage: inboxPage.value, onlyUnread: false }).then(res => {
      if (String(res.code) === '200') {
        const pageData = res.data;
        if (pageData && pageData.records && pageData.records.length > 0) {
          notifications.value.push(...pageData.records)
          inboxPage.value++
          if (notifications.value.length >= pageData.total) {
            inboxNoMore.value = true
          }
        } else {
          inboxNoMore.value = true
        }
      }
    }).catch(() => {
      inboxNoMore.value = true
    }).finally(() => {
      inboxLoading.value = false
      resolve()
    })
  })
}

//初始化收件匣並建立SSE連線(必須先加載收件匣完畢才能建立SSE連線)
const initInboxAndSSE = async () => {
  //先加載收件匣
  await loadNotifications()
  //收件匣加載完畢後建立SSE連線
  SseService.subscribe(testSseSuccess, testSseError)
}

const handleNotificationShow = () => {
  if (notifications.value.length === 0) {
    loadNotifications()
  }
}

const handleNotificationClick = (item: UmsUserInbox) => {
  if (!item) return

  const inboxId = item.id
  const articleId = item.articleId

  // 先關閉通知彈窗，避免導頁後仍殘留在畫面上
  isNotificationOpen.value = false

  //1、導頁邏輯 (依 articleId 導到文章頁)
  if (articleId !== null && articleId !== undefined && String(articleId).trim() !== '') {
    router.push(`/Article/${encodeURIComponent(String(articleId))}`)
  }

  //2、標記已讀並從列表中移除
  if (item.readFlag === 0 && inboxId !== null && inboxId !== undefined) {
    //直接從列表中移除該通知
    const index = notifications.value.findIndex(n => n.id === inboxId);
    if (index !== -1) {
      notifications.value.splice(index, 1);
      //如果移除後列表為空，且已經沒有更多數據，可能需要調整 UI 顯示
      if (notifications.value.length === 0 && inboxNoMore.value) {
        //UI 會自動顯示暫無通知
      }
    }

    markInboxAsRead(inboxId)
      .then((res) => {
        if (String(res.code) !== '200') {
          // 如果後端失敗，理論上應該加回來，但為了體驗通常忽略或提示錯誤
          console.error(res.msg || '標記已讀失敗')
        }
      })
      .catch(() => {
        ElMessage.error('標記已讀失敗')
      })
  }
}

/**
 * 一鍵標記所有通知為已讀
 */
const handleMarkAllAsRead = () => {
  const unreadCount = notifications.value.filter(n => n.readFlag === 0).length;
  if (unreadCount === 0) return;

  // 樂觀更新：立即將所有通知標記為已讀
  notifications.value.forEach(n => {
    if (n.readFlag === 0) {
      n.readFlag = 1;
    }
  });

  markAllAsRead()
    .then((res) => {
      if (String(res.code) === '200') {
        ElMessage.success('已全部標記為已讀');
      } else {
        // 失敗時回滾
        notifications.value.forEach(n => {
          n.readFlag = 0;
        });
        ElMessage.error(res.msg || '標記失敗');
      }
    })
    .catch(() => {
      // 失敗時回滾
      notifications.value.forEach(n => {
        n.readFlag = 0;
      });
      ElMessage.error('標記已讀失敗');
    });
};

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

  http({
    url: http.adornUrl('/ums/user/logout'),
    method: 'post',
    // data: http.adornData(data, false)
  }).then(({ data }: { data: R }) => {
    if (data.code == "200") {
      clearAuthClientState()
      ElMessage.success("成功訊息");
      sessionStorage.removeItem('jwtToken')


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
    //使用者登入後先加載收件匣，完成後建立SSE連線
    initInboxAndSSE()
  } else {
    avatar.value = ''
    userId.value = null
    //使用者登出後斷開SSE連線
    SseService.unsubscribe()
  }
})
import SseService from '@/utils/sseService';
const testSseSuccess = function (userInbox: UmsUserInbox) {
  console.log("***testSseSuccess***")
  console.log("userInbox:", userInbox)
  notifications.value.unshift((userInbox))
}
const testSseError = function () {
  console.log("***testSseError***")
}
onMounted(async () => {
  updateUserInfo()
  // 延遲標記掛載完成，避開 Pinia Hydration 的同步 Patch 週期
  nextTick(() => {
    isMounted.value = true
  })

  //僅在使用者已登入時先加載收件匣，完成後建立SSE連線
  if (isLoggedIn.value) {
    await initInboxAndSSE()
  }
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

    <div class="home-header-navigation-notification-container" v-if="isMounted && isLoggedIn">
      <el-popover v-model:visible="isNotificationOpen" placement="bottom" :width="400" trigger="click"
        popper-class="notification-popover" @show="handleNotificationShow">
        <template #reference>
          <el-button circle :icon="Bell" class="notification-bell-btn" />
        </template>
        <div class="notification-list-container">
          <div class="notification-header-area">
            <div class="notification-header-left">
              <h3 class="notification-title">通知中心</h3>
              <span v-if="notifications.filter(n => n.readFlag === 0).length > 0" class="notification-count">{{
                notifications.filter(n => n.readFlag === 0).length }} 未讀</span>
            </div>
            <el-button link type="primary" size="small" @click.stop="handleMarkAllAsRead"
              :disabled="notifications.filter(n => n.readFlag === 0).length === 0">
              一鍵已讀
            </el-button>
          </div>
          <el-scrollbar max-height="450px" always>
            <ul v-infinite-scroll="loadNotifications" class="notification-list"
              :infinite-scroll-disabled="inboxNoMore || inboxLoading">
              <li v-for="item in notifications" :key="item.id" class="notification-item"
                :class="{ 'notification-item--unread': item.readFlag === 0 }" role="button" tabindex="0"
                @click="handleNotificationClick(item)" @keydown.enter.prevent="handleNotificationClick(item)">
                <div class="notification-item-layout">
                  <div class="notification-avatar-area">
                    <el-avatar v-if="item.fromAvatar" :size="40" :src="item.fromAvatar"
                      class="notification-sender-avatar" />
                    <el-avatar v-else :size="40" icon="UserFilled" />
                    <span v-if="item.readFlag === 0" class="notification-unread-dot"></span>
                  </div>
                  <div class="notification-content-area">
                    <div class="notification-top-row">
                      <span v-if="item.fromNickName" class="notification-sender-name">{{ item.fromNickName }}</span>
                      <span class="notification-time">{{ item.createAt ? item.createAt.replace('T', ' ') : '' }}</span>
                    </div>
                    <div class="notification-subject" v-if="item.subject">{{ item.subject }}</div>
                    <div class="notification-body" v-if="item.body">{{ item.body }}</div>
                    <div class="notification-type-tag">{{ item.type }}</div>
                  </div>
                </div>
              </li>
              <div v-if="inboxLoading" class="notification-loading">
                <el-icon class="is-loading">
                  <Loading />
                </el-icon> 載入中...
              </div>
              <div v-if="inboxNoMore && notifications.length === 0" class="notification-empty">
                <el-empty description="暫無通知" :image-size="80" />
              </div>
              <div v-if="inboxNoMore && notifications.length > 0" class="notification-footer">
                沒有更多通知了
              </div>
            </ul>
          </el-scrollbar>
        </div>
      </el-popover>
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
.home-header-navigation-notification-container,
.home-header-navigation-backend-container,
.home-header-navigation-login-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

/* Notification Styles */
.notification-bell-btn {
}

.notification-bell-btn:hover {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary-light-5);
  background-color: var(--el-color-primary-light-9);
}

.notification-list-container {
  padding: 0;
}

.notification-header-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-bg-color-overlay);
}

.notification-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.notification-count {
  font-size: 12px;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  padding: 2px 8px;
  border-radius: 12px;
}

.notification-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-list {
  padding: 0;
  margin: 0;
}

.notification-item {
  position: relative;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  cursor: pointer;
  background-color: var(--el-bg-color);
}

.notification-item:hover {
  background-color: var(--el-fill-color-light);
}

.notification-item--unread {
  background-color: var(--el-color-primary-light-9);
}

.notification-item--unread:hover {
  background-color: var(--el-color-primary-light-8);
}

.notification-item-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.notification-avatar-area {
  position: relative;
  flex-shrink: 0;
}

.notification-unread-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: var(--el-color-danger);
  border: 2px solid var(--el-bg-color);
  border-radius: 50%;
}

.notification-content-area {
  flex: 1;
  min-width: 0;
}

.notification-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.notification-sender-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.notification-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.notification-subject {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  margin-bottom: 6px;

  overflow: hidden;
}

.notification-body {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
  overflow: hidden;
  line-height: 1.5;
}

.notification-type-tag {
  display: inline-block;
  font-size: 12px;
  color: var(--el-color-info);
  background-color: var(--el-fill-color);
  padding: 2px 6px;
  border-radius: 4px;
}

.notification-loading,
.notification-footer {
  padding: 15px;
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.notification-empty {
  padding: 20px 0;
}

.auth-btn {
  height: 2.5rem;
  min-width: 5rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.login-btn {
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
