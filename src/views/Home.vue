<template>
  <div class="home-container">
    <div class="home-header">

      <div class="home-header-navigation">
        <el-image src="https://element-plus.org/images/element-plus-logo.svg" style="position: absolute;right: 83%;width: auto;height: 75%">11</el-image>
<!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoCategory" type="primary" :icon="Menu"/>-->
<!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoUser" type="primary" :icon="User"/>-->
        <el-button style="height: 6vh;width: 6vh" @click="handleGoBackend" type="primary" :icon="Management"/>


      </div>

    </div>
    <div class="home-main">
      <el-affix style="background-color: #646cff;width: 100%;height: 50px" target=".home-main" :offset="77">
        <div class="home-article-navigation"><span  style="font-size: 20px;font-family: 'Noto Sans TC',sans-serif">標籤1</span></div>
      </el-affix>
      <div class="home-left-article">

      </div>

      <div class="home-article-list" ref="containerRef">

        <div v-for="(article,articleIndex) in limitArticleList" :key="article.id" class="home-article">
          <div class="article-title">
            <router-link :to="{name:'Article',params:{article_id:article.id}}"><p>{{ article.title }}</p></router-link>
          </div>
          <div v-html="article.content" class="article-content"></div>
          <div class="article-info"></div>
        </div>

        <div class="home-article-footer">
          <el-pagination @current-change="handleCurrentPageChange" @size-change="handlePageSizeChange" v-model:current-page="currentPage" v-model:page-size="pageSize" background layout="prev, pager, next" :total="totalItems" />
        </div>

      </div>

        <el-affix style="height: 1vh" position="top"  target=".home-main"  :offset="50" >
<!--          <el-affix position="bottom" target=".home-main" style="margin-top: 50%;"  :offset="800" z-index="1200">-->
        <div class="home-right-article"></div>
        </el-affix>



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
import {Management, Menu, User} from "@element-plus/icons-vue";
import {R} from "../interface/R.ts";
import {useTreeCategoryStore} from "../pinia/useTreeCategoryStore.ts";
import {ElMessage} from "element-plus";

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
    // const t1=articleList.value.slice((currentPage.value-1)*pageSize.value,limitItems.value)////默認顯示10個項目,根據limitItems變化而改變,而limitItems與頁數掛勾
    // console.log("t1:",t1)
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
    }).then(({data}: { data: R }) => {
      // alert("請求文章列表成功")
      articleList.value = data.data
      totalItems=data.data.length
      console.log("totalItems:",totalItems)
      console.log("articleList.value",articleList.value)
    })
  }
})
//文章列表/

const handleGoBackend = function () {//進入後台管理系統
  router.push('/AdminVue')
}
// const testRoute = function () {
//   router.push('/Home/News1Test')
// }

// const buttons = ref<typeof tagsButtons>([
//   {
//     title: "首頁",
//     route: "/",
//   },
//   {
//     title: "新聞1",
//     route: "/Home/News1Test",
//   },
//   {
//     title: "關於",
//     route: "/Home/News2Test",
//   },
//   {
//     article_id: "1828018170493947905",
//     title: "新聞2",
//     route: "/Article",
//     name: "Article"
//   }
// ])
// 分類
const getCategoryList = function () {
  http({
    url: http.adornUrl('/article/category/list'),
    method: 'get',
    params: http.adornParams({})
  }).then(({data}) => {
    if (data.code == 200) {

    } else {
      ElMessage.error("獲取分類數據錯誤");
    }
  })
}
onMounted(() => {
  getCategoryList()//從後端獲取分類數據

})
// 分類/
</script>


