import { defineStore } from 'pinia'
import { computed, ref } from "vue"
import { TreeCategoryNode } from "@/interface/treeCategoryInterface"
import http from '@/utils/httpRequest'

//TTL設定，10分鐘
const TTL_MS = 10 * 60 * 1000

export const useTreeCategoryStore = defineStore('treeCategoryData', () => {
    // 分類樹根節點應為陣列
    const treeData = ref<TreeCategoryNode[]>([])
    const loading = ref(false)
    // 最後更新時間戳(用於TTL檢查)
    const lastUpdated = ref<number>(0)

    const getTreeData = computed(() => treeData.value)

    const setTreeData = function (newValue: TreeCategoryNode[]) {
        treeData.value = newValue
        lastUpdated.value = Date.now()
    }

    //檢查快取是否已過期
    const isCacheExpired = function (): boolean {
        if (lastUpdated.value === 0) return true
        return Date.now() - lastUpdated.value > TTL_MS
    }

    // 從 API 獲取分類資料 (若尚未載入或快取已過期)
    const fetchTreeData = async function () {
        //如果有資料且未過期且非載入中，則使用快取
        if (treeData.value.length > 0 && !isCacheExpired() && !loading.value) return
        if (loading.value) return //避免重複請求
        loading.value = true
        try {
            const { data } = await http({
                url: http.adornUrl('/article/category/tree/list'),
                method: 'get',
                params: http.adornParams({})
            })
            if (data.code == "200") {
                treeData.value = data.data || []
                lastUpdated.value = Date.now()
            }
        } finally {
            loading.value = false
        }
    }

    //強制重新載入分類資料(無視快取)
    const forceRefresh = async function () {
        loading.value = true
        try {
            const { data } = await http({
                url: http.adornUrl('/article/category/tree/list'),
                method: 'get',
                params: http.adornParams({})
            })
            if (data.code == "200") {
                treeData.value = data.data || []
                lastUpdated.value = Date.now()
            }
        } finally {
            loading.value = false
        }
    }

    return { treeData, getTreeData, setTreeData, fetchTreeData, forceRefresh, loading, lastUpdated }
}, {
    persist: true
})
