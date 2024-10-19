import {computed, nextTick, onMounted, ref, Ref, watch} from "vue";
import {FormInstance} from "element-plus";
import {cleanStringAndDateValue} from "@/utils/cleanStringAndDateValue";
import {formUserInterface} from "@/interface/ManagementInter/userInterface/formUserInterface";//㊣
import {getOptionsRequest, saveUserDataRequest, updateUserDataRequest} from "@/requests/managementRequests/userRequest";
import {R} from "../../../interface/R";
import {Option} from "../../../interface/formOption";
import { store } from "@/pinia/index";
import {useActionTypeStore,useDialogVisibleStore} from "@/pinia/managementPinia/genericFormPinia/useFormStore"
import {useRules} from "../../../validation/formUserVaild";
// import {useActionTypeStore} from "@/pinia/useUserManagementFormStore"
export const dialogVisible = ref(false);
export const ruleFormRef = ref<FormInstance | null>(null);
const dialogVisibleStore = useDialogVisibleStore(store);

import {useInputFormDataStore} from "@/pinia/managementPinia/genericFormPinia/useFormStore"
const inputFormDataStore = useInputFormDataStore();

// const props:Ref<any> = computed(()=>inputFormDataStore.inputFormData)
const props:Ref<any> = computed(()=>({
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

export const updateUserData = function (form: Ref<formUserInterface>){
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

    const modifiedFieldsJson = Object.entries(props.value)
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

    updateUserDataRequest(props,modifiedFieldsJson).then((data:R)=>{
        if(data.code==200){
            // emit('dialogVisible', dialogVisible.value);
            dialogVisibleStore.setDialogVisible(false)
            console.log('表單視窗關閉...');
        }

    })
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

export const useReceiveParentData=(form: Ref<formUserInterface>)=>{

    watch(
        () => props.value,
        (newValue, oldValue, onCleanup)=>{
            console.log("FormUser接收到UserManagement資料props:",props.value)
            const actionTypeStore = useActionTypeStore();
            actionType.value=actionTypeStore.getActionType//從pinia中獲取actionType值
            handleReceiveParentData(form);
        },
        { immediate: true,deep:true}
    );
}
export let rules;



export const initializeRules = function (form: Ref<formUserInterface>) {
    // 如果需要，可以在這裡
    rules = useRules(form.value,options);
}

 const handleReceiveParentData=function (form: Ref<formUserInterface>){
    console.log("執行handleReceiveParentData()...props:",props)
    if(props.value){
        const inputFormData =<formUserInterface>props.value
        console.log("表單接收到父組件傳遞修改行的資料:",inputFormData)
        form.value = {...inputFormData,checkPassword:inputFormData.password}// 將確認密碼欄位回填與密碼相同值
        console.log("表單接收到父組件傳遞修改行form.value:",form.value)
        // rules = useRules(form.value,options);
        Object.assign(rules, useRules(form.value, options));//更新 rules
    }
}

