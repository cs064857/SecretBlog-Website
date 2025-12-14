<template>
    <div class="advanced-filter">
        <div class="filter-header" @click="toggleExpand">
            <el-icon class="header-icon" :class="{ 'is-expanded': isExpanded }">
                <CaretRight />
            </el-icon>
            <span class="header-text">高級篩選器</span>
        </div>

        <div v-show="isExpanded" class="filter-body">
            <div class="filter-row">
                <div class="filter-label">分類</div>
                <div class="filter-dropdown-container" ref="dropdownRef">
                    <div class="dropdown-trigger" @click="toggleDropdown" :class="{ 'is-active': isDropdownOpen }">
                        <span class="selected-text">{{ selectedCategoryLabel }}</span>
                        <el-icon class="trigger-icon">
                            <CaretBottom />
                        </el-icon>
                    </div>

                    <transition name="el-zoom-in-top">
                        <div v-if="isDropdownOpen" class="dropdown-panel">
                            <div class="dropdown-search-wrapper">
                                <input ref="searchInputRef" v-model="searchKeyword" type="text"
                                    class="dropdown-search-input" placeholder="搜索..." />
                                <el-icon class="search-suffix-icon">
                                    <Search />
                                </el-icon>
                            </div>

                            <div class="category-list-container">
                                <div class="category-item" :class="{ 'is-selected': !currentCategoryId }"
                                    @click="handleSelectCategory(null)">
                                    <div class="item-content">
                                        <span class="item-icon-box blue"></span>
                                        <span class="item-label">所有類別</span>
                                    </div>
                                </div>

                                <div v-for="item in filteredCategories" :key="item.id" class="category-item"
                                    :class="{ 'is-selected': currentCategoryId === item.id }"
                                    @click="handleSelectCategory(item)">
                                    <div class="item-content" :style="{ paddingLeft: item.level * 12 + 'px' }">
                                        <span class="item-icon-code">&lt;/&gt;</span>
                                        <span class="item-label">{{ item.label }}</span>
                                        <!-- 暫時隱藏計數，因後端接口未提供 -->
                                        <!-- <span class="item-count">× {{ 0 }}</span> -->
                                    </div>
                                </div>

                                <div v-if="filteredCategories.length === 0" class="no-data">
                                    無匹配結果
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>

            <!-- 時間篩選 -->
            <div class="filter-row time-filter-row">
                <div class="filter-label">時間</div>
                <div class="time-filter-controls">
                    <el-select v-model="currentTimeField" placeholder="選擇時間類型" class="time-field-select" size="large"
                        clearable @change="handleTimeFilterChange">
                        <el-option label="建立時間" value="createTime" />
                        <el-option label="更新時間" value="updateTime" />
                    </el-select>
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="開始日期"
                        end-placeholder="結束日期" size="large" class="time-range-picker" :disabled="!currentTimeField"
                        @change="handleTimeFilterChange" />
                </div>
            </div>

            <!-- 標籤篩選 -->
            <div class="filter-row tags-filter-row">
                <div class="filter-label">標籤</div>
                <div class="tags-filter-controls">
                    <el-select v-model="selectedTagIds" multiple collapse-tags collapse-tags-tooltip placeholder="選擇標籤"
                        class="tags-select" size="large" clearable @change="handleTagsFilterChange">
                        <el-option v-for="tag in tagsList" :key="tag.id" :label="tag.name" :value="tag.id" />
                    </el-select>
                </div>
            </div>

            <!-- 清除篩選按鈕 -->
            <div class="filter-row reset-filter-row">
                <el-button type="primary" class="reset-filter-btn" :disabled="!hasActiveFilters"
                    @click="resetAllFilters">
                    <el-icon class="reset-icon">
                        <RefreshLeft />
                    </el-icon>
                    清除所有篩選
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { CaretRight, CaretBottom, Search, RefreshLeft } from '@element-plus/icons-vue'
import { useTreeCategoryStore } from '@/pinia/useTreeCategoryStore'
import { TreeCategoryNode } from '@/interface/treeCategoryInterface'
import { useRoute } from 'vue-router'
import http from '@/utils/httpRequest'
import type { R } from '@/interface/R'

// 時間篩選資料介面
interface TimeFilterData {
    timeField: string | null
    startTime: string | null
    endTime: string | null
}

