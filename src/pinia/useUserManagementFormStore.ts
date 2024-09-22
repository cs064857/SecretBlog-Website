import { defineStore } from 'pinia'
import {computed, ref} from "vue";

export const useactionTypeStore = defineStore('treeCategoryData', ()=>{
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
