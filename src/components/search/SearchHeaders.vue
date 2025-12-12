<template>
	<div class="search-headers">
		<el-autocomplete v-model="searchQuery" :fetch-suggestions="fetchSuggestions" placeholder="搜尋文章..." clearable
			class="search-input" :trigger-on-focus="true" @keyup.enter="handleSearch" @select="handleSelect">
			<template #prefix>
				<el-icon>
					<Search />
				</el-icon>
			</template>
			<template #default="{ item }">
				<div v-if="item.isSearchButton" class="search-button-item">
					<el-icon class="search-icon">
						<Search />
					</el-icon>
					<span class="search-text">搜尋: {{ searchQuery }}</span>
				</div>
				<div v-else class="suggestion-item">
					<span>{{ item.value }}</span>
				</div>
			</template>
		</el-autocomplete>
		<!-- 搜索按鈕：點擊後執行搜索，與按 Enter 效果相同 -->
		<el-button type="primary" class="search-button" @click="handleSearch" :icon="Search">
			搜尋
		</el-button>
	</div>
</template>

<style scoped>
.search-headers {
	display: flex;
	align-items: center;
	width: 100%;
	max-width: 500px;
	gap: 8px;
}

.search-input {
	flex: 1;
}

.search-button {
	flex-shrink: 0;
}

.search-button-item {
	display: flex;
	align-items: center;
	padding: 8px 12px;
	color: white;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s;
}

.search-icon {
	margin-right: 8px;
}

.search-text {
	font-weight: 500;
}

.suggestion-item {
	padding: 4px 0;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

interface SearchSuggestion {
	value: string
	isSearchButton?: boolean
}

const searchQuery = ref('')
const router = useRouter()
const route = useRoute()

const fetchSuggestions = (queryString: string, cb: (suggestions: SearchSuggestion[]) => void) => {
	const suggestions: SearchSuggestion[] = []

	// 第一個選項:確定搜索按鈕
	// 假設輸入框中存在值, 則顯示確定搜索按鈕, 將根據該值調用handleSearch函數
	if (queryString.trim()) {
		suggestions.push({
			value: queryString,
			isSearchButton: true
		})
	}

	// 這裡可以添加其他搜尋建議
	// 例如:熱門搜尋、歷史搜尋等
	suggestions.push({ value: '建議1' })
	// suggestions.push({ value: '建議2' })

	cb(suggestions)
}

// 同步路由中的 keyword 到輸入框，方便返回/重整時顯示
watch(() => route.params.keyword, (newVal) => {
	if (typeof newVal === 'string') {
		searchQuery.value = newVal
	}
}, { immediate: true })

const handleSearch = () => {
	if (searchQuery.value.trim()) {
		const keyword = searchQuery.value.trim()
		// 導航到搜尋結果頁面，由 SearchLayout 負責實際請求與展示
		router.push({ name: 'SearchResults', params: { keyword } }).catch(() => { })
	}
}


const handleSelect = (item: SearchSuggestion) => {
	if (item.isSearchButton) {
		// 根據輸入的值進行搜索
		handleSearch()
	} else {
		// 處理其他建議項目的選擇
		searchQuery.value = item.value
		handleSearch()
	}
}
</script>
