import { defineStore } from 'pinia'
import {computed, ref} from "vue";
import {TreeCategoryNode} from "@/interface/treeCategoryInterface"
export const useTreeCategoryStore = defineStore('treeCategoryData', ()=>{
    const treeData=ref<TreeCategoryNode>()
    const getTreeData=computed(()=> treeData.value)
    const setTreeData=function (newValue:any){
        treeData.value=newValue
    }
    return{treeData,getTreeData,setTreeData}
},{
    persist: true  // 啟用持久化
})
