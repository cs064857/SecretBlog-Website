<template>
    <!-- 空狀態或錯誤狀態元件 -->
    <div class="empty-or-error-container">
        <div class="state-icon">📭</div>
        <p class="state-message">{{ message || '發生錯誤' }}</p>
        <el-button v-if="showRetry" type="primary" @click="handleRetry">
            重新嘗試
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
    message?: string;
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
/*
   空狀態/錯誤狀態樣式
 */

.empty-or-error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: #999;
    min-height: 60vh;
}

.state-icon {
    font-size: 80px;
    margin-bottom: 1.5rem;
    opacity: 0.7;
}

.state-message {
    font-size: 20px;
    margin-bottom: 2rem;
    color: #888;
    text-align: center;
}
</style>
