<script setup lang="ts">
import http from '../utils/httpRequest'
import {ArticleInter,Articles} from "../interface/articleInterface.ts";
import {onMounted, ref} from "vue";
import {useRouter,useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {R} from "../interface/R.ts";

const Article = ref<ArticleInter | null>(null);
const ArticleContent = ref('')

const router =useRouter()
const route =useRoute()
const {article_id}=route.params

//使用後端JSON
// onMounted(()=>{
//   http({
//     url: http.adornUrl(`/article/get/${article_id}`),
//     method: 'get',
//     params: http.adornParams({})
//   }).then(({data}) => {
//     // alert("請求完畢")
//     console.log("data:",data)
//     const lastData=JSON.parse(data.data)
// console.log("lastData:",lastData);
//     if(data.code==200){//若請求成功
//       Article.value=lastData
//       if(Article.value!=null){
//         ArticleContent.value = Article.value.content
//       }
//
//       // console.log("ArticleContent.value:",ArticleContent.value)
//     }else {
//       //elementPlus的Message消息提示組件
//       ElMessage.error("獲取文章資料失敗")
//     }
//   })
// })

//後端使用泛型
onMounted(()=>{
  http({
    url: http.adornUrl(`/article/get/${article_id}`),
    method: 'get',
    params: http.adornParams({})
  }).then(({data}:{data:R}) => {
    // alert("請求完畢")
    console.log("data:",data)
    if(data.code==200){//若請求成功
      Article.value=data.data
      if(Article.value!=null){
        ArticleContent.value = Article.value.content
        // console.log("ArticleContent.value:",ArticleContent.value)
      }

    }else {
      //elementPlus的Message消息提示組件
      ElMessage.error("獲取文章資料失敗")
    }
  })
})

</script>

<template>
  <div>
    <h1>{{article_id}}</h1>
    <div v-html="ArticleContent" style="border: black 3px solid;padding: 1% 1%;width: 100%;height: 100%;background-color: #d7e6c8;box-shadow: 0px 0px 30px">

    </div>
  </div>

</template>

<style scoped>

</style>
