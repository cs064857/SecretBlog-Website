<template>
<!--    <div style="background-color: #DD4A68; width: 500px; height: 500px;">-->
<!--        <h1>新聞1111</h1>-->
<!--    </div>-->
  <div  style="background-color: #DD4A68; width: 100%; height: 100%;">
    <h1>新聞1111</h1>
    <button @click="getNews1">2222</button>
  </div>
  <div v-html="lastContent" style="background-color: #d7e6c8">

  </div>
</template>
<script setup lang="ts" name="News1Test">
import http from '../utils/httpRequest'
import {ArticleInter,Articles} from "../interface/articleInterface.ts";
import {ref} from "vue";
const News1 = ref<ArticleInter | null>(null);
const lastContent = ref('')
const getNews1 = function (){
  http({
      url: http.adornUrl('/article/list'),
      method: 'get',
      params: http.adornParams({})
  }).then(({data}) => {
    News1.value=data
    const [{content}] = News1.value
    lastContent.value = content
  })
}
</script>
<style>
</style>
