<template>
  <div class="home-container">
    <div class="home-header">
      <el-button @click="handleGoBackend" type="primary" :icon="Management"/>

    </div>
    <div class="home-main">
      <div class="home-left-article"></div>

      <div class="home-article-list">

        <div v-for="(article,articleIndex) in limitArticleList" :key="article.id" class="home-article">

          <div class="article-title">
            <router-link :to="{name:'Article',params:{article_id:article.id}}"><p>{{ article.title }}</p></router-link>
          </div>
          <div v-html="article.content" class="article-content"></div>
          <div class="article-info"></div>

        </div>
        <div class="home-article-footer"  >
          <el-pagination @current-change="handleCurrentPageChange" @size-change="handlePageSizeChange" v-model:current-page="currentPage" v-model:page-size="pageSize" background layout="prev, pager, next" :total="totalItems" />
        </div>
      </div>
      <div class="home-right-article"></div>
    </div>
    <!--    <div class="home-footer">home-footer</div>-->
  </div>

</template>

<style scoped>

</style>

<script setup lang="ts" name="Home">
import './Home.css';
import {computed, onMounted, ref, toRefs} from 'vue';
import {useRouter, useRoute} from 'vue-router'
import http from '../utils/httpRequest'
import {ArticleInter, Articles} from "../interface/articleInterface.ts";
import {Management} from "@element-plus/icons-vue";

interface tagsButton {
  title: string
  route: string
  name: string
  article_id: string
}

const tagsButtons: tagsButton[] = [];
const router = useRouter()
const route = useRoute()
// 分頁
let totalItems =ref()
const pageSize=ref(10)//每條顯示條目個數,默認為10
const currentPage=ref(1)//目前頁數,默認為1
let limitItems=ref<number>(10)//默認顯示10個項目,limitItems與頁數掛勾
// handleCurrentPageChange()

const handleCurrentPageChange=function (CurrentPage){
    limitItems.value=CurrentPage*pageSize.value
    console.log("CurrentPage變化:",CurrentPage)
}
const handlePageSizeChange=function (PageSize:string){
  console.log("PageSize變化:",PageSize)
}

const limitArticleList:any=computed(()=>{
  console.log("articleList:",articleList)
  if(articleList.value !=null){
    return articleList.value.slice((currentPage.value-1)*pageSize.value,limitItems.value)////默認顯示10個項目,根據limitItems變化而改變,而limitItems與頁數掛勾
  }
})
//分頁
//文章列表
const articleList = ref<Articles | null>(null)
onMounted(() => {
  {
    http({
      url: http.adornUrl('/article/list'),
      method: 'get',
      params: http.adornParams({})
    }).then(({data}: { data: any }) => {
      // alert("請求文章列表成功")
      articleList.value = data
      totalItems=data.length
      console.log("totalItems:",totalItems)
      // console.log("articleList.value",articleList.value)
    })
  }
})
//文章列表/

const handleGoBackend = function () {//進入後台管理系統
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


