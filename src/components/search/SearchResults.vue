<template>
  <div class="common-layout">
    <!-- 搜尋輸入框 -->
    <div class="search-header">
      <SearchHeaders />
    </div>
    <!-- 高級篩選器（位於搜索框下方） -->
    <AdvancedFilter />
  </div>
</template>

<script setup lang="ts">
import SearchHeaders from './SearchHeaders.vue'
import AdvancedFilter from './AdvancedFilter.vue'
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