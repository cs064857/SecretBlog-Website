import http from "@/utils/httpRequest.js";
import {ElMessage} from "element-plus";
import type { R } from "@/interface/R.js"
import { useIsLoginStore } from "@/pinia/useIsLoginStore.js";
export function isLoginRequest(){
    const isLoginStore = useIsLoginStore();
    http({
        url: http.adornUrl('/ums/user/is-login'),
        method: 'get',
    }).then(({data}:{data:R}) => {
        if (data.code == 200) {

            isLoginStore.setIsLoginData(true)
            ElMessage.success("已登入");
        } else {
            isLoginStore.setIsLoginData(false);
            ElMessage.error("未登入");
        }
    }).catch(() => {
        ElMessage.error("請求出錯，請稍後再試");
    });
}