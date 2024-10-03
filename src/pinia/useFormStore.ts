import { defineStore } from 'pinia'
import {computed, ref} from "vue";

export const useactionTypeStore = defineStore('actionTypeStore', ()=>{
    const actionType=ref<string>()
    const getactionType=computed(()=> actionType.value)
    const setactionType=function (newValue:any){
        actionType.value=newValue
    }
    return{actionType,getactionType,setactionType}
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
// , {
//     persist: true  // 啟用持久化
// }
)
