<template>
    
    <!-- <h1>Auth</h1> -->
     
        <div class="auth-container-main-title">
            <h3>登入頁面</h3>
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
        <div class="auth-container-main-login">

            <div class="auth-container-main-login-item">
                <label>帳號/郵箱</label>
                <br>
                <el-input v-model="accountName" style="width: 240px" placeholder="Please input" ></el-input>
            </div>
            <div class="auth-container-main-login-item">
                <label>密碼</label>
                <br>
                <el-input v-model="password" style="width: 240px" type="password" show-password placeholder="Please input" ></el-input>
            </div>


            <div class="auth-container-main-login-item">
                <el-button type="primary" @click="loginAccount">Login Account</el-button>
            </div>
            
        </div>

</template>

<script setup lang="ts">
import { ref} from 'vue'
import http from '@/utils/httpRequest'
import { ElMessage } from 'element-plus'
import { R } from '@/interface/R'
import { registerDataInterface } from '@/interface/registerDataInterface'
import {useRouter,useRoute} from "vue-router"
import { loginDataInterface } from '@/interface/loginDataInterface'
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

const loginAccount = function(){

    const loginData:loginDataInterface = {

        accountName: accountName.value,
        password: password.value,
    }

    http({
        url: http.adornUrl('/ums/user/login/username'),
        method: 'post',
        data: http.adornData(loginData, false)
    }).then(({data}:{data:R}) => {
        console.log("loginAccount",data)
        switch(Number(data.code)){
            case 200:
                
                ElMessage.success("登入成功");
                
                //登入成功後將Token保存至Cookie中

                document.cookie = `jwtToken=${data.data.token}; path=/; max-age=600;`
                ///TODO 登入後跳轉至原頁面
                const redirect=sessionStorage.getItem("redirect");
                sessionStorage.removeItem("redirect")
                // console.log("redirect",redirect)
                router.push(redirect as string)
                break;
                // document.cookie = `refreshToken=${data.data.refreshToken}; path=/; max-age=600;`


                // window.location.replace(window.location.href);
                
            case 300:
                ElMessage.error("驗證碼錯誤!");
                break;
            // default:
            //     ElMessage.error("註冊失敗，請稍後再試");
            //     break;
        }

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
.auth-container-main-login{
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
.auth-container-main-login{
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 1.5vh;
} */
</style>
