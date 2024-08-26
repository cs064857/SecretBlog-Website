<script setup lang="ts">
import http from '../utils/httpRequest'
import {ArticleInter,Articles} from "../interface/articleInterface.ts";
import {onMounted, ref} from "vue";
import {useRouter,useRoute} from "vue-router";

const News1 = ref<ArticleInter | null>(null);
const lastContent = ref('')

const router =useRouter()
const route =useRoute()
const {article_id}=route.params

onMounted(()=>{
  http({
    url: http.adornUrl(`/article/get/${article_id}`),
    method: 'get',
    params: http.adornParams({})
  }).then(({data}) => {
    // alert("請求完畢")
    // console.log("data:",data)
    News1.value=data
    const {content} = News1.value
    lastContent.value = content
    // console.log("lastContent.value:",lastContent.value)
  })
})

</script>

<template>
  <div>
    <h1>{{article_id}}</h1>
    <div v-html="lastContent" style="border: black 3px solid;padding: 1% 1%;width: 100%;height: 100%;background-color: #d7e6c8;box-shadow: 0px 0px 30px">

    </div>
  </div>

</template>

<style scoped>

</style>
