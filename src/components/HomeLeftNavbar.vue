<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import http from '../utils/httpRequest'
const router= useRouter()

const handleCategoryRouterLink=function (children){
  console.log("分類ID:",children.id)
  router.push({name: "Home",params: {categoryId:children.id}})
  // router.push('/Home/' + children.id)
}

// 樹形分類數據
let categoryList = ref()
// let categoryList=ref<TreeCategoryNode | undefined>()
const getTreeCategoryList = function () {
  http({
    url: http.adornUrl('/article/category/tree/list'),
    method: 'get',
    params: http.adornParams({})
  }).then(({data}) => {
    if (data.code == 200) {
      // categoryList=data.data
      categoryList.value=data.data
      console.log("categoryList.value",categoryList.value)
      // console.log("從後端獲取樹型分類數據:",categoryList)
    } else {
      ElMessage.error("獲取分類數據錯誤");
    }
  })
}
onMounted(() => {
  getTreeCategoryList()//從後端獲取分類數據
})


// defineProps({
//   categoryList:{
//     type:Array,
//     required:true,
//   },
// })
</script>

<template>
  <el-scrollbar
       height="100%" always
  >
    <p style="word-break: break-all;margin: 20px 20px 20px 20px;font-family: 'Noto Sans TC',sans-serif;font-weight: bold;font-size: 22px" v-for="item in categoryList" :key="item.id">
      {{item.label}}
      <a href="#" @click="handleCategoryRouterLink(children)" style="color: darksalmon; font-size: 16px;text-decoration: none;" v-for="children in item.children"><br><span style=";padding-left: 1em;">{{ children.label }}</span></a>
    </p>
  </el-scrollbar>
</template>

<style scoped>

</style>
