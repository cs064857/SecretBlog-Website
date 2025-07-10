<template>
    
        <!-- <h1>Auth</h1> -->
         
            <div class="auth-container-main-title">
                <h1  style="color: #C9DDFF;margin-left: -180px;">Create an account</h1>
            </div>
            <div class="auth-container-main-mode-switcher">

                <!-- <el-button style="margin: 20px 20px;min-height: 50px;" type="success" @click="switchMode">
                    {{isRegisterMode ? 'Already have an account?Login➔' : '沒有帳號?點此註冊'}}
                </el-button> -->

                    <span " v-if="isRegisterMode">Already have an account?</span>
                    <span v-else>沒有帳號?點此點此</span>
                    <a  @click="switchMode" style="color: #C9DDFF;cursor: pointer" v-if="isRegisterMode">Login➔</a>
                    <!-- {{isRegisterMode ? 'Already have an account?Login➔' : '沒有帳號?點此註冊'}} -->

            </div>
            <div class="auth-container-main-external-providers">
                <h1>TODO第三方鑑權</h1>
            </div>
            <div class="auth-container-main-register">
                <!-- <div class="auth-container-main-register-item">
                    <label>姓名</label>
                    <br>
                    <el-input v-model="name" style="width: 240px" placeholder="Please input" ></el-input>
                </div> -->
                <!-- <div class="auth-container-main-register-item">
                    <label>帳號名稱</label>
                    <br>
                    <el-input v-model="accountName" style="width: 240px" placeholder="Please input" ></el-input>
                </div> -->
                <div class="auth-container-main-register-item">
                    <label for="email" class="auth-label"">Email</label>
                    <!-- <label style="color: #C9DDFF";font-size:14px>Email</label> -->
                    <br>
                    <el-input id="email" v-model="email" style="width: 400px" placeholder="Please input" ></el-input>
                </div>
                <div class="auth-container-main-register-item">
                    <label for="password" class="auth-label"">Password</label>
                    <!-- <label style="color: #C9DDFF;font-size:14px">Password</label> -->
                    <br>
                    <el-input id="password" v-model="password" style="width: 400px" type="password" show-password placeholder="Please input" ></el-input>
                </div>
                <!-- <div class="auth-container-main-register-item">
                    <label>確認密碼</label>
                    <br>
                    <el-input v-model="checkPassword" style="width: 240px" type="password" show-password placeholder="Please input" ></el-input>
                </div> -->
                <!-- <div class="auth-container-main-register-item">
                    <label>性別</label>
                    <br>
                    <el-input v-model="gender" style="width: 240px" placeholder="Please input" ></el-input>
                </div> -->

                <div class="auth-container-main-register-emailValidCode">
                    <label for="verificationCode" class="auth-label"">Verification code</label>
                    <br>
                    <el-input id="verificationCode" v-model="emailValidCode" style="width: 400px" placeholder="Please input" >
                        <template #append>
                            <el-button type="primary" @click="getemailValidCode">發送驗證碼</el-button>
                        </template>
                    </el-input>
                    <!-- <el-button type="primary" @click="getemailValidCode">發送驗證碼</el-button> -->
                </div>
                <div class="auth-container-main-register-item">
                    <el-button type="primary" @click="createAccount" style="width: 400px;height: 40px;">Create Account</el-button>
                </div>
                
            </div>
            <div class="auth-container-main-captcha"><h1>TodoCaptcha</h1></div>

</template>

<script setup lang="ts">
    import '@/assets/css/auth-styles.css'
    import { ref, watchEffect } from 'vue'
    import http from '@/utils/httpRequest'
    import { ElMessage } from 'element-plus'
    import { R } from '@/interface/R'
    import { registerDataInterface } from '@/interface/registerDataInterface'
    import {useRouter,useRoute} from "vue-router"
    const router = useRouter()
    const route = useRoute()
    // const name = ref('Name20250224')
    // const accountName = ref('Account20250224')
    const password = ref('Password20250705')
    // const checkPassword = ref('Password20250224')
    // const gender = ref('0')
    const email = ref('Email20250705@gmail.com')
    const emailValidCode = ref('')
    const isRegisterMode = ref<boolean>(true)

    const switchMode = function(){
        isRegisterMode.value = !isRegisterMode.value
        router.push(isRegisterMode.value ? '/auth/register' : '/auth/login')
    }
    const getemailValidCode = function(){
        http({
            url: http.adornUrl('/ums/user/email-verify-code'),
            method: 'post',
            // data: http.adornData({email:email.value,accountName:accountName.value}, false)
            data: http.adornData({email:email.value}, false)
        }).then(({data}:{data:R}) => {
            switch(data.code){
                case 200:
                    ElMessage.success("發送驗證碼成功");
                    // console.log("getemailValidCode",data)
                    break;
                case 302:
                    ElMessage.error("帳號已被占用!");
                    break;
                case 303:
                    ElMessage.error("信箱已被占用!");
                    break;
                case 406:
                    ElMessage.error("驗證碼請求次數過多，請稍後再試。");
                    break;
                default:
                    ElMessage.error("發送驗證碼失敗，請稍後再試");
                    break;
            }
            // if (data.code == 200) {
            //     ElMessage.success("發送驗證碼成功");
            //     console.log("getemailValidCode",data)

            // } else {
            //     ElMessage.error("發送驗證碼失敗，請稍後再試");
            // }
            return data
        });
    }

    const createAccount = function(){

        const registerData:registerDataInterface = {
            // name: name.value,
            // accountName: accountName.value,
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
        }).then(({data}:{data:R}) => {
            switch(data.code){
                case 200:
                    ElMessage.success("註冊成功");
                    ///TODO 註冊成功後跳轉到登入頁面
                    // window.location.replace(window.location.href);
                    router.push('/auth/login')
                    break;
                case 300:
                    ElMessage.error("驗證碼錯誤!");
                    break;
                default:
                    ElMessage.error("註冊失敗，請稍後再試");
                    break;
            }
            // if (data.code == 200) {
            //     ElMessage.success("註冊成功");
            //     ///TODO 註冊成功後跳轉到登入頁面
            //     window.location.replace(window.location.href);
            // }
            // else if(data.code == 300){
            //     ElMessage.error("驗證碼錯誤!");
            // }
            // else {
            //     ElMessage.error("註冊失敗，請稍後再試");
            // }
            return data
        });
    }
    
    
</script>

<style scoped>

@media screen and (max-height: 2000px) {



.auth-container-main-title{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10%;
    min-height: 10%;
    max-height: 10%;
    border: 5px solid #723939;
}
.auth-container-main-mode-switcher{
    display: flex;
    justify-content: center;
    align-content: center;
    border: 5px solid #b92ab2;
}
.auth-container-main-external-providers{
    border: 5px solid #2f77a0;
}
.auth-container-main-register{
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5vh;
}
}

.auth-container-main-captcha{
        margin-top: 25px;
        min-height: 150px;
        border: 5px solid #7c2fa0;
    }
.auth-container-main-forget-password{
    margin-top: 25px;
    min-height: 150px;
    border: 5px solid #2f77a0;
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
