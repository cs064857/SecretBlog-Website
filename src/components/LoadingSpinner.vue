<template>
    <!-- 統一載入中/錯誤狀態元件 -->

    <!-- 載入中狀態 -->
    <div v-if="!error" class="loading-container">
        <div class="loading-spinner">
            <el-icon class="is-loading" :size="48">
                <Loading />
            </el-icon>
        </div>
        <p v-if="text" class="loading-text">{{ text }}</p>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else class="error-state">
        <div class="error-icon">⚠️</div>
        <p class="error-message">{{ error }}</p>
        <el-button v-if="showRetry" type="primary" @click="handleRetry">
            重新嘗試
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue';

const props = defineProps<{
    text?: string;
    error?: string | null;
    showRetry?: boolean;
}>();

const emit = defineEmits<{
    (e: 'retry'): void;
}>();

const handleRetry = () => {
    emit('retry');
};
</script>

<style scoped>
/* 載入中狀態樣式 */
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

/* 錯誤狀態樣式 */
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: #999;
    min-height: 40vh;
}

.error-icon {
    font-size: 64px;
    margin-bottom: 1.5rem;
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}

.error-message {
    font-size: 18px;
    margin-bottom: 1.5rem;
    color: #ff6b6b;
    text-align: center;
}
</style>
