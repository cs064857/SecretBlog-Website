import axios from "axios";
import { ElMessage } from "element-plus";
import http from "@/utils/httpRequest.js";
import type { R } from "@/interface/R";
/**
 * 上傳檔案到MinIO
 * @param file 
 */
export function putImgToMinioRequest(file: File, userId: string) {
    console.log("putImgToMinioRequest...userId:", userId)
    console.log("putImgToMinioRequest...file:", file)
    const formData = new FormData();
    formData.append("file", file)
    formData.append("userId", userId)
    return axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/sms/minio`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    // .then((response) => {
    //     if (response.data.code == "200") {

    //         console.log("response.data:",response.data)
    //         return response.data
    //         // ElMessage.success("新增使用者數據成功");
    //         // window.location.replace(window.location.href);
    //     } else {
    //         ElMessage.error("新增使用者數據失敗");
    //     }

    // })
    // .catch((error) => {
    //     ElMessage.error("新增使用者數據失敗");
    //     throw error;
    // });
}

/**
 * 上傳檔案到MinIO頭像
 */
export function uploadFileToMinioRequest(file: Blob, fileName = "file") {
    const formData = new FormData();
    formData.append("file", file, fileName);

    return http({
        url: http.adornUrl('/sms/minio/avatar'),
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(({ data }: { data: R<string> }) => data);
}

/**
 * 上傳內容圖片(文章、留言等)
 */
export function uploadContentImageRequest(file: Blob, fileName = "image") {
    const formData = new FormData();
    formData.append("file", file, fileName);

    return http({
        url: http.adornUrl('/sms/minio/content'),
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(({ data }: { data: R<string> }) => data);
}

/**
 * 取得檔案url
 * @param resourcePath 
 */
function getFileUrlFromMinioRequest(resourcePath: string) {

}

