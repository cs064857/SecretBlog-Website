import { defineStore } from 'pinia'
import {computed, ref} from "vue";
//已開啟自動持久化
export const useDarkModeToggleStore = defineStore('darkModeToggleStore', ()=>{
    const darkModeToggle=ref<string>()
    const getDarkModeToggle=computed(()=> darkModeToggle.value)
    const setDarkModeToggle=function (newValue:any){
        darkModeToggle.value=newValue
    }
    return{darkModeToggle,getDarkModeToggle,setDarkModeToggle}
}
// , {
//     persist: true  // 啟用持久化
// }
)

