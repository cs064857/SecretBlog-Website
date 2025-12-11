<template>
	<div class="search-headers">
		<el-input v-model="searchQuery" placeholder="搜尋文章..." clearable class="search-input"
			@keyup.enter="handleSearch">
			<template #prefix>
				<el-icon>
					<Search />
				</el-icon>
			</template>
		</el-input>
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
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const router = useRouter()

const handleSearch = () => {
	if (searchQuery.value.trim()) {
		console.log('搜尋:', searchQuery.value)
		// TODO: 實作搜尋功能
		// router.push({ name: 'Search', query: { q: searchQuery.value } })
	}
}
</script>
