import { defineStore } from 'pinia'
import {computed, ref} from "vue";
//已開啟自動持久化
export const useActionTypeStore = defineStore('actionTypeStore', ()=>{
    const actionType=ref<string>()
    const getActionType=computed(()=> actionType.value)
    const setActionType=function (newValue:any){
        actionType.value=newValue
    }
    return{actionType,getActionType,setActionType}
}
// , {
//     persist: true  // 啟用持久化
// }
)
export const useDialogVisibleStore = defineStore('dialogVisibleStore', ()=>{
        const dialogVisible=ref<boolean>(false)
        const getDialogVisible=computed(()=> dialogVisible.value)
        const setDialogVisible=function (newValue:any){
            dialogVisible.value=newValue
        }
        return{dialogVisible,getDialogVisible,setDialogVisible}
    }

)

export const useInputFormDataStore = defineStore('inputFormDataStore', ()=>{
        const inputFormData=ref<Object>()
        const getInputFormData=computed(()=> inputFormData.value)
        const setInputFormData=function (newValue:any){
            inputFormData.value={...newValue,foo: new Date().toISOString()}
        }
        return{inputFormData,getInputFormData,setInputFormData}
    }
)
