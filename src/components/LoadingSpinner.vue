<template>
    <!-- 統一載入中頁面元件 -->
    <div class="loading-container">
        <div class="loading-spinner">
            <el-icon class="is-loading" :size="48">
                <Loading />
            </el-icon>
        </div>
        <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue';

defineProps<{
    text?: string;
}>();
</script>

<style scoped>
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    width: 100%;
}

.loading-spinner {
    color: #409eff;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.loading-text {
    margin-top: 1rem;
    color: #888;
    font-size: 16px;
}
</style>
