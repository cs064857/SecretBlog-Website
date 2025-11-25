import {ElMessage} from "element-plus";
import http from "@/utils/httpRequest.js";
import {R} from "@/interface/R";
import {Ref} from "vue";
import {formUserInterface} from "@/interface/admin/formUserInterface";//㊣
import axios from "axios";
export function deleteUserDetailRequest (requestPath:string,userId:String){
    
    return http({
        url: http.adornUrl(`${requestPath}/${userId}`),
        method: 'post',
        // params: {id: userId}
    }).then(({data}:{data:R}) => {
        if (data.code == "200") {
            ElMessage.success("刪除用戶資料數據成功");
            //重新整理
            window.location.replace(window.location.href);
        } else {
            ElMessage.error("刪除用戶資料數據失敗");
        }
    });
}
export function getTableDataRequest(requestPath:string){
    console.log("getTableDataRequest...requestPath:",requestPath)
    return http({
        url: http.adornUrl(`${requestPath}`),
        method: 'get',
        params: http.adornParams({})
    }).then(({data}:{data:R}) => {
        // console.log("data1:",data)
        if (data.code == "200") {
            ElMessage.success("獲取用戶資料數據成功");

        } else {
            ElMessage.error("獲取用戶資料數據失敗");
        }
        return data
    }).catch((error:Error)=>{
        ElMessage.error(`數據加載失敗：${error.message}，請稍後再試`);
    });

}
export function getPreSignedUrlFromMinio(){
    return http({
        url: http.adornUrl('/sms/minio'),
        method: 'get',
    }).then(({data}:{data:R}) => {
        if (data.code == "200") {
            ElMessage.success("成功訊息");
        } else {
            ElMessage.error("錯誤訊息");
        }
        return data
    }).catch(() => {
        ElMessage.error("請求出錯，請稍後再試");
    });
}

export function updateUserAvatarUrlRequest(userId:string,avatarUrl:string){
    return http({
        url: http.adornUrl(`/ums/user/userDetails/${userId}`),
        method: 'put',
        data: http.adornData({avatarUrl}, false)
    }).then(({data}:{data:R}) => {
        if(data.code==200){
            ElMessage.success("修改用戶頭像成功");

            window.location.replace(window.location.href);
        }else{
            ElMessage.error("修改用戶頭像失敗");
        }
        return data
    });
}

export function updateUserDataRequest(props:Ref<formUserInterface>, modifiedFieldsJson:Record<string, any>){
    return http({
        url: http.adornUrl(`/ums/user/userDetails/${props.value.id}/${props.value.userInfoId}`),
        method: 'put',
        data: http.adornData(modifiedFieldsJson, false)
    }).then(({data}:{data:R}) => {
        if(data.code==200){
            ElMessage.success("修改用戶數據成功");

            // window.location.replace(window.location.href);
        }else{
            ElMessage.error("修改用戶數據失敗");
        }
        return data
    });
}

export function saveUserAvatarRequest(preSignedUrl: string, avatar: File) {
    console.log("準備上傳檔案:", avatar);

    return axios.put(preSignedUrl, avatar, {
        headers: {
            'Content-Type': avatar.type,  // 使用檔案的實際 MIME type
        },
        // 不需要包裝成 FormData
    })
    .then((response) => {
        if (response.status === 200) {

            ElMessage.success("上傳頭像成功");
            console.log("上傳頭像成功:",response)
        } else {
            throw new Error("上傳失敗");
        }
    })
    .catch((error) => {
        console.error("上傳錯誤詳情:", error);
        ElMessage.error(`上傳頭像失敗: ${error.message}`);
        throw error;
    });
}

// export function saveUserDataRequest(preSignedUrl:string,avatar: any) {
//     const formData = new FormData();
//     formData.append("file",avatar)

//     console.log("saveUserDataRequest...formData:",formData)
//     console.log("saveUserDataRequest...preSignedUrl:",preSignedUrl)
//     // 驗證FormData內容
//     console.log('FormData entries:');

//     // formData.forEach((value, key) => {
//     //     console.log(key + ': ' + value);
//     // });



//     return axios.put(preSignedUrl, formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     })
//     .then((response) => {
//         if (response.data.code == "200") {
//             ElMessage.success("新增使用者數據成功");
//             window.location.replace(window.location.href);
//         } else {
//             ElMessage.error("新增使用者數據失敗");
//         }
//         return response.data;
//     })
//     .catch((error) => {
//         ElMessage.error("新增使用者數據失敗");
//         throw error;
//     });
// }


export function saveUserDataRequest(form:any){
    return http({
        url: http.adornUrl('/ums/user'),
        method: 'post',
        data: http.adornData(form, false)
    }).then(({data}:{data:R}) => {
        if (data.code == "200") {
            ElMessage.success("新增使用者數據成功");

            window.location.replace(window.location.href);

        } else {
            ElMessage.error("新增使用者數據失敗");
        }
        return data
    });
}

export function getOptionsRequest(requestPath:string){
    return http({
        url: http.adornUrl(`${requestPath}`),
        method: 'get',
        params: http.adornParams({})
    }).then(({data}:{data:R}) => {
        console.log("getOptionsRequest",data)
        if(data.code==200){
            ElMessage.success("獲取權限數據成功");

        }else{
            ElMessage.error("獲取權限數據失敗");
        }
        return data
    })
}

