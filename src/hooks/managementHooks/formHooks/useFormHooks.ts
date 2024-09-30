import {nextTick, ref, Ref, watch} from "vue";
import {FormInstance} from "element-plus";
import {cleanStringAndDateValue} from "@/utils/cleanStringAndDateValue";
import {formUserInterface} from "../../../interface/ManagementInter/formUserInterface";
import {getOptionsRequest, saveUserDataRequest, updateUserDataRequest} from "../../../requests/userRequest";
import {R} from "../../../interface/R";
import {Option} from "../../../interface/formOption";
import {useactionTypeStore} from "../../../pinia/useUserManagementFormStore";
import {useRules} from "../../../validation/formUserVaild";

export const dialogVisible = ref(false);
export const ruleFormRef = ref<FormInstance | null>(null);
export function useOnCancel(
    emit:any, form:Ref<Object>, ruleFormRef:Ref<FormInstance | null>
) {
    return () => {
        emit('dialogVisible', dialogVisible.value);
        console.log('表單視窗關閉...');
        nextTick(() => {
            cleanFormValue(form, ruleFormRef);
        })
    }
}



const cleanFormValue = (form:Ref<Object>,ruleFormRef:Ref<FormInstance | null>) => {
    console.log("cleanFormValue...")
    cleanStringAndDateValue(form.value)
    // 等待下一個 tick 以確保表單數據已更新
    nextTick(() => {
        //清除表單驗證狀態
        ruleFormRef.value?.clearValidate();
    });
};

export const saveUserData = function (form:Ref<Object>,dialogVisible:Ref<boolean>,ruleFormRef: Ref<FormInstance | null>,emit: (event: 'dialogVisible', ...args: any[]) => void){
    console.log("新增資料...")
    // console.log("form.value",form.value)
    saveUserDataRequest(form.value).then(({data}:{data:R}) => {
        if (data.code == 200) {
            emit('dialogVisible', dialogVisible.value);
            // console.log('表單視窗關閉...');
            window.location.replace(window.location.href);
            //初始化清理表單資料
            cleanFormValue(form,ruleFormRef);
        }
    });
}

export const updateUserData = function (props: Record<string, any>,form: Ref<formUserInterface>,dialogVisible:Ref<boolean>,emit: (event: 'dialogVisible', ...args: any[]) => void){
    console.log("updateUserData...props:",props)

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
    const modifiedFieldsJson = Object.entries(props.inputFormData as Record<string, any>)
        .reduce((acc, [field, originalValue]) => {
            // 從 form.value 中取得當前字段的值
            const newValue = (form.value as Record<string, any>)[field];
            // 如果新舊值不同，則將該字段及其新值加入累加器 acc
            if (newValue !== originalValue) {
                acc[field] = newValue;
            }
            return acc; // 返回累加器 acc
        }, {} as Record<string, any>); // 初始值為空物件

    console.log("修改資料...")
    // console.log("需修改資料內容:",modifiedFields)
    console.log("需修改資料內容:",modifiedFieldsJson)

    updateUserDataRequest(props,modifiedFieldsJson).then((data:R)=>{
        if(data.code==200){
            emit('dialogVisible', dialogVisible.value);
            console.log('表單視窗關閉...');
        }

    })
}

// 提交表單
export function useOnSubmit(formEl: Ref<FormInstance | null>, actionType: Ref<string>, props: Record<string, any>, form: Ref<formUserInterface>,emit: (event: 'dialogVisible', ...args: any[]) => void) {
    return async () => {
        console.log('formEl:', formEl.value);
        console.log('actionType:', actionType.value);
        console.log('props:', props);
        console.log('form:', form.value);

        if (!formEl.value) return;
        try {
            await formEl.value.validate();
            console.log("actionType表單行為:", actionType.value);
            console.log('表單提交資料...');
            console.log('表單資料::', form.value);
            console.log('表單formEl:', formEl.value);
            if (actionType.value === "update") {
                updateUserData(props, form,dialogVisible,emit);
            } else if (actionType.value === "add") {
                saveUserData(form,dialogVisible,formEl,emit);
            }

        } catch (error) {
            console.log('表單驗證失敗', error);
        }
    }
}
let options= ref<Option[] |null>(null);
export const getOptions=function (){

    getOptionsRequest().then((data:R) => {
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
export const useReceiveParentData=(props: Record<string, any>,form: Ref<formUserInterface>)=>{
    watch(
        () => props.inputFormData,
        (newValue, oldValue, onCleanup)=>{
            console.log("FormUser接收到UserManagement資料")
            const actionTypeStore = useactionTypeStore();
            actionType.value=actionTypeStore.getactionType//從pinia中獲取actionType值
            handleReceiveParentData(props,form);
        },
        { immediate: true,deep:true}
    );
}
export let rules;
export const getRules=function (props: Record<string, any>,form: Ref<formUserInterface>){
    // console.log("getRules...form",form)
    rules = useRules(form.value,options);
}

 const handleReceiveParentData=function (props: Record<string, any>,form: Ref<formUserInterface>){
    console.log("執行handleReceiveParentData()")
    if(props.inputFormData){
        const inputFormData =<formUserInterface>props.inputFormData
        console.log("表單接收到父組件傳遞修改行的資料:",inputFormData)
        form.value = {...inputFormData,checkPassword:inputFormData.password}// 將確認密碼欄位回填與密碼相同值
        console.log("表單接收到父組件傳遞修改行form.value:",form.value)
        rules = useRules(form.value,options);
    }
}

