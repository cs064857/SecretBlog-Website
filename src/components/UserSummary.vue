<template>
    <div class="user-summary-main-content">

        <div class="user-summary-main-content-statistics">
            <h2>使用者指標</h2>
        </div>

        <!-- 新增導航欄 -->
        <div class="user-summary-nav-tabs">
            <div class="nav-tab-item" :class="{ active: activeTab === 'likes' }" @click="setActiveTab('likes')">
                喜歡
            </div>
            <div class="nav-tab-item" :class="{ active: activeTab === 'bookmarks' }" @click="setActiveTab('bookmarks')">
                書籤
            </div>
            <div class="nav-tab-item" :class="{ active: activeTab === 'comments' }" @click="setActiveTab('comments')">
                留言
            </div>
        </div>

        <div class="user-summary-main-content-actions">
            <div class="user-summary-main-content-actions-item">
                <!-- 喜歡列表子元件 -->
                <LikedArticlesList v-if="activeTab === 'likes'" />
                <!-- 書籤列表子元件 -->
                <BookmarkedArticlesList v-if="activeTab === 'bookmarks'" />
                <!-- 留言列表子元件 -->
                <UserCommentsList v-if="activeTab === 'comments'" />
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 子元件
import LikedArticlesList from '@/components/user/LikedArticlesList.vue';
import BookmarkedArticlesList from '@/components/user/BookmarkedArticlesList.vue';
import UserCommentsList from '@/components/user/UserCommentsList.vue';

// 標籤頁狀態
const activeTab = ref('likes');
const setActiveTab = (tab: string) => {
    activeTab.value = tab;
};
</script>

<style lang="css" scoped>
/* 最外層 */
.user-summary-main-content {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;
}

/* 第一層 */
.user-summary-main-content-actions {
    display: flex;
    flex-direction: column;
}

/* 第二層 */
.user-summary-main-content-actions-item {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.user-summary-main-content-statistics {
    text-align: center;
    margin-bottom: 20px;
}

/* 導航欄樣式 */
.user-summary-nav-tabs {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
}

.nav-tab-item {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    padding: 8px 16px;
    position: relative;
    transition: all 0.3s ease;
}

.nav-tab-item:hover {
    color: #ffffff;
}

.nav-tab-item.active {
    color: #ffffff;
    font-weight: 600;
}

.nav-tab-item.active::after {
    content: '';
    position: absolute;
    bottom: -11px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #409eff;
    border-radius: 3px 3px 0 0;
}
</style>
