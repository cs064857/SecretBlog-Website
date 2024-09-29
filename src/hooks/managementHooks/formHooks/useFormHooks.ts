import {nextTick, Ref} from "vue";
import {FormInstance} from "element-plus";
import {cleanFormValue} from "@/hooks/managementHooks/formHooks/cleanFormValue";
import {cleanStringAndDateValue} from "@/utils/cleanStringAndDateValue";
import {formUserInterface} from "../../../interface/ManagementInter/formUserInterface.ts";
import {saveUserDataRequest} from "../../../requests/userRequest.ts";
import {R} from "../../../interface/R.ts";
export function useOnCancel(
    emit:any, form:Ref<Object>, ruleFormRef:Ref<FormInstance | null>, dialogVisible:Ref<boolean>
) {
    return () => {
        emit('dialogVisible', dialogVisible.value);
        console.log('表單視窗關閉...');
        nextTick(() => {
            cleanFormValue(form, ruleFormRef);
        })
    }
}



export const cleanFormValue = (form:Ref<Object>,ruleFormRef:Ref<FormInstance | null>) => {
    console.log("cleanFormValue...")
    cleanStringAndDateValue(form.value)
    // 等待下一個 tick 以確保表單數據已更新
    nextTick(() => {
        //清除表單驗證狀態
        ruleFormRef.value?.clearValidate();
    });
};

export const saveUserData = function (form:Ref<formUserInterface>){
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
