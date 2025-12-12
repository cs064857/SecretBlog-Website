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
	</div>
</template>

<style scoped>
.search-headers {
	display: flex;
	align-items: center;
	width: 100%;
	max-width: 400px;
}

.search-input {
	width: 100%;
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
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

interface SearchSuggestion {
	value: string
	isSearchButton?: boolean
}

const searchQuery = ref('')
const router = useRouter()

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
import http from '@/utils/httpRequest'
import { ElMessage } from 'element-plus'
import R from '@/interface/requestInterface'
const handleSearch = () => {
	if (searchQuery.value.trim()) {
		console.log('搜尋:', searchQuery.value)

		http({
			url: http.adornUrl('/search/highlight'),
			method: 'get',
			params: {
				keyword: searchQuery.value,
				page: 0,
				size: 10
			}
		}).then(({ data }: { data: R }) => {
			if (data.code == "200") {
				console.log('搜尋結果:', data.data);
				ElMessage.success("搜尋成功");
				// TODO: 處理搜尋結果，例如導航到搜尋結果頁面
				// router.push({ name: 'SearchResults', query: { keyword: searchQuery.value } })
			} else {
				ElMessage.error("搜尋失敗: " + data.msg);
			}
			return data
		}).catch((error) => {
			console.error('搜尋錯誤:', error);
			ElMessage.error("搜尋請求失敗");
		});
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
