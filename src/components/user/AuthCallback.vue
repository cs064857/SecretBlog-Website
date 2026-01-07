

// 過時，因為 stateless 會話下該接口會因為沒帶 Token 而 401

<!-- <template>
    <div class="callback-loading">
        <div class="spinner"></div>
        <p>正在完成身分驗證，請稍候...</p>
    </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus";
import http from "@/utils/httpRequest.js";

const router = useRouter()

onMounted(async () => {
    try {
        // 後端已在 OAuth2LoginSuccessHandler 中寫入 jwtToken, userId, avatar 等 Cookie
        
        // 1. 從 Cookie 中提取 Token 同步到 localStorage (保持系統一致性)
        const cookies = document.cookie.split(';');
        let jwtToken = null;
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'jwtToken') {
                jwtToken = value;
                break;
            }
        }

        if (jwtToken) {
            localStorage.setItem('jwtToken', jwtToken)
            ElMessage.success("成功完成 Google 身分驗證")
            // 2. 跳轉至首頁
            router.push('/home')
        } else {
            console.error('找不到 jwtToken Cookie')
            router.push('/login?error=auth_failed')
        }
    } catch (error) {
        console.error('身分驗證處理失敗:', error)
        router.push('/login?error=auth_failed')
    }
})
</script>
<style scoped>
.callback-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
}

.spinner {
    /* CSS Spinner 樣式... */
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style> -->