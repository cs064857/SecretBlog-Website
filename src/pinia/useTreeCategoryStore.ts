import { defineStore } from 'pinia'
import { computed, ref } from "vue"
import { TreeCategoryNode } from "@/interface/treeCategoryInterface"
import http from '@/utils/httpRequest'

export const useTreeCategoryStore = defineStore('treeCategoryData', () => {
    const treeData = ref<TreeCategoryNode>()
    const loading = ref(false)

    const getTreeData = computed(() => treeData.value)

    const setTreeData = function (newValue: any) {
        treeData.value = newValue
    }

    // 從 API 獲取分類資料（若尚未載入）
    const fetchTreeData = async function () {
        if (treeData.value || loading.value) return // 避免重複請求
        loading.value = true
        try {
            const { data } = await http({
                url: http.adornUrl('/article/category/tree/list'),
                method: 'get',
                params: http.adornParams({})
            })
            if (data.code == "200") {
                treeData.value = data.data
            }
        } finally {
            loading.value = false
        }
    }

    return { treeData, getTreeData, setTreeData, fetchTreeData, loading }
}, {
    persist: true
})
