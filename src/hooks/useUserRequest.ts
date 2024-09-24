import {ElMessage} from "element-plus";
import http from "@/utils/httpRequest.js";
import {R} from "@/interface/R.ts";

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

export function updateUserDataRequest(props:any, modifiedFieldsJson:any){
    return http({
        url: http.adornUrl(`/ums/user/userDetails/${props.inputFormData.id}/${props.inputFormData.userInfoId}`),
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
export function getOptionsRequest(){
    return http({
        url: http.adornUrl('/ums/role'),
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


/**
 * 校驗
 */
// 驗證電子郵件格式
export const validateEmail = (rule: any, value: string, callback: any) => {
    if (!value) {
        callback(new Error('電子郵件是必填項'));
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
            callback();
        } else {
            callback(new Error('請輸入有效的電子郵件'));
        }
    }
};

// 驗證手機號碼格式（假設為台灣手機號碼）
export const validatePhoneNumber = (rule: any, value: string, callback: any) => {
    if (!value) {
        callback(new Error('手機號碼是必填項'));
    } else {
        const phoneRegex = /^09\d{8}$/;
        if (phoneRegex.test(value)) {
            callback();
        } else {
            callback(new Error('請輸入有效的手機號碼，例如 0912345678'));
        }
    }
};
// 驗證確認密碼
export const validateCheckPassword = (rule: any, value: any, callback: any,form:any) => {
    if (!value) {
        callback(new Error('請確認密碼'));
    } else if (value === form.value.password) {
        callback();
    } else {
        callback(new Error('兩次密碼輸入不一致！'));
    }
};

// 驗證生日是否為有效日期且不在未來
export const validateBirthday = (rule: any, value: Date, callback: any) => {
    if (!value) {
        callback(new Error('生日是必填項'));
    } else {
        const today = new Date();
        if (value > today) {
            callback(new Error('生日不能是未來的日期'));
        } else {
            callback();
        }
    }
};

// 驗證性別是否被選擇
export const validateGender = (rule: any, value: string, callback: any) => {
    const validGenders = ["male", "female","other"];
    console.log("選擇的性別:",value)
    const includes = validGenders.includes(value);
    console.log("性別includes:",includes)
    if (includes) {
        callback()
    } else {
        callback(new Error('請選擇性別'));
    }
};

// 驗證角色是否被選擇
export const validateRole = (rule: any, value: string, callback: any,isResetting:any,options:any) => {
    if (isResetting.value == true) {//代表執行的是初始化表單數據,不進行校驗
        callback(); // 跳過驗證
        return;
    }

    const validRoles = options.value.map(option => option.label);
    console.log("validRoles", validRoles)
    // const validRoles = searchOptions.map(option => option.value);

    // const some =validRoles.some(item => item==value)
    const includes = validRoles.includes(value);
    // console.log("some", some)
    // console.log("includes", includes)

    console.log("value", value)
    if (includes) {
        callback();
    } else {
        callback(new Error('請選擇權限'));
    }
};

export const validateStatus = (rule: any, value: string, callback: any) => {
    console.log("validateStatus.value:",value)
    if (!value) {
        callback(new Error('狀態是必填項'));
    }
    callback();
    // else {
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (emailRegex.test(value)) {
    //     callback();
    //   } else {
    //     callback(new Error('請輸入有效的電子郵件'));
    //   }
    // }
};
