<template>
  <div class="search-layout">
    <div class="search-header">
      <!-- 搜尋輸入框 -->
      <SearchResults />
    </div>

    <!-- 搜尋結果展示區塊：Scrollbar + Infinite Scroll -->
    <!-- <el-scrollbar class="search-scrollbar" v-infinite-scroll="loadMore" -->
    <el-scrollbar distance="50" class="search-scrollbar" @end-reached="loadMore">
      <div class="search-article-list">
        <!-- 狀態 1：初次載入中 -->
        <LoadingSpinner v-if="isLoading && articles.length === 0" text="搜尋中..." />

        <!-- 狀態 2：錯誤狀態 -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">⚠️</div>
          <p class="error-message">{{ error }}</p>
          <el-button type="primary" @click="handleRetry">重新嘗試</el-button>
        </div>

        <!-- 狀態 3：無資料 -->
        <div v-else-if="articles.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <p class="empty-message">沒有找到相關文章</p>
        </div>

        <!-- 狀態 4：正常顯示搜尋結果 -->
        <div v-else class="home-article">
          <div v-for="article in articles" :key="article.articleId" class="article-box">
            <div class="article-title">
              <el-avatar v-if="article.avatar" :size="40" :src="article.avatar" class="article-avatar" />
              <el-avatar v-else :size="40" class="article-avatar">
                {{ article.nickName?.charAt(0) || '?' }}
              </el-avatar>
              <router-link :to="{ name: 'Article', params: { articleId: article.articleId } }">
                <p v-html="article.safeTitle"></p>
              </router-link>
            </div>

            <div v-if="article.safeContent" class="article-content">
              <p v-html="article.safeContent"></p>
            </div>

            <div class="article-info">
              <div class="article-category">
                <router-link v-if="article.categoryId"
                  :to="{ name: 'HomeArticleList', params: { categoryId: article.categoryId }, query: { page: 1 } }"
                  class="category-link">
                  {{ article.categoryName }}
                </router-link>
                <span v-else>{{ article.categoryName }}</span>
              </div>

              <div class="article-tags">
                <div v-for="tag in article.amsArtTagList || []" :key="tag.id" class="article-tag">
                  {{ tag.name }}
                </div>
              </div>

              <div class="article-metrics">
                <div class="article-metrics-label">喜歡</div>
                <div class="article-metrics-label">查看</div>
                <div class="article-metrics-label">書籤</div>
                <div class="article-metrics-label">創建時期</div>
                <div class="article-metrics-label">更新日期</div>

                <div class="article-metrics-value">{{ article.likesCount ?? 0 }}</div>
                <div class="article-metrics-value">{{ article.viewsCount ?? 0 }}</div>
                <div class="article-metrics-value">{{ article.bookmarksCount ?? 0 }}</div>
                <div class="article-metrics-value">{{ dayjs(article.createTime).fromNow() }}</div>
                <div class="article-metrics-value">{{ dayjs(article.updateTime).fromNow() }}</div>
              </div>
            </div>
          </div>

          <!-- 追加載入提示 -->
          <div v-if="isLoading" class="loading-more">
            <LoadingSpinner text="載入更多..." />
          </div>
          <div v-else-if="isLast" class="no-more">已無更多結果</div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="SearchLayout">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SearchResults from '@/components/search/SearchResults.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import http from '@/utils/httpRequest'
import { ElMessage } from 'element-plus'
import { R } from '@/interface/R'
import DOMPurify from 'dompurify'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-tw'
dayjs.extend(relativeTime)
dayjs.locale('zh-tw')

interface SearchTag {
  id: string
  name: string
}

interface SearchArticle {
  articleId: string
  title: string
  content?: string
  avatar?: string
  nickName?: string
  categoryId?: string
  categoryName?: string
  amsArtTagList?: SearchTag[]
  createTime?: string
  updateTime?: string
  likesCount?: number
  viewsCount?: number
  bookmarksCount?: number
}

interface SearchPageData {
  content: SearchArticle[]
  last: boolean
  number: number
  size: number
}