// 標籤篩選資料介面
interface TagsFilterData {
    tagsId: number[] | null
}

// 標籤項目介面
interface TagItem {
    id: number
    name: string
}

// 定義 emit 事件
const emit = defineEmits<{
    (e: 'category-change', categoryId: number | null): void
    (e: 'time-filter-change', filter: TimeFilterData): void
    (e: 'tags-filter-change', filter: TagsFilterData): void
}>()

const route = useRoute()
const store = useTreeCategoryStore()

const isExpanded = ref(false)
const isDropdownOpen = ref(false)
const searchKeyword = ref('')
const dropdownRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

// 時間篩選狀態
const currentTimeField = ref<string | null>(null)
const dateRange = ref<[Date, Date] | null>(null)

// 標籤篩選狀態
const tagsList = ref<TagItem[]>([])
const selectedTagIds = ref<number[]>([])

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
}

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
    if (isDropdownOpen.value) {
        // Focus search input on open
        setTimeout(() => {
            searchInputRef.value?.focus()
        }, 100)
    }
}

const closeDropdown = (e: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        isDropdownOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', closeDropdown)
    store.fetchTreeData()
    // 獲取標籤清單
    fetchTagsList()
})

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown)
})

// Flatten tree logic with level tracking
interface FlattenedCategory extends TreeCategoryNode {
    level: number;
}

const flattenTree = (nodes: TreeCategoryNode[], level = 0): FlattenedCategory[] => {
    let result: FlattenedCategory[] = []
    for (const node of nodes) {
        result.push({ ...node, level })
        if (node.children && node.children.length > 0) {
            result = result.concat(flattenTree(node.children, level + 1))
        }
    }
    return result
}

const allCategories = computed(() => {
    const tree = store.getTreeData || []
    return flattenTree(tree)
})

const filteredCategories = computed(() => {
    if (!searchKeyword.value) return allCategories.value
    const lowerKeyword = searchKeyword.value.toLowerCase()
    return allCategories.value.filter(item =>
        item.label.toLowerCase().includes(lowerKeyword)
    )
})

// 使用本地狀態追蹤選中的分類 ID
const currentCategoryId = ref<number | null>(null)

const selectedCategoryLabel = computed(() => {
    if (!currentCategoryId.value) return '所有類別'
    const customFind = (items: FlattenedCategory[]): string | undefined => {
        const found = items.find(i => i.id === currentCategoryId.value)
        return found?.label
    }
    return customFind(allCategories.value) || '已選類別'
})

const handleSelectCategory = (item: FlattenedCategory | null) => {
    isDropdownOpen.value = false
    // 更新本地選中狀態
    currentCategoryId.value = item ? item.id : null
    // 向父組件發送分類變更事件，傳遞分類 ID（如果是「所有類別」則傳遞 null）
    emit('category-change', item ? item.id : null)
}

// 日期格式化工具函數
const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}T00:00:00`
}

const formatDateToISOEnd = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}T23:59:59`
}

// 處理時間篩選變更
const handleTimeFilterChange = () => {
    let startTime: string | null = null
    let endTime: string | null = null

    if (dateRange.value && dateRange.value.length === 2) {
        startTime = formatDateToISO(dateRange.value[0])
        endTime = formatDateToISOEnd(dateRange.value[1])
    }

    emit('time-filter-change', {
        timeField: currentTimeField.value,
        startTime,
        endTime
    })
}

// 獲取標籤清單
const fetchTagsList = () => {
    http({
        url: http.adornUrl('/article/tags/list'),
        method: 'get',
    }).then(({ data }: { data: R }) => {
        if (data.code === '200' || data.code === 200) {
            tagsList.value = data.data
        }
    })
}

// 處理標籤篩選變更
const handleTagsFilterChange = () => {
    emit('tags-filter-change', {
        tagsId: selectedTagIds.value.length > 0 ? selectedTagIds.value : null
    })
}

// 檢查是否有任何篩選器處於啟用狀態
const hasActiveFilters = computed(() => {
    return currentCategoryId.value !== null ||
        currentTimeField.value !== null ||
        dateRange.value !== null ||
        selectedTagIds.value.length > 0
})

