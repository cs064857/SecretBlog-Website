import {computed, nextTick, onMounted, ref, Ref, watch} from "vue";
import {ElMessage, ElMessageBox, FormInstance} from "element-plus";
import {cleanStringAndDateValue} from "@/utils/cleanStringAndDateValue";
import {formUserInterface} from "@/interface/admin/formUserInterface";//㊣
import {getOptionsRequest, getPreSignedUrlFromMinio, saveUserAvatarRequest, saveUserDataRequest, updateUserAvatarUrlRequest, updateUserDataRequest} from "@/requests/managementRequests/userRequest";
import {R} from "../../../interface/R";
import {Option} from "@/interface/admin/formOption";
import { store } from "@/pinia/index";
import {useActionTypeStore,useDialogVisibleStore} from "@/pinia/useFormStore"
import {useRules} from "../../../validation/formUserVaild";
// import {useActionTypeStore} from "@/pinia/useUserManagementFormStore"
export const dialogVisible = ref(false);
export const ruleFormRef = ref<FormInstance | null>(null);
const dialogVisibleStore = useDialogVisibleStore(store);

import {useInputFormDataStore} from "@/pinia/useFormStore"
import { putImgToMinioRequest } from "@/requests/storage/minio/useMinioRequest";
const inputFormDataStore = useInputFormDataStore();

// const props:Ref<any> = computed(()=>inputFormDataStore.inputFormData)
const props:Ref<any> = computed(()=>({//從表格欄位中獲得資料
    ...inputFormDataStore.inputFormData,foo: new Date().toISOString()
}))
// export interface FormProps {
//     inputFormData: Record<string, any>; // 假設 inputFormData 是一個通用的物件
// }

export function useOnCancel(
    form:Ref<Object>,
) {
    return () => {
        // emit('dialogVisible', dialogVisible.value);
        dialogVisibleStore.setDialogVisible(false)
        console.log('表單視窗關閉...');
        nextTick(() => {
            console.log("useOnCancel...form:",form)
            cleanFormValue(form, ruleFormRef);
        })
    }
}



const cleanFormValue = (form:Ref<Object>,ruleFormRef:Ref<FormInstance | null>) => {
    console.log("cleanFormValue...form:",form)
    cleanStringAndDateValue(form.value)
    // 等待下一個 tick 以確保表單數據已更新
    nextTick(() => {
        //清除表單驗證狀態
        ruleFormRef.value?.clearValidate();
    });
};

export const saveUserData = function (form:Ref<Object>,dialogVisible:Ref<boolean>,ruleFormRef: Ref<FormInstance | null>){
    console.log("新增資料...")
    // console.log("form.value",form.value)
    saveUserDataRequest(form.value).then(({data}:{data:R}) => {
        if (data.code == 200) {

            // emit('dialogVisible', dialogVisible.value);
            dialogVisibleStore.setDialogVisible(false)
            // console.log('表單視窗關閉...');
            window.location.replace(window.location.href);
            //初始化清理表單資料
            cleanFormValue(form,ruleFormRef);
        }
    });
}

