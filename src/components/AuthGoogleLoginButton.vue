<template>
    <el-button class="auth-google-login-button" @click="handleGoogleLogin">
        <span class="google-content">
            <img src="@/assets/google-color.svg" width="20" height="20" alt="Google Logo">
            Continue with Google
        </span>
    </el-button>
</template>

<script setup lang="ts">
// Google 登入
const handleGoogleLogin = () => {
    // 直接重導向到後端的 OAuth2 授權端點
    // 透過 Gateway 轉發
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    window.location.href = `${apiBaseUrl}/oauth2/authorization/google`
}
</script>

<style scoped>
.auth-google-login-button {
    width: 400px;
    height: 40px;
    border-radius: 4px;
    background-color: var(--bg-page);
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.google-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}
</style>