// 重置所有篩選器到預設狀態
const resetAllFilters = () => {
    // 重置分類
    if (currentCategoryId.value !== null) {
        currentCategoryId.value = null
        emit('category-change', null)
    }

    // 重置時間篩選
    if (currentTimeField.value !== null || dateRange.value !== null) {
        currentTimeField.value = null
        dateRange.value = null
        emit('time-filter-change', {
            timeField: null,
            startTime: null,
            endTime: null
        })
    }

    // 重置標籤
    if (selectedTagIds.value.length > 0) {
        selectedTagIds.value = []
        emit('tags-filter-change', {
            tagsId: null
        })
    }
}

// Watch route to close dropdown if needed
watch(route, () => {
    isDropdownOpen.value = false
})

</script>

<style scoped>
.advanced-filter {
    width: 100%;
    color: #cfd3dc;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    user-select: none;
    margin-bottom: 1rem;
}

.filter-header {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem 0;
    font-size: 14px;
    font-weight: 600;
    color: #e5eaf3;
}

.header-icon {
    margin-right: 4px;
    transition: transform 0.2s;
    font-size: 12px;
}

.header-icon.is-expanded {
    transform: rotate(90deg);
}

.header-text {
    letter-spacing: 0.5px;
}

.filter-body {
    margin-top: 0.5rem;
    padding-left: 4px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.filter-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* 時間篩選行樣式 */
.time-filter-row {
    margin-top: 0;
}

.time-filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
}

.time-field-select {
    width: 130px;
}

.time-range-picker {
    flex: 1;
    min-width: 200px;
}

/* 標籤篩選行樣式 */
.tags-filter-row {
    margin-top: 0;
}

.tags-filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tags-select {
    width: 100%;
}

/* 清除篩選按鈕區塊 - 佔滿兩欄 */
.reset-filter-row {
    grid-column: 1 / -1;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #363637;
}

.filter-label {
    font-size: 14px;
    color: #a0a0a0;
    margin-bottom: 0.25rem;
}

.filter-dropdown-container {
    position: relative;
    width: 100%;
}

.dropdown-trigger {
    background-color: var(--bg-hex-1d1e1f);
    border: 1px solid #363637;
    border-radius: 4px;
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    height: 40px;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.dropdown-trigger:hover {
    border-color: #4c4d4f;
}

.dropdown-trigger.is-active {
    border-color: #409eff;
    box-shadow: 0 0 0 1px #409eff inset;
}

.selected-text {
    font-size: 14px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.trigger-icon {
    color: #909399;
    font-size: 12px;
}

/* Dropdown Panel */
.dropdown-panel {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 4px;
    background-color: var(--bg-hex-1d1e1f);
    border: 1px solid #363637;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    max-height: 400px;
}

.dropdown-search-wrapper {
    padding: 8px;
    border-bottom: 1px solid #303133;
    position: sticky;
    top: 0;
    background: #1d1e1f;
    display: flex;
    align-items: center;
    z-index: 10;
}

.dropdown-search-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 14px;
    padding-right: 24px;
}

.dropdown-search-input::placeholder {
    color: #606266;
}

.search-suffix-icon {
    position: absolute;
    right: 12px;
    color: #909399;
}

.category-list-container {
    overflow-y: auto;
    flex: 1;
    padding: 4px 0;
}

/* Scrollbar styling */
.category-list-container::-webkit-scrollbar {
    width: 6px;
}

.category-list-container::-webkit-scrollbar-thumb {
    background: #4c4d4f;
    border-radius: 3px;
}

.category-list-container::-webkit-scrollbar-track {
    background: #1d1e1f;
}

.category-item {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.1s;
    color: #cfd3dc;
    font-size: 14px;
}

.category-item:hover {
    background-color: var(--bg-hex-2b2d30);
}

.category-item.is-selected {
    color: #409eff;
    background-color: var(--bg-rgba-64-158-255-0p1);
}

.item-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.item-icon-box {
    width: 10px;
    height: 10px;
    background-color: var(--bg-hex-00aaff);
    /* Blue generic icon */
    display: inline-block;
    border-radius: 1px;
}

.item-icon-code {
    color: #409eff;
    font-family: monospace;
    font-size: 12px;
    font-weight: bold;
}

.item-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item-count {
    color: #606266;
    font-size: 12px;
}

.no-data {
    padding: 12px;
    text-align: center;
    color: #606266;
    font-size: 13px;
}

/* 清除篩選按鈕樣式 */
.reset-filter-btn {
    width: auto;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.reset-icon {
    font-size: 14px;
}
</style>
