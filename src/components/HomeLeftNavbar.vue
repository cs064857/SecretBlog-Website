<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import http from '../utils/httpRequest'
import LoadingSpinner from "./LoadingSpinner.vue";
const router = useRouter()

const handleCategoryRouterLink = function (children) {
  console.log("分類ID:", children.id)
  router.push({ name: "Home", params: { categoryId: children.id } })
  // router.push('/Home/' + children.id)
}

// 骨架屏相關狀態
const isLoading = ref(true)  // 載入狀態
const error = ref<string | null>(null)  // 錯誤訊息

// 樹形分類數據
let categoryList = ref()
// let categoryList=ref<TreeCategoryNode | undefined>()

// 重試功能

import emitter from "@/utils/eventBusMitt";


emitter.on('retry-home-apis', () => {
  console.log("HomeLeftNavbar接收到retry-home-apis")

  getTreeCategoryList()
})

const getTreeCategoryList = function () {
  // 開始載入，重置錯誤狀態
  isLoading.value = true
  error.value = null

  http({
    url: http.adornUrl('/article/category/tree/list'),
    method: 'get',
    params: http.adornParams({})
  }).then(({ data }) => {
    if (data.code == "200") {
      console.log("HomeLeftNavbar getTreeCategoryList執行成功")
      // categoryList=data.data
      categoryList.value = data.data
      console.log("categoryList.value", categoryList.value)
      // console.log("從後端獲取樹型分類數據:",categoryList)
    } else {
      error.value = "獲取分類數據失敗"
      ElMessage.error("獲取分類數據錯誤");
    }
  }).catch((err) => {
    // 捕獲網路錯誤
    console.error('分類 API 請求失敗:', err)
    if (!navigator.onLine) {
      error.value = "網路已斷開"
    } else {
      error.value = "伺服器暫時不可用"
    }
  }).finally(() => {
    // 無論成功失敗，都停止載入狀態
    isLoading.value = false
  })
}
onMounted(() => {
  getTreeCategoryList()//從後端獲取分類數據
})


// defineProps({
//   categoryList:{
//     type:Array,
//     required:true,
//   },
// })
</script>

<template>
  <el-scrollbar height="100%" always>
    <!-- 狀態 1：載入中 - 顯示 Loading -->
    <LoadingSpinner v-if="isLoading" />

    <!-- 狀態 2：錯誤狀態 -->
    <div v-else-if="error" class="nav-error-state">
      <div class="nav-error-icon">⚠️</div>
      <p class="nav-error-message">{{ error }}</p>
      <!-- <el-button size="small" type="primary" @click="handleRetry">
        重試
      </el-button> -->
    </div>

    <!-- 狀態 3：正常顯示分類列表 -->
    <template v-else>
      <p class="category-item" v-for="item in (categoryList || [])" :key="item.id">
        {{ item.label }}
        <a href="#" @click="handleCategoryRouterLink(children)" class="category-link"
          v-for="children in item.children"><br><span style="padding-left: 1em;">{{ children.label }}</span></a>
      </p>
    </template>
  </el-scrollbar>
</template>

<style scoped>
.category-item {
  word-break: break-all;
  margin: 20px;
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: bold;
  font-size: 22px;
}

.category-link {
  color: darksalmon;
  font-size: 16px;
  text-decoration: none;
}

@media screen and (max-width: 959px) {
  .category-item {
    margin: 10px;
    /* Reduce margin on mobile */
    font-size: 18px;
    /* Slightly smaller font for mobile */
  }
}

/* ============================================
   骨架屏樣式 (Skeleton Loading Styles)
   ============================================ */

.skeleton-nav-container {
  padding: 20px;
}

.skeleton-nav-group {
  margin-bottom: 2rem;
}

.skeleton-nav-title {
  margin-bottom: 0.5rem;
}

.skeleton-nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1rem;
}

/* ============================================
   錯誤狀態樣式 (Error State Styles)
   ============================================ */

.nav-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  color: #999;
  height: 100%;
}

.nav-error-icon {
  font-size: 32px;
  margin-bottom: 0.5rem;
}

.nav-error-message {
  font-size: 14px;
  margin-bottom: 1rem;
  color: #ff6b6b;
  text-align: center;
}
</style>
