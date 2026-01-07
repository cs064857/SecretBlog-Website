<template>
    <h1 style="color: #C9DDFF;font-size:2.25rem;">Reset your password</h1>
    <div class="auth-container-main-forgot-password">

        <div class="auth-container-main-forgot-password-item">
            <label for="email" class="auth-label">Email</label>
            <br>
            <el-input id="email" v-model="email" style="width: 400px" placeholder="Please input"></el-input>
        </div>
        <div class="auth-container-main-forgot-password-item">

            <el-button type="primary" @click="handleForgotPassword" :loading="submitting" :disabled="submitting"
                style="width: 400px;height: 40px;">Reset
                Password</el-button>

        </div>

    </div>
</template>

<script setup lang="ts">
import '@/assets/css/auth-styles.css'
import { ref } from 'vue'
import { forgotPasswordRequest } from '@/requests/userAuthRequest'
import { ElMessage, ElLoading } from 'element-plus'

const email = ref('');
const submitting = ref(false)
const handleForgotPassword = async function () {
    if (submitting.value) return
    if (!email.value) {
        ElMessage.warning("請輸入 Email");
        return;
    }

    submitting.value = true
    const loading = ElLoading.service({
        lock: true,
        text: '正在發送重設連結...',
        background: 'rgba(0, 0, 0, 0.7)',
    });

    try {
        const { data } = await forgotPasswordRequest(email.value);
        if (data.code === "200") {
            ElMessage.success(data.msg || "重設連結已發送至您的郵箱");
        } else {
            ElMessage.error(data.msg || "發送失敗");
        }
    } catch (error) {
        ElMessage.error("發送出錯，請稍後再試");
    } finally {
        loading.close();
        submitting.value = false
    }
}
</script>


<style scoped>
@media screen and (max-height: 2000px) {
    .auth-container-main-forgot-password {
        display: flex;
        flex-direction: column;

        justify-self: center;
        justify-items: center;
        justify-content: center;
        align-items: center;
        align-content: center;
        align-self: center;

        min-height: 300px;
    }

}
</style>
