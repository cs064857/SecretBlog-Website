<template>

    <!-- <h1>Auth</h1> -->

    <div class="auth-container-main-title">
        <h1 style="color: #C9DDFF;margin-left: -180px;">Create an account</h1>
    </div>
    <div class="auth-container-main-mode-switcher">

        <!-- <el-button style="margin: 20px 20px;min-height: 50px;" type="success" @click="switchMode">
                    {{isRegisterMode ? 'Already have an account?Login➔' : '沒有帳號?點此註冊'}}
                </el-button> -->

        <span v-if="isRegisterMode">Already have an account?</span>
        <span v-else>沒有帳號?點此點此</span>
        <a @click="switchMode" style="color: #C9DDFF;cursor: pointer" v-if="isRegisterMode">Login➔</a>
        <!-- {{isRegisterMode ? 'Already have an account?Login➔' : '沒有帳號?點此註冊'}} -->

    </div>
    <hr />
    <div class="auth-container-main-external-providers">
        <AuthGoogleLoginButton />
    </div>
    <div class="auth-container-main-register">
        <!-- <div class="auth-container-main-register-item">
                    <label>姓名</label>
                    <br>
                    <el-input v-model="name" style="width: 240px" placeholder="Please input" ></el-input>
                </div> -->
        <div class="auth-container-main-register-item">
            <label for="accountName" class="auth-label">Account</label>
            <br>
            <el-input id="accountName" v-model="accountName" style="width: 400px" placeholder="Please input"></el-input>
        </div>
        <div class="auth-container-main-register-item">
            <label for="email" class="auth-label">Email</label>
                    <!-- <label style=" color: #C9DDFF";font-size:14px>Email</label> -->
            <br>
            <el-input id="email" v-model="email" style="width: 400px" placeholder="Please input"></el-input>
        </div>
        <div class="auth-container-main-register-item">
            <label for="password" class="auth-label">Password</label>
                    <!-- <label style=" color: #C9DDFF;font-size:14px">Password</label> -->
            <br>
            <el-input id="password" v-model="password" style="width: 400px" type="password" show-password
                placeholder="Please input"></el-input>
        </div>
        <div class="auth-container-main-register-item">
            <label for="checkPassword" class="auth-label">Confirm Password</label>
            <br>
            <el-input id="checkPassword" v-model="checkPassword" style="width: 400px" type="password" show-password
                placeholder="Please input"></el-input>
        </div>

        <div class="auth-container-main-register-item">
            <label for="captchaCode" class="auth-label">圖形驗證碼</label>
            <br>
            <div class="auth-captcha-row">
                <el-input id="captchaCode" v-model="captchaCode" style="width: 260px" placeholder="請輸入圖形驗證碼"
                    :disabled="captchaLoading"></el-input>
                <div class="auth-captcha-image-wrapper" :class="{ 'is-loading': captchaLoading }" @click="refreshCaptcha"
                    :title="captchaLoading ? '載入中...' : '點擊刷新'">
                    <img v-if="captchaImgSrc" class="auth-captcha-img" :src="captchaImgSrc" alt="圖形驗證碼" />
                    <div v-else class="auth-captcha-placeholder">{{ captchaLoading ? '載入中...' : '點擊取得' }}</div>
                </div>
            </div>
            <div class="auth-captcha-hint">看不清楚？點擊圖片刷新</div>
        </div>

        <!-- <div class="auth-container-main-register-item">
                    <label>性別</label>
                    <br>
                    <el-input v-model="gender" style="width: 240px" placeholder="Please input" ></el-input>
                </div> -->

        <div class="auth-container-main-register-emailValidCode">
            <label for="verificationCode" class="auth-label">Verification code</label>
            <br>
            <el-input id="verificationCode" v-model="emailValidCode" style="width: 400px" placeholder="Please input">
                <template #append>
                    <el-button type="primary" @click="getemailValidCode" :loading="emailCodeSubmitting"
                        :disabled="emailCodeSubmitting">發送驗證碼</el-button>
                </template>
            </el-input>
            <!-- <el-button type="primary" @click="getemailValidCode">發送驗證碼</el-button> -->
        </div>
        <div class="auth-container-main-register-item">
            <el-button type="primary" @click="createAccount" :loading="submitting" :disabled="submitting"
                style="width: 400px;height: 40px;">Create
                Account</el-button>
        </div>

    </div>

</template>

<script setup lang="ts">
import '@/assets/css/auth-styles.css'
import AuthGoogleLoginButton from '@/components/AuthGoogleLoginButton.vue'
import { ref, onMounted } from 'vue'
import http from '@/utils/httpRequest'
import { ElMessage } from 'element-plus'
import { R } from '@/interface/R'
import { registerDataInterface } from '@/interface/registerDataInterface'
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
// const name = ref('Name20250224')
const accountName = ref('Account20250705')
const password = ref('Password20250705')
const checkPassword = ref('Password20250705')
// const gender = ref('0')
const email = ref('Email20250705@gmail.com')
const captchaCode = ref('')
const captchaKey = ref('')
const captchaImgSrc = ref('')
const captchaLoading = ref(false)
const emailValidCode = ref('')
const isRegisterMode = ref<boolean>(true)
const emailCodeSubmitting = ref(false)
const submitting = ref(false)

function normalizeCaptchaImageSrc(raw: string) {
    const s = String(raw || '').trim()
    if (!s) return ''
    if (s.startsWith('data:image/')) return s
    return `data:image/png;base64,${s}`
}

