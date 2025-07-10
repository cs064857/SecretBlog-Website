<template>
    
    <!-- <h1>Auth</h1> -->
     
        <div class="auth-container-main-title">
            <h1  style="color: #C9DDFF;margin-left: -350px;">Log in</h1>
        </div>
        <div class="auth-container-main-mode-switcher">
            <!-- <el-button type="success" @click="switchMode">
                {{isRegisterMode ? '已有帳號?點此登入' : '沒有帳號?點此註冊'}}
            </el-button> -->
            <span>Need an account?</span>
            <a  @click="switchMode" style="color: #C9DDFF;cursor: pointer">SingUp➔</a>

        </div>
        <div class="auth-container-main-external-providers">
            <h1>TODO第三方鑑權</h1>
        </div>
        <div class="auth-container-main-login">

            <div class="auth-container-main-login-item">
                <label for="emailOrAccount" class="auth-label">Email/Account</label>
                <br>
                <el-input id="emailOrAccount" v-model="accountName" style="width: 400px" placeholder="Please input" ></el-input>
            </div>
            <div class="auth-container-main-login-item">
                <label for="Password" class="auth-label">Password</label>
                <br>
                <el-input id="Password" v-model="password" style="width: 400px" type="password" show-password placeholder="Please input" ></el-input>
            </div>


            <div class="auth-container-main-login-item">
                <el-button type="primary"  @click="loginAccount" style="width: 400px;height: 40px;">Login Account</el-button>
            </div>
            
        </div>
        <div class="auth-container-main-captcha"><h1>TodoCaptcha</h1></div>
        <div class="auth-container-main-forget-password" @click="handleForgotPassword">Forget-password?</div>
</template>

<script setup lang="ts">
import '@/assets/css/auth-styles.css'
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
// const isRegisterMode = ref<boolean>(true)

const handleForgotPassword = function(){

    router.push('/auth/forgot-password')

}

const switchMode = function(){
    // isRegisterMode.value = !isRegisterMode.value
    // router.push(isRegisterMode.value ? '/auth/register' : '/auth/login')
    router.push('/auth/register')
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

                if(redirect==null){
                    router.push('/home')

                }

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
    .auth-container-main-login{
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5vh;
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
