import http from "@/utils/httpRequest.js";
import { ElMessage } from "element-plus";
import type { R } from "@/interface/R.js"
import { useIsLoginStore } from "@/pinia/useIsLoginStore.js";

export function isLoginRequest(showMsg: boolean = false) {
    const isLoginStore = useIsLoginStore();

    // 這個 API 用來「查詢目前是否登入」，未登入時可能會回 401
    return http({
        url: http.adornUrl('/ums/user/is-login'),
        method: 'get',
        skipAuthErrorMessage: true,
    }).then(({ data }: { data: R }) => {
        const code = Number((data as any)?.code)
        if (code === 200) {
            isLoginStore.setIsLoginData(true)
            if (showMsg) ElMessage.success("已登入");
        } else {
            isLoginStore.setIsLoginData(false);
            if (showMsg) ElMessage.error("未登入");
        }
        return data
    }).catch((error: any) => {
        // Spring Security 常見行為：未登入時直接回傳 401
        if (error?.response?.status === 401) {
            isLoginStore.setIsLoginData(false);
            if (showMsg) ElMessage.error("未登入");
            return
        }

        if (showMsg) ElMessage.error("請求出錯，請稍後再試");
        throw error
    });
}

/**
 * 忘記密碼 請求發送重設連結
 */
export function forgotPasswordRequest(email: string) {
    return http({
        url: http.adornUrl('/ums/user/forgot-password'),
        method: 'post',
        data: { email }
    });
}

/**
 * 驗證密碼重設 Token 是否有效
 */
export function verifyResetTokenRequest(token: string) {
    return http({
        url: http.adornUrl('/ums/user/verify-reset-token'),
        method: 'get',
        params: { token }
    });
}

/**
 * 重設密碼
 */
export function resetPasswordRequest(dto: any) {
    return http({
        url: http.adornUrl('/ums/user/reset-password'),
        method: 'post',
        data: dto
    });
}
