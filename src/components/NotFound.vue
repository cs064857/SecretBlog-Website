<!-- src/components/NotFound.vue -->
<template>
    <div class="not-found-container">
        <div class="error-content">
            <h1 class="error-code">404</h1>
            <p class="error-message">抱歉，您訪問的頁面不存在</p>
            <div class="error-actions">
                <el-button type="primary" @click="goHome">
                    返回首頁
                </el-button>
                <el-button @click="goBack">
                    返回上一頁
                </el-button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const goHome = () => {
    router.push('/Home/2?page=1');
};
const goBack = () => {
    router.go(-1);
};
</script>
<style scoped>
.not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}
.error-content {
    text-align: center;
    color: #fff;
}
.error-code {
    font-size: 120px;
    font-weight: bold;
    margin: 0;

}
.error-message {
    font-size: 24px;
    margin: 20px 0 40px;
    color: #a0a0a0;
}
.error-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
}
</style>