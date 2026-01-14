<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="keyword" />
    <button type="submit">搜尋</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')

const emit = defineEmits<{
  (e: 'submit', keyword: string): void
}>()

const handleSubmit = () => {
  emit('submit', keyword.value)
}
</script>