const refreshCaptcha = async () => {
    if (captchaLoading.value) return
    captchaLoading.value = true

    try {
        const { data } = await http({
            url: http.adornUrl('/ums/user/captcha'),
            method: 'get',
            // 加上時間戳避免瀏覽器/代理快取，確保每次都取得新圖形驗證碼
            params: http.adornParams()
        })

        if (!data || String(data.code) !== '200') {
            throw new Error(data?.msg || '取得圖形驗證碼失敗')
        }

        const captchaData = data.data || {}
        const key = captchaData.key
        const image = captchaData.base64

        if (!key || !image) {
            throw new Error('取得圖形驗證碼失敗，後端回傳格式不完整')
        }

        captchaKey.value = String(key)
        captchaImgSrc.value = normalizeCaptchaImageSrc(String(image))
        captchaCode.value = ''
    } catch (e: any) {
        captchaKey.value = ''
        captchaImgSrc.value = ''
        captchaCode.value = ''
        ElMessage.error(e?.message || '取得圖形驗證碼失敗，請稍後再試')
    } finally {
        captchaLoading.value = false
    }
}

onMounted(() => {
    refreshCaptcha()
})

const switchMode = function () {
    isRegisterMode.value = !isRegisterMode.value
    router.push(isRegisterMode.value ? '/auth/register' : '/auth/login')
}
const getemailValidCode = function () {
    if (emailCodeSubmitting.value) return

    if (!email.value) {
        ElMessage.warning('請先輸入 Email')
        return
    }

    if (!captchaCode.value || !captchaKey.value) {
        ElMessage.warning('請先輸入圖形驗證碼')
        return
    }

    emailCodeSubmitting.value = true
    http({
        url: http.adornUrl('/ums/user/email-verify-code'),
        method: 'post',
        data: http.adornData(
            {
                email: email.value,
                accountName: accountName.value,
                captchaCode: captchaCode.value,
                captchaKey: captchaKey.value
            },
            false
        )
    }).then(({ data }: { data: R }) => {
        switch (String(data.code)) {
            case "200":
                ElMessage.success(data.msg || "發送驗證碼成功");
                refreshCaptcha()
                break;
            case "4010":
                ElMessage.error(data.msg || "圖形驗證碼錯誤，請重新輸入");
                refreshCaptcha()
                break;
            case "4008":
                ElMessage.error(data.msg || "帳號已被占用!");
                break;
            case "4009":
                ElMessage.error(data.msg || "信箱已被占用!");
                break;
            case "1013":
                ElMessage.error(data.msg || "驗證碼請求次數過多，請稍後再試。");
                break;
            default:
                ElMessage.error(data.msg || "發送驗證碼失敗，請稍後再試");
                break;
        }
        return data
    }).catch(() => {
        ElMessage.error("請求出錯，請稍後再試")
    }).finally(() => {
        emailCodeSubmitting.value = false
    });
}

const createAccount = function () {
    if (submitting.value) return
    submitting.value = true

    const registerData: registerDataInterface = {
        // name: name.value,
        accountName: accountName.value,
        password: password.value,
        // checkPassword: checkPassword.value,
        // gender: gender.value,
        email: email.value,
        emailValidCode: emailValidCode.value
    }

    http({
        url: http.adornUrl('/ums/user/register'),
        method: 'post',
        data: http.adornData(registerData, false)
    }).then(({ data }: { data: R }) => {
        switch (String(data.code)) {
            case "200":
                ElMessage.success("註冊成功");
                ///TODO 註冊成功後跳轉到登入頁面
                // window.location.replace(window.location.href);
                router.push('/auth/login')
                break;
            case "300":
                ElMessage.error("驗證碼錯誤!");
                break;
            default:
                ElMessage.error("註冊失敗，請稍後再試");
                break;
        }
        return data
    }).catch(() => {
        ElMessage.error("請求出錯，請稍後再試")
    }).finally(() => {
        submitting.value = false
    });
}


</script>

<style scoped>
@media screen and (max-height: 2000px) {



    .auth-container-main-title {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 10%;
        min-height: 10%;
        max-height: 10%;
        /* border: 5px solid #723939; */
    }

    .auth-container-main-mode-switcher {
        /* display: flex;
    justify-content: center;
    align-content: right; */
        /* border: 5px solid #b92ab2; */

        text-align: right;
    }

    .auth-container-main-external-providers {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .auth-container-main-register {
        margin-top: 25px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1.5vh;
    }
}

.auth-captcha-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.auth-captcha-image-wrapper {
    width: 128px;
    height: 40px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background: #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.auth-captcha-image-wrapper.is-loading {
    cursor: wait;
    opacity: 0.85;
}

.auth-captcha-img {
    width: 100%;
    height: 100%;
}

.auth-captcha-placeholder {
    font-size: 12px;
    color: #909399;
}

.auth-captcha-hint {
    margin-top: 6px;
    font-size: 12px;
    color: #C9DDFF;
    opacity: 0.75;
}

hr {
    border: 1px solid #ccc;
}

/* .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    background-color: #373737;
}
.auth-container-main{
    border: 2px solid #fff;
    width: 40%;
    height: 85%;
    min-height: 85%;
    max-height: 85%;
}
.auth-container-main-title{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10%;
    min-height: 10%;
    max-height: 10%;
    border: 5px solid #723939;
}
.auth-container-main-register{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5vh;
} */
</style>
