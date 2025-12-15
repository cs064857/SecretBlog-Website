<template>
    <div class="user-summary-main-content-bookmarks">
        <el-scrollbar distance="50" class="bookmarks-scrollbar" @end-reached="loadMore">
            <div v-if="items.length === 0 && !isLoading" class="empty-message">
                <p>目前沒有收藏的文章</p>
            </div>
            <div v-else class="article-list">
                <div v-for="article in items" :key="article.articleId" class="article-box">
                    <div class="article-title">
                        <!-- 作者頭像 -->
                        <el-avatar class="article-author-avatar" :size="36" :src="article.avatar" />
                        <router-link :to="{ name: 'Article', params: { articleId: article.articleId } }">
                            <p>{{ article.title }}</p>
                        </router-link>
                    </div>
                    <div class="article-info">
                        <div class="article-metrics">
                            <div class="article-metrics-label">更新時間</div>
                            <div class="article-metrics-label">狀態</div>
                            <div class="article-metrics-label"></div> <!-- Spacer -->
                            <div class="article-metrics-label"></div> <!-- Spacer -->
                            <div class="article-metrics-label"></div> <!-- Spacer -->

                            <div class="article-metrics-value">{{ formatDate(article.updateAt) }}</div>
                            <div class="article-metrics-value">
                                <span class="bookmarked">已收藏</span>
                            </div>
                            <div class="article-metrics-value"></div> <!-- Spacer -->
                            <div class="article-metrics-value"></div> <!-- Spacer -->
                            <div class="article-metrics-value"></div> <!-- Spacer -->
                        </div>
                    </div>
                </div>
                <!-- 載入中提示 -->
                <div v-if="isLoading" class="loading-more">載入更多...</div>
                <!-- 已無更多資料提示 -->
                <div v-else-if="isLast && items.length > 0" class="no-more">已無更多結果</div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import http from '@/utils/httpRequest.js';
import type { R } from '@/interface/R.ts';
import { useInfiniteScroll, formatDate } from '@/hooks/useInfiniteScroll';

// 定義文章互動資料介面
interface ArtActionInter {
    articleId: string;
    title: string;
    isLiked: number;
    isBookmarked: number;
    updateAt: string;
    avatar?: string;
}

// 分頁回傳資料介面
interface PageData<T> {
    records: T[];
    total: number;
    size: number;
    current: number;
    pages: number;
}

const route = useRoute();

// 獲取書籤文章的 API
const fetchBookmarkedArticles = async (page: number) => {
    const userId = route.params.userId;
    if (!userId) return null;

    try {
        const { data } = await http({
            url: http.adornUrl(`/article/user/${userId}/bookmarked-articles`),
            method: 'get',
            params: http.adornParams({ routePage: page })
        }) as { data: R<PageData<ArtActionInter> | ArtActionInter[]> };

        if (data.code === '200' && data.data) {
            if (Array.isArray(data.data)) {
                return data.data.filter(article => article.isBookmarked === 1);
            } else {
                const pageData = data.data as PageData<ArtActionInter>;
                return {
                    records: pageData.records.filter(article => article.isBookmarked === 1),
                    current: pageData.current,
                    pages: pageData.pages
                };
            }
        } else {
            ElMessage.error(data.msg || '獲取書籤文章失敗');
            return null;
        }
    } catch (error) {
        console.error('獲取書籤文章失敗:', error);
        ElMessage.error('獲取書籤文章失敗，請稍後再試');
        return null;
    }
};

// 使用 composable
const { items, isLoading, isLast, load, loadMore } = useInfiniteScroll<ArtActionInter>({
    fetchData: fetchBookmarkedArticles
});

// 監聽 userId 變化重新載入
watch(
    () => route.params.userId,
    () => {
        load();
    }
);

onMounted(() => {
    load();
});
</script>

<style lang="css" scoped>
.user-summary-main-content-bookmarks {
    flex: 1;
    min-width: 0;
    min-height: 300px;
    max-height: 800px;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 100px;
}

.bookmarks-scrollbar {
    height: 100%;
    max-height: 760px;
}

.loading-more {
    text-align: center;
    padding: 1rem;
    color: #a0a0a0;
    font-size: 14px;
}

.no-more {
    text-align: center;
    padding: 1rem;
    color: #666;
    font-size: 14px;
}

.empty-message {
    text-align: center;
    padding: 2rem;
    color: #a0a0a0;
}

.article-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-right: 5px;
}

.article-box {
    background-color: var(--bg-page1);
    width: 100%;
    height: 14vh;
    border-radius: 8px;
    overflow: hidden;
}

.article-title {
    display: flex;
    align-items: center;
    width: 100%;
    height: 60%;
    padding: 0 1rem;
    box-sizing: border-box;
}

.article-title p {
    font-size: 20px;
    font-weight: bold;
    color: #ffffff;
    margin: 0;
}

.article-title a {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
}

.article-author-avatar {
    margin-right: 0.75rem;
}

.article-info {
    width: 100%;
    height: 40%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgba(0, 0, 0, 0.1);
}

.article-metrics {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    padding: 0.5rem;
    box-sizing: border-box;
    color: #a0a0a0;
    font-size: 0.9em;
}

.article-metrics-label {
    text-align: center;
    width: 20%;
}

.article-metrics-value {
    text-align: center;
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

.bookmarked {
    font-size: 0.8em;
    padding: 2px 6px;
    border-radius: 4px;
    background-color: var(--bg-rgba-255-215-0-0p3);
}
</style>
