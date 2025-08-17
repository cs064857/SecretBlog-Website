import { defineStore } from "pinia";
import {ref,computed} from "vue"
export const useIsLoginStore = defineStore("isLogin", ()=>{

    const isLogin=ref<boolean>(false)
    const getIsLoginData = computed(()=>isLogin.value)
    const setIsLoginData = function(newValue: boolean){
        isLogin.value=newValue
    }
    return {isLogin,getIsLoginData,setIsLoginData}
},{
    persist: true
}
);