<template>
    <div class="auth-container-main-reset-password">
        <h1 style="color: #C9DDFF;font-size:2.25rem;">Reset your password</h1>

        <div v-if="verifying" class="status-container">
            <el-icon class="is-loading" :size="30" color="#C9DDFF">
                <Loading />
            </el-icon>
            <p>正在驗證連結有效性...</p>
        </div>

        <div v-else-if="!isTokenValid" class="status-container error">
            <el-icon :size="50" color="#f56c6c">
                <CircleClose />
            </el-icon>
            <p>{{ errorMsg }}</p>
            <el-button type="primary" @click="$router.push('/auth/forgot-password')"
                style="margin-top: 20px;">重新申請重設連結</el-button>
        </div>

        <div v-else class="reset-form">
            <div class="auth-container-main-forgot-password-item">
                <label for="newPassword" class="auth-label">New Password</label>
                <br>
                <el-input id="newPassword" v-model="form.newPassword" type="password" style="width: 400px"
                    placeholder="Enter new password" show-password></el-input>
            </div>

            <div class="auth-container-main-forgot-password-item">
                <label for="confirmPassword" class="auth-label">Confirm Password</label>
                <br>
                <el-input id="confirmPassword" v-model="form.confirmPassword" type="password" style="width: 400px"
                    placeholder="Confirm new password" show-password></el-input>
            </div>

            <div class="auth-container-main-forgot-password-item">
                <el-button type="primary" @click="handleResetPassword" :loading="submitting"
                    style="width: 400px;height: 40px;">Update Password</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import '@/assets/css/auth-styles.css'
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { verifyResetTokenRequest, resetPasswordRequest } from '@/requests/userAuthRequest'
import { ElMessage } from 'element-plus'
import { Loading, CircleClose } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const verifying = ref(true)
const isTokenValid = ref(false)
const errorMsg = ref('連結已過期或無效')
const submitting = ref(false)

const form = reactive({
    token: '',
    newPassword: '',
    confirmPassword: ''
})

onMounted(async () => {
    const token = route.query.token as string
    if (!token) {
        verifying.value = false
        isTokenValid.value = false
        errorMsg.value = '無效的請求，缺少 Token'
        return
    }

    form.token = token

    try {
        const { data } = await verifyResetTokenRequest(token)
        if (data.code === "200") {
            isTokenValid.value = true
        } else {
            isTokenValid.value = false
            errorMsg.value = data.msg || '連結已過期或無效'
        }
    } catch (error) {
        isTokenValid.value = false
        errorMsg.value = '驗證出錯，請稍後再試'
    } finally {
        verifying.value = false
    }
})

const handleResetPassword = async () => {
    if (!form.newPassword || !form.confirmPassword) {
        ElMessage.warning("請填寫完整密碼欄位")
        return
    }

    if (form.newPassword !== form.confirmPassword) {
        ElMessage.warning("兩次輸入的密碼不一致")
        return
    }

    submitting.value = true
    try {
        const { data } = await resetPasswordRequest(form)
        if (data.code === "200") {
            ElMessage.success("密碼重設成功，請使用新密碼登入")
            router.push('/auth/login')
        } else {
            ElMessage.error(data.msg || "重設失敗")
        }
    } catch (error) {
        ElMessage.error("請求出錯，請稍後再試")
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
.auth-container-main-reset-password {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 400px;
}

.status-container {
    text-align: center;
    color: #C9DDFF;
    margin-top: 50px;
}

.status-container.error p {
    color: #f56c6c;
    margin-top: 15px;
    font-size: 1.1rem;
}

.reset-form {
    margin-top: 30px;
}

.auth-container-main-forgot-password-item {
    margin-bottom: 25px;
}

.auth-label {
    display: inline-block;
    margin-bottom: 8px;
    color: #C9DDFF;
}
</style>
