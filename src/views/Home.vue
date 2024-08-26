<template>
  <div class="home-container">
    <div class="home-header">home-header</div>
    <div class="home-main">
      <div class="home-left-article" ></div>
      <div class="home-article-list">

        <div v-for="(article,articleIndex) in articleList" :key="article.id" class="home-article">

          <div class="article-title"><router-link :to="{name:'Article',params:{article_id:article.id}}"><h1>{{article.title}}</h1></router-link></div>
          <div v-html="article.content" class="article-content"></div>
          <div class="article-info"></div>
        </div>

      </div>
      <div class="home-right-article" ></div>
    </div>
    <div class="home-footer">home-footer</div>
  </div>

</template>

<style scoped>

</style>

<script setup lang="ts" name="Home">
import './Home.css';
import {onMounted, ref} from 'vue';
import {useRouter, useRoute} from 'vue-router'
import http from '../utils/httpRequest'
import {ArticleInter,Articles} from "../interface/articleInterface.ts";
interface tagsButton {
  title: string
  route: string
  name: string
  article_id: string
}

const tagsButtons: tagsButton[] = [];
const router = useRouter()
const route = useRoute()
//文章列表
const articleList=ref<Articles | null>(null)
onMounted(()=>{
  {
    http({
      url: http.adornUrl('/article/list'),
      method: 'get',
      params: http.adornParams({})
    }).then(({data}:{data:any}) => {
      // alert("請求文章列表成功")
      articleList.value=data
      // console.log("articleList.value",articleList.value)
    })
  }
})
//文章列表/

const handleIntoBackGround = function () {//進入後台管理系統
  router.push('/AdminVue')
}
const testRoute = function () {
  router.push('/Home/News1Test')
}

const buttons = ref<typeof tagsButtons>([
  {
    title: "首頁",
    route: "/",
  },
  {
    title: "新聞1",
    route: "/Home/News1Test",
  },
  {
    title: "關於",
    route: "/Home/News2Test",
  },
  {
    article_id: "1828018170493947905",
    title: "新聞2",
    route: "/Article",
    name: "Article"
  }
])
</script>


