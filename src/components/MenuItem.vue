<template>
  <el-sub-menu v-if="item.children && item.children.length" :index="String(item.id)">
    <template #title>
      <span>{{ item.label }}</span>
    </template>
    <menu-item v-for="child in item.children" :key="child.id" :item="child" />
  </el-sub-menu>
  <el-menu-item v-else :index="String(item.id)">
    <span>{{ item.label }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
console.log('MenuItem received item:', props.item);
</script>
