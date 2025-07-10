<template>
    <h1 style="color: #C9DDFF;font-size:2.25rem;">Reset your password</h1>
    <div class="auth-container-main-forgot-password">

        <div class="auth-container-main-forgot-password-item">
                <label  for="email" class="auth-label">Email</label>
                <br>
                <el-input id="email" v-model="email" style="width: 400px" placeholder="Please input" ></el-input>
        </div>
        <div class="auth-container-main-forgot-password-item">
            /// TODO 忘記密碼
            <el-button type="primary"  @click="handleForgotPassword" style="width: 400px;height: 40px;">Reset Password</el-button>

        </div>
        
    </div>
</template>

<script setup lang="ts">
import '@/assets/css/auth-styles.css'
import {ref} from 'vue'

const email= ref('');
const handleForgotPassword = function(){
    console.log("handleForgotPassword",email.value)
}
</script>

<style scoped>

@media screen and (max-height: 2000px) {
    .auth-container-main-forgot-password{
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
