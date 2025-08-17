import { defineStore } from "pinia";
import { artTagsDataInterface } from "@/interface/artTagsDataInterface";
import {computed, ref} from "vue"
export const useTagsStore = defineStore('tagsData',()=>{

    const tagsData=ref<artTagsDataInterface>()
    const getTagsData=computed (()=>tagsData.value)
    const setTagsData=function(newValue:any){
        tagsData.value=newValue.value
    }
    return {tagsData,getTagsData,setTagsData}

},{
    persist: true
}


)