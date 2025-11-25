import {ElMessage} from "element-plus";
import http from "@/utils/httpRequest.js";
import {R} from "@/interface/R";
import {Ref} from "vue";
// 通用批量刪除請求
export function genericBatchDeleteRequest(resourcePath: string, idList: any[]): Promise<void> {
    return http({
        url: http.adornUrl(`${resourcePath}/${idList}`),  // 拼接ID列表
        method: 'delete',
    }).then(({ data }: { data: R }) => {
        if (data.code === "200") {
            ElMessage.success("刪除成功");
            window.location.replace(window.location.href);  // 重新整理頁面
        } else {
            ElMessage.error("刪除失敗");
        }
    }).catch(() => {
        ElMessage.error("請求出錯，請稍後再試");
    });
}