export const updateUserData = async function (form: Ref<formUserInterface>){
    console.log("updateUserData...form:",form.value)
    console.log("updateUserData...props:",props.value)

    // //判斷修改了哪些內容
    // for (const field in props.inputFormData) {
    //   console.log("field",field)
    //   if(props.inputFormData[field]!=form.value[field]){
    //     const value = form.value[field]
    //     modifiedFields.set(field,value);
    //   }
    // }
    // // 在處理完所有字段後，將 Map 轉換為 JSON 對象
    // const modifiedFieldsJson = Object.fromEntries(modifiedFields);




    // 將 props.inputFormData 轉換為 Object.entries 陣列

    const modifiedFieldsJson = await Object.entries(props.value)
        .reduce((acc,[field,originalValue])=>{

            // 直接從 form 中取得當前字段的值
            const newValue = (form.value as Record<string, any>)[field];
            console.log("map:",field,":",originalValue,":",newValue)
            // 如果新舊值不同，則將該字段及其新值加入累加器 acc
            if (newValue !== originalValue) {
                acc[field] = newValue;
            }
            return acc
        },{} as Record<string, any>);

    console.log("修改資料...")
    // console.log("需修改資料內容:",modifiedFields)
    console.log("需修改資料內容:",modifiedFieldsJson)
//--------------------------------------------------
    const closeDialog=ref<boolean>(false)

    if(modifiedFieldsJson.avatar){
        console.log("modifiedFieldsJson.avatar:",modifiedFieldsJson.avatar)
        //獲得Minio預簽名URL上傳鏈結
        await putImgToMinioRequest(form.value.avatar as File,form.value.id)
        .then((data:{data:R})=>{
            console.log("putImgToMinioRequest...data:",data)
            if(data.data.code==200){
                // form.value.avatar=data.data.data
                console.log("上傳頭像成功")
                modifiedFieldsJson.avatar=data.data.data

                closeDialog.value=true
                //data.data.data是上傳後的永久閱覽地址
                // updateUserAvatarUrlRequest(form.value.id,data.data.data)
                // dialogVisibleStore.setDialogVisible(false);
                // window.location.replace(window.location.href);
            }else{
                closeDialog.value=false
            }
        })
        .catch(error => {
            console.error("處理頭像上傳時發生錯誤:", error);
            ElMessage.error("更新用戶資料失敗");
        });
    }

    //判斷若除了avatar外有其他修改，則更新資料
    if (!(Object.keys(modifiedFieldsJson).length === 1 && 'avatar' in modifiedFieldsJson)) {
        console.log("除了avatar外有其他修改，則更新資料")
        await updateUserDataRequest(props, modifiedFieldsJson).then((data: R) => {
            if (data.code == 200) {
                // emit('dialogVisible', dialogVisible.value);
                closeDialog.value=true
            }else{
                closeDialog.value=false
            }
        })
    }
    console.log("closeDialog.value:",closeDialog.value)
    if(closeDialog.value){
    // dialogVisibleStore.setDialogVisible(false)
    // console.log('表單視窗關閉...');
    ElMessage.success("更新用戶資料成功")
    window.location.replace(window.location.href);
    }
    // if(Object.keys(modifiedFieldsJson).length > 1){
    //     updateUserDataRequest(props,modifiedFieldsJson).then((data:R)=>{
    //         if(data.code==200){
    //         // emit('dialogVisible', dialogVisible.value);
    //         dialogVisibleStore.setDialogVisible(false)
    //             console.log('表單視窗關閉...');
    //         }
    //     })
    // }

    // if(modifiedFieldsJson.avatar){
    //     //獲得Minio預簽名URL上傳鏈結
    //     getPreSignedUrlFromMinio().then(async (data:R)=>{
    //         if(data.code==200){
    //             console.log("getPreSignedUrlFromMinio...data:",data)
    //             // 確保傳入的是 File 物件
    //             const avatarFile = form.value.avatar as File;
    //             console.log("avatarFile:",avatarFile)
    //             const response=await saveUserAvatarRequest(data.data, avatarFile);
    //             const test=response.request.responseURL
    //             console.log("test:",test)
    //             const baseUrl: string = "http://20.40.92.232:9000";
    //             const bucketName: string = "secretblog ";
    //             const storageName: string = "avatar";
    //             const imgUrl: string = `${baseUrl}/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${storageName}&version_id=null`;
    //             return imgUrl;
    //         }
    //         throw new Error("獲取上傳URL失敗");
    //     })
    //     .then((data:R) => {
    //         if(data.code==200){
    //             dialogVisibleStore.setDialogVisible(false);
    //             window.location.replace(window.location.href);
    //         }
    //     })
    //     .catch(error => {
    //         console.error("處理頭像上傳時發生錯誤:", error);
    //         ElMessage.error("更新用戶資料失敗");
    //     });
    // }

    // if(modifiedFieldsJson.avatar){
    //     //獲得Minio預簽名URL上傳鏈結
    //     getPreSignedUrlFromMinio().then((data:R)=>{
    //         console.log("getPreSignedUrlFromMinio...data:",data)
    //     //利用URL上傳
    //         if(data.code==200){
    //             saveUserDataRequest(data.data,form.value.avatar)
    //         }
    //     })
    // }
//--------------------------------------------------

}

// 提交表單
export function useOnSubmit(ruleFormRef:Ref<FormInstance | null>, form: Ref<formUserInterface>) {
    return async () => {

        console.log('formEl:', ruleFormRef.value);
        console.log('actionType:', actionType.value);
        console.log('props:', props);
        console.log('form:', form.value);

        if (!ruleFormRef.value) return;
        try {
            await ruleFormRef.value.validate();
            console.log("actionType表單行為:", actionType.value);
            console.log('表單提交資料...');
            console.log('表單資料::', form.value);
            console.log('表單formEl:', ruleFormRef.value);
            if (actionType.value === "update") {
                updateUserData(form);
            } else if (actionType.value === "add") {
                saveUserData(form,dialogVisible,ruleFormRef);
            }

        } catch (error) {
            console.log('表單驗證失敗', error);
        }
    }
}
let options= ref<Option[] |null>(null);
export const getOptions=function (requestPath:string){

    getOptionsRequest(requestPath).then((data:R) => {
        console.log("getOptions",data)
        if(data.code==200){
            options.value=data.data.map(item=>({
                value:item.id,
                label:item.roleName
            }));
            console.log("options",options)
        }
    })
    return options

}



export const actionType = ref<string>()

/**
 * 接收表格(父組件)點擊編輯按鈕時取得該行的數據,並回顯示表單上
 */
export const useReceiveParentData=(form: Ref<formUserInterface>,tempAvatar?:Ref<String>)=>{

    watch(
        () => props.value,
        (newValue, oldValue, onCleanup)=>{
            console.log("FormUser接收到UserManagement資料props:",props.value)
            const actionTypeStore = useActionTypeStore();
            actionType.value=actionTypeStore.getActionType//從pinia中獲取actionType值
            handleReceiveParentData(form,tempAvatar);
        },
        { immediate: true,deep:true}
    );
}
export let rules;



export const initializeRules = function (form: Ref<formUserInterface>) {
    // 如果需要，可以在這裡
    rules = useRules(form.value,options);
}

 const handleReceiveParentData=function (form: Ref<formUserInterface>,tempAvatar?:Ref<String>){
    console.log("執行handleReceiveParentData()...props:",props)
    if(props.value){
        const inputFormData =<formUserInterface>props.value
        console.log("表單接收到父組件傳遞修改行的資料:",inputFormData)
        form.value = {...inputFormData,checkPassword:inputFormData.password}// 將確認密碼欄位回填與密碼相同值
        if (typeof inputFormData.avatar === 'string') { // 修正 typeof 檢查
            tempAvatar.value = inputFormData.avatar;
            console.log("tempAvatar回顯:",tempAvatar.value)
        }
        console.log("表單接收到父組件傳遞修改行form.value:",form.value)
        // rules = useRules(form.value,options);
        Object.assign(rules, useRules(form.value, options));//更新 rules
    }
}

