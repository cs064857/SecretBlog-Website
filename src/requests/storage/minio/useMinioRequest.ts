import axios from "axios";
import { ElMessage } from "element-plus";
/**
 * 上傳檔案到MinIO
 * @param file 
 */
export function putImgToMinioRequest(file: File,userId:string) {
    console.log("putImgToMinioRequest...userId:",userId)
    console.log("putImgToMinioRequest...file:",file)
    const formData = new FormData();
    formData.append("file", file)
    formData.append("userId", userId)
    return axios.post("http://localhost:88/api/sms/minio", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        // .then((response) => {
        //     if (response.data.code === 200) {

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
 * 取得檔案url
 * @param resourcePath 
 */
function getFileUrlFromMinioRequest(resourcePath:string){

}