const route = useRoute()
const keyword = computed(() => String(route.params.keyword || '').trim())

const articles = ref<(SearchArticle & { safeTitle: string; safeContent: string })[]>([])
const pageNumber = ref(0)
const pageSize = ref(10)
const isLoading = ref(false)
const error = ref<string | null>(null)
const isLast = ref(false)

const infiniteDisabled = computed(() => isLoading.value || isLast.value || !keyword.value)

const resetSearch = () => {
  articles.value = []
  pageNumber.value = 0
  isLast.value = false
  error.value = null
}

const fetchSearch = async () => {
  if (!keyword.value || isLoading.value || isLast.value) return

  isLoading.value = true
  error.value = null
  const currentPage = pageNumber.value

  try {
    const { data } = await http({
      url: http.adornUrl('/search/highlight'),
      method: 'get',
      params: http.adornParams({
        keyword: keyword.value,
        page: currentPage,
        size: pageSize.value
      })
    }) as { data: R<SearchPageData> }

    if (data.code === '200' && data.data) {
      const content = data.data.content || []
      const processed = content.map(item => ({
        ...item,
        safeTitle: DOMPurify.sanitize(item.title || ''),
        safeContent: DOMPurify.sanitize(item.content || '')
      }))

      articles.value.push(...processed)
      isLast.value = !!data.data.last
      //假設搜索的內容還存在下一頁資料
      if (!isLast.value) {
        pageNumber.value = currentPage + 1
      }
    } else {
      error.value = data.msg || '搜尋失敗，請稍後再試'
      ElMessage.error(error.value)
    }
  } catch (err) {
    console.error('搜尋請求失敗:', err)
    if (!navigator.onLine) {
      error.value = '網路已斷開，請檢查連線狀態'
    } else {
      error.value = '伺服器暫時不可用，請稍後再試'
    }
  } finally {
    isLoading.value = false
  }
}

import type { ScrollbarDirection } from 'element-plus'


const loadMore = (direction: ScrollbarDirection) => {
  console.log('載入更多...')
  console.log("direction:", direction)
  if (direction === 'bottom') {
    pageNumber.value += 1
    fetchSearch()
  }
}



const handleRetry = () => {
  resetSearch()
  fetchSearch()
}

watch(keyword, () => {
  resetSearch()
  fetchSearch()
}, { immediate: true })
</script>

<style scoped>
.search-layout {
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 100%;
}

.search-header {
  padding: 1rem;
}

.search-scrollbar {
  flex: 1;
  padding: 0 1rem 1rem;
}

.search-article-list {
  width: 100%;
}

/* 參考 HomeArticleList.vue 的文章列表布局 */
.home-article {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 0 2% 0;
  max-width: 100%;
}

.article-box {
  background-color: #1E2122;
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

.article-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.article-avatar {
  flex-shrink: 0;
}

.article-title p {
  font-size: 20px;
  margin: 0 0 0.5rem 0;
}

.article-content {
  max-height: 20vh;
  overflow: hidden;
  padding: 0.25rem 1rem 0.25rem 0.25rem;
  background-color: #1E2122;

  overflow-wrap: break-word;
  word-break: break-word;
}

.article-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-category {
  flex: 1;
}

.category-link {
  color: #fff;
  text-decoration: none;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease;
}

.category-link:hover {
  background-color: rgba(0, 0, 0, 0.4);
  text-decoration: underline;
}

.article-tags {
  display: flex;
  flex: 4.5;
  gap: 10px;
  min-width: 0;
  overflow: hidden;
  padding: 0.5rem;
  box-sizing: border-box;
}

.article-tag {
  background-color: #549122;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.article-metrics {
  display: grid;
  grid-template-columns: repeat(5, auto);
  gap: 4px 8px;
  flex: 3;
}

.article-metrics-label {
  font-size: 12px;
  color: #eee;
}

.article-metrics-value {
  font-size: 12px;
  color: #fff;
}

.error-state,
.empty-state,
.loading-more,
.no-more {
  text-align: center;
  padding: 1rem;
}
</style>
