import http from "@/utils/httpRequest.js";
import { ElMessage } from "element-plus";
import type { R } from "@/interface/R.js"
import { useIsLoginStore } from "@/pinia/useIsLoginStore.js";
export function isLoginRequest(showMsg: boolean = true) {
    const isLoginStore = useIsLoginStore();
    http({
        url: http.adornUrl('/ums/user/is-login'),
        method: 'get',
    }).then(({ data }: { data: R }) => {
        if (data.code == "200") {
            isLoginStore.setIsLoginData(true)
            if (showMsg) ElMessage.success("已登入");
        } else {
            isLoginStore.setIsLoginData(false);
            if (showMsg) ElMessage.error("未登入");
        }
    }).catch(() => {
        if (showMsg) ElMessage.error("請求出錯，請稍後再試");
    });
}