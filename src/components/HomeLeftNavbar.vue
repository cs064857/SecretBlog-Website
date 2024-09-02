<script setup lang="ts">
import {useRouter} from "vue-router";

const router= useRouter()

const handleCategoryRouterLink=function (children){
  console.log("分類ID:",children.id)
  router.push({name: "Home",params: {categoryId:children.id}})
  // router.push('/Home/' + children.id)
}

defineProps({
  categoryList:{
    type:Array,
    required:true,
  },
})
</script>

<template>
  <el-scrollbar height="100%">
    <p style="font-family: 'Noto Sans TC',sans-serif;font-weight: bold;font-size: 22px" v-for="item in categoryList" :key="item.id">
      {{item.label}}
      <a href="#" @click="handleCategoryRouterLink(children)" style="color: darksalmon; font-size: 17px;text-decoration: none;" v-for="children in item.children"><br><span style="padding-left: 1em;">{{ children.label }}</span></a>
    </p>
  </el-scrollbar>
</template>

<style scoped>

</style>
