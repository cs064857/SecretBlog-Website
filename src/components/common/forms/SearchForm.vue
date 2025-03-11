<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="keyword" />
    <button type="submit">搜尋</button>
  </form>
</template> 