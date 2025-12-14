<template>
    <!-- 文章頁面骨架載入元件 -->
    <div class="article-skeleton-container">
        <!-- 文章標頭骨架 -->
        <div class="skeleton-header">
            <!-- 標題骨架 -->
            <div class="skeleton-title">
                <el-skeleton :rows="1" animated style="width: 70%" />
            </div>
            <!-- 作者資訊骨架 -->
            <div class="skeleton-author-info">
                <el-skeleton-item variant="circle" style="width: 25px; height: 25px" />
                <el-skeleton :rows="1" animated style="width: 120px; margin-left: 10px" />
                <el-skeleton :rows="1" animated style="width: 150px; margin-left: auto" />
            </div>
        </div>

        <!-- 文章內容骨架 -->
        <div class="skeleton-content">
            <el-skeleton :rows="15" animated />
        </div>

        <!-- 文章互動區域骨架 -->
        <div class="skeleton-metrics">
            <div class="skeleton-metric-item" v-for="n in 4" :key="n">
                <el-skeleton-item variant="button" style="width: 60px; height: 36px" />
            </div>
        </div>

        <!-- 留言區骨架 -->
        <div class="skeleton-comments">
            <div class="skeleton-comment" v-for="n in 3" :key="n">
                <div class="skeleton-comment-avatar">
                    <el-skeleton-item variant="circle" style="width: 40px; height: 40px" />
                </div>
                <div class="skeleton-comment-content">
                    <el-skeleton :rows="1" animated style="width: 100px; margin-bottom: 8px" />
                    <el-skeleton :rows="2" animated />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
/*
   文章骨架載入樣式 (Article Skeleton Styles)
*/

.article-skeleton-container {
    padding: 2rem;
    max-width: 100%;
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* 標頭區域 */
.skeleton-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #3d3d3d;
}

.skeleton-title {
    margin-bottom: 1rem;
}

.skeleton-author-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* 內容區域 */
.skeleton-content {
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: var(--bg-hex-2a2d2f);
    border-radius: 8px;
    min-height: 400px;
}

/* 互動指標區域 */
.skeleton-metrics {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem 0;
    border-top: 1px solid #3d3d3d;
    border-bottom: 1px solid #3d3d3d;
}

.skeleton-metric-item {
    display: flex;
    align-items: center;
}

/* 留言區域 */
.skeleton-comments {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.skeleton-comment {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--bg-hex-2a2d2f);
    border-radius: 8px;
}

.skeleton-comment-avatar {
    flex-shrink: 0;
}

.skeleton-comment-content {
    flex: 1;
}
</style>
