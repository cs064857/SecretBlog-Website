<template>
    
        <!-- <h1>Auth</h1> -->
         
            <div class="auth-container-main-title">
                <h3>註冊頁面</h3>
            </div>
            <div class="auth-container-main-mode-switcher">
                <h3>TODO切換按鈕</h3>
                <el-button type="success" @click="switchMode">
                    {{isRegisterMode ? '已有帳號?點此登入' : '沒有帳號?點此註冊'}}
                </el-button>
            </div>
            <div class="auth-container-main-external-providers">
                <h3>TODO第三方鑑權</h3>
            </div>
            <div class="auth-container-main-register">
                <div class="auth-container-main-register-item">
                    <label>姓名</label>
                    <br>
                    <el-input v-model="name" style="width: 240px" placeholder="Please input" ></el-input>
                </div>
                <div class="auth-container-main-register-item">
                    <label>帳號名稱</label>
                    <br>
                    <el-input v-model="accountName" style="width: 240px" placeholder="Please input" ></el-input>
                </div>
                <div class="auth-container-main-register-item">
                    <label>密碼</label>
                    <br>
                    <el-input v-model="password" style="width: 240px" type="password" show-password placeholder="Please input" ></el-input>
                </div>
                <div class="auth-container-main-register-item">
                    <label>確認密碼</label>
                    <br>
                    <el-input v-model="checkPassword" style="width: 240px" type="password" show-password placeholder="Please input" ></el-input>
                </div>
                <div class="auth-container-main-register-item">
                    <label>性別</label>
                    <br>
                    <el-input v-model="gender" style="width: 240px" placeholder="Please input" ></el-input>
                </div>
                <div class="auth-container-main-register-item">
                    <label>信箱</label>
                    <br>
                    <el-input v-model="email" style="width: 240px" placeholder="Please input" ></el-input>
                </div>
                <div class="auth-container-main-register-emailValidCode">
                    <label>驗證碼</label>
                    <br>
                    <el-input v-model="emailValidCode" style="width: 240px" placeholder="Please input" >
                        <template #append>
                            <el-button type="primary" @click="getemailValidCode">發送驗證碼</el-button>
                        </template>
                    </el-input>
                    <!-- <el-button type="primary" @click="getemailValidCode">發送驗證碼</el-button> -->
                </div>
                <div class="auth-container-main-register-item">
                    <el-button type="primary" @click="createAccount">Create Account</el-button>
                </div>
                
            </div>

</template>

<script setup lang="ts">
    import { ref, watchEffect } from 'vue'
    import http from '@/utils/httpRequest'
    import { ElMessage } from 'element-plus'
    import { R } from '@/interface/R'
    import { registerDataInterface } from '@/interface/registerDataInterface'
    import {useRouter,useRoute} from "vue-router"
    const router = useRouter()
    const route = useRoute()
    const name = ref('Name20250224')
    const accountName = ref('Account20250224')
    const password = ref('Password20250224')
    const checkPassword = ref('Password20250224')
    const gender = ref('0')
    const email = ref('Email20250224@gmail.com')
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
            data: http.adornData({email:email.value,accountName:accountName.value}, false)
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
            name: name.value,
            accountName: accountName.value,
            password: password.value,
            checkPassword: checkPassword.value,
            gender: gender.value,
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
                    window.location.replace(window.location.href);
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
/* 當高度寬度 ≤ 1024px 時的樣式 */
@media screen and (max-height: 1024px) {



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
