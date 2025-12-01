<template>
    <div class="user-summary-main-content">


        <div class="user-summary-main-content-statistics">
            <h2>用戶指標statistics</h2>
        </div>

        <div class="user-summary-main-content-actions">
            <div class="user-summary-main-content-actions-title">
                <h1>操作列表</h1>
            </div>
            <div class="user-summary-main-content-actions-item">

                <div class="user-summary-main-content-likes">

                    <h2>likes列表</h2>

                    <div v-if="likedArticles.length === 0" class="empty-message">
                        <p>目前沒有點讚的文章</p>
                    </div>
                    <div v-else class="article-list">
                        <div v-for="article in likedArticles" :key="article.articleId" class="article-item">
                            <h3>{{ article.title }}</h3>
                            <p class="article-meta">
                                <span>文章 ID: {{ article.articleId }}</span>
                                <span>更新時間: {{ formatDate(article.updateAt) }}</span>
                            </p>
                            <div class="article-actions">
                                <span class="liked">❤️ 已點讚</span>
                                <span v-if="article.isBookmarked === 1" class="bookmarked">🔖 已收藏</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="user-summary-main-content-bookmarks">
                    <h2>bookmarks列表</h2>
                    <div v-if="bookmarkedArticles.length === 0" class="empty-message">
                        <p>目前沒有收藏的文章</p>
                    </div>
                    <div v-else class="article-list">
                        <div v-for="article in bookmarkedArticles" :key="article.articleId" class="article-item">
                            <h3>{{ article.title }}</h3>
                            <p class="article-meta">
                                <span>文章 ID: {{ article.articleId }}</span>
                                <span>更新時間: {{ formatDate(article.updateAt) }}</span>
                            </p>
                            <div class="article-actions">
                                <span v-if="article.isLiked === 1" class="liked">❤️ 已點讚</span>
                                <span class="bookmarked">🔖 已收藏</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="user-summary-main-content-comments">
                <h2>留言列表</h2>
                <div v-if="userComments.length === 0" class="empty-message">
                    <p>目前沒有留言</p>
                </div>
                <div v-else class="article-list">
                    <div v-for="comment in userComments" :key="comment.commentId" class="article-item">
                        <h3>{{ comment.articleTitle }}</h3>
                        <p class="article-meta">
                            <span>文章 ID: {{ comment.articleId }}</span>
                            <span>留言時間: {{ formatDate(comment.createAt) }}</span>
                        </p>
                        <div class="article-content">
                            <p>{{ comment.commentContent }}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";

import http from "@/utils/httpRequest.js";
import { ElMessage } from "element-plus";
import type { R } from "@/interface/R.ts";
import { getCookieValue } from "@/utils/jwtUtils.ts";
import { useRouter, useRoute } from "vue-router";
import { getUserCommentsRequest } from "@/requests/userRequest";
import { AmsUserCommentVo } from "@/interface/amsUserCommentVo";

// 定義文章互動資料介面（與後端 UserLikedArticleVo 對應）
interface ArtActionInter {
    articleId: string;
    title: string;
    isLiked: number;  // 0 或 1，1 表示已點讚
    isBookmarked: number;  // 0 或 1，1 表示已收藏
    updateAt: string;  // 最後互動時間
}

// 存儲所有文章互動資料
const artActionData = ref<ArtActionInter[]>([]);
const userComments = ref<AmsUserCommentVo[]>([]);

// 計算屬性：篩選出點讚的文章
const likedArticles = computed(() => {
    return artActionData.value.filter(article => article.isLiked === 1);
});

// 計算屬性：篩選出收藏的文章
const bookmarkedArticles = computed(() => {
    return artActionData.value.filter(article => article.isBookmarked === 1);
});

// 格式化日期顯示
const formatDate = (dateStr: string): string => {
    if (!dateStr) return "未知";
    const date = new Date(dateStr);
    return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};
const router = useRouter();;
const route = useRoute();;

// 獲取用戶留言列表
const fetchUserComments = () => {
    const userId = route.params.userId as string;
    if (!userId) return;

    getUserCommentsRequest(userId).then((data) => {
        if (data.code === "200" && data.data) {
            userComments.value = data.data;
        } else {
            ElMessage.error(data.msg || "獲取用戶留言失敗");
        }
    }).catch((error) => {
        console.error("獲取用戶留言失敗:", error);
        ElMessage.error("獲取用戶留言失敗");
    });
};

// 獲取用戶點讚文章列表
const fetchLikedArticles = () => {

    const userId = route.params.userId;
    console.log("fetchLikedArticles userId:", userId)

    // 從 Cookie 中獲取當前用戶的 ID
    // const userId = getCookieValue('userId');

    if (!userId) {
        ElMessage.error("無法獲取用戶 ID，請先登入");
        return;
    }

    console.log("開始獲取用戶點讚文章列表，userId:", userId);

    http({
        url: http.adornUrl(`/article/user/${userId}/liked-articles`),
        method: 'get',
    }).then(({ data }: { data: R<ArtActionInter[]> }) => {
        console.log("獲取的資料:", data);
        if (data.code === "200" && data.data) {
            artActionData.value = data.data;
            console.log("點讚文章資料:", likedArticles.value);
            console.log("收藏文章資料:", bookmarkedArticles.value);
            ElMessage.success("用戶互動資料獲取成功");
        } else {
            ElMessage.error(data.msg || "用戶互動資料獲取失敗");
        }
    }).catch((error) => {
        console.error("獲取用戶互動資料失敗:", error);
        ElMessage.error("獲取用戶互動資料失敗，請稍後再試");
    });
};

// 組件掛載時自動調用 API
onMounted(() => {
    console.log("UserSummary 組件已掛載，準備獲取資料");
    fetchLikedArticles();
    fetchUserComments();
});
</script>
<style lang="css" scoped>
/* 最外層 */
.user-summary-main-content {
    display: flex;
    flex-direction: column;
    min-height: 100%;
}

/* 第一層 */
.user-summary-main-content-actions {

    display: flex;
    flex-direction: column;
}
/* 第二層 */
.user-summary-main-content-actions-item{

    display: flex;
    flex-direction: row;
}

.user-summary-main-content-likes,
.user-summary-main-content-bookmarks,
.user-summary-main-content-comments {
    flex: 1;
    min-height: 300px;
    max-height: 800px;
    padding: 20px;
    border-radius: 8px;
    background-color: #2c3e50;
    margin-bottom: 100px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.user-summary-main-content-likes {
    background-color: #194279;
}

.user-summary-main-content-bookmarks {
    background-color: #812781;
}


.article-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.article-item {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 6px;
    border-left: 3px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;

}

.article-item:hover {
    background-color: rgba(255, 255, 255, 0.15);
    border-left-color: rgba(255, 255, 255, 0.6);
    transform: translateX(5px);
}

.article-item h3 {
    margin: 0 0 10px 0;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
}

.article-meta {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 10px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
}

.article-actions {
    display: flex;
    gap: 10px;
    font-size: 13px;
}

.article-actions span {
    padding: 4px 8px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
}

.liked {
    background-color: rgba(255, 99, 71, 0.3) !important;
}

.bookmarked {
    background-color: rgba(255, 215, 0, 0.3) !important;
}

/* 標題樣式優化 */
.user-summary-main-content-likes h2,
.user-summary-main-content-bookmarks h2,
.user-summary-main-content-comments h2 {
    color: #ffffff;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}
</style>