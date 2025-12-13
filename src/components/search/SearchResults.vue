<template>
  <div class="common-layout">
    <!-- 搜尋輸入框 -->
    <div class="search-header">
      <SearchHeaders />
    </div>
    <!-- 高級篩選器（位於搜索框下方） -->
    <AdvancedFilter @category-change="handleCategoryChange" @time-filter-change="handleTimeFilterChange"
      @tags-filter-change="handleTagsFilterChange" />
  </div>
</template>

<script setup lang="ts">
import SearchHeaders from './SearchHeaders.vue'
import AdvancedFilter from './AdvancedFilter.vue'

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

// 定義 emit 事件
const emit = defineEmits<{
  (e: 'category-change', categoryId: number | null): void
  (e: 'time-filter-change', filter: TimeFilterData): void
  (e: 'tags-filter-change', filter: TagsFilterData): void
}>()

// 處理分類變更事件，轉發給父組件
const handleCategoryChange = (categoryId: number | null) => {
  emit('category-change', categoryId)
}

// 處理時間篩選變更事件，轉發給父組件
const handleTimeFilterChange = (filter: TimeFilterData) => {
  emit('time-filter-change', filter)
}

// 處理標籤篩選變更事件，轉發給父組件
const handleTagsFilterChange = (filter: TagsFilterData) => {
  emit('tags-filter-change', filter)
}
</script>

<style scoped lang="css">
.common-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-header {
  margin-bottom: 0.5rem;
}
</style>