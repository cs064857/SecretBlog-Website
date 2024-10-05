import {ElMessage} from "element-plus";
import http from "@/utils/httpRequest.js";
import {R} from "@/interface/R";
import {Ref} from "vue";
import {formDataInterface} from "@/interface/ManagementInter/userInterface/formUserInterface";//㊣
export function batchDeleteRequest (userIdList:any){
    return http({
        url: http.adornUrl(`/ums/user/userDetails/${userIdList}`),
        method: 'delete',
    }).then(({data}:{data:R}) => {
        if (data.code == 200) {
            ElMessage.success("刪除用戶資料數據成功");
            //重新整理
            window.location.replace(window.location.href);
        } else {
            ElMessage.error("刪除用戶資料數據失敗");
        }
    });
}
export function getTableDataRequest(){
    return http({
        url: http.adornUrl('/ums/user/userDetails'),
        method: 'get',
        params: http.adornParams({})
    }).then(({data}:{data:R}) => {
        // console.log("data1:",data)
        if (data.code == 200) {
            ElMessage.success("獲取用戶資料數據成功");

        } else {
            ElMessage.error("獲取用戶資料數據失敗");
        }
        return data
    }).catch((error:Error)=>{
        ElMessage.error(`數據加載失敗：${error.message}，請稍後再試`);
    });
}

export function updateUserDataRequest(props:Ref<formDataInterface>, modifiedFieldsJson:Record<string, any>){
    return http({
        url: http.adornUrl(`/ums/user/userDetails/${props.value.id}/${props.value.userInfoId}`),
        method: 'put',
        data: http.adornData(modifiedFieldsJson, false)
    }).then(({data}:{data:R}) => {
        if(data.code==200){
            ElMessage.success("修改用戶數據成功");

            window.location.replace(window.location.href);
        }else{
            ElMessage.error("修改用戶數據失敗");
        }
        return data
    });
}
export function saveUserDataRequest(form:any){
    return http({
        url: http.adornUrl('/ums/user'),
        method: 'post',
        data: http.adornData(form, false)
    }).then(({data}:{data:R}) => {
        if (data.code == 200) {
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



