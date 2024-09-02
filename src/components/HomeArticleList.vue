<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {Articles} from "../interface/articleInterface.ts";
import {useRoute,useRouter} from "vue-router";
import http from "../utils/httpRequest"
import {R} from "../interface/R.ts";
const route= useRoute()

let totalItems = ref<number>()
const pageSize = ref(10)//每條顯示條目個數,默認為10
const currentPage = ref(1)//目前頁數,默認為1
let limitItems = ref<number>(10)//默認顯示10個項目,limitItems與頁數掛勾

const handleCurrentPageChange = function (CurrentPage) {
  limitItems.value = CurrentPage * pageSize.value
  console.log("CurrentPage變化:", CurrentPage)
}

const handlePageSizeChange = function (PageSize: string) {
  console.log("PageSize變化:", PageSize)
}

//獲取文章列表
const articleList = ref<Articles | null>(null)
onMounted(() => {
  const routePage = route.params.categoryId
  console.log("routePage:", routePage)
  {
    http({
      url: http.adornUrl('/article/list'),
      method: 'get',
      params: http.adornParams({})
    }).then(({data}: { data: R }) => {
      // alert("請求文章列表成功")
      articleList.value = data.data//要展示的所有文章列表資料
      totalItems = data.data.length//所有文章的總數量
      console.log("從後端接收到的總文章數量totalItems:", totalItems)
      console.log("從後端接收到的總文章列表articleList:", articleList.value)
    })
  }
})
//獲取文章列表/

//根據categoryId篩選與分頁
const limitArticleList: any = computed(() => {
  if (articleList.value != null) {
    //將路由中取的的Params page轉為bigint
    let categoryId: bigint;
    if (typeof route.params.categoryId === 'string') {
      categoryId = BigInt(route.params.categoryId); // 直接转换为 BigInt
    } else if (Array.isArray(route.params.categoryId) && route.params.categoryId.length > 0) {
      categoryId = BigInt(route.params.categoryId[0]); // 如果是数组，取第一个元素并转换为 BigInt
    } else {
      throw new Error("Invalid category ID");
    }
    // console.log("轉換後categoryId",categoryId)
    if (categoryId) {//若有指定文章分類的話
      console.log("根據分類ID進行文章列表過濾...")
      const limitarticleList=articleList.value.filter((article) => article.categoryId == categoryId)//根據URL中的Param參數,過濾出參數中指定分類的所有文章
      console.log("文章根據分類ID:"+categoryId+",過濾後的List:", limitarticleList)
      totalItems = limitarticleList.length
      console.log("根據分類ID過濾後的總文章數量totalItems:", totalItems)
      //執行分頁
      const PageArticleList = limitarticleList.slice((currentPage.value - 1) * pageSize.value, limitItems.value)////默認顯示10個項目,根據limitItems變化而改變,而limitItems與頁數掛勾
      return PageArticleList;
    }else {//若未指定文章分類的話列出所有文章列表
      //執行分頁
      const PageArticleList = articleList.value.slice((currentPage.value - 1) * pageSize.value, limitItems.value)////默認顯示10個項目,根據limitItems變化而改變,而limitItems與頁數掛勾
      return PageArticleList
    }
  }
})
//根據categoryId篩選與分頁/


</script>

<template>
  <div v-for="article in limitArticleList" :key="article.id" class="home-article">
    <div class="article-title">
      <router-link :to="{name:'Article',params:{article_id:article.id}}"><p>{{ article.title }}</p></router-link>
    </div>
    <div v-html="article.content" class="article-content"></div>
    <div class="article-info"></div>
  </div>

  <div class="home-article-footer">
    <el-pagination @current-change="handleCurrentPageChange" @size-change="handlePageSizeChange"
                   v-model:current-page="currentPage" v-model:page-size="pageSize" background
                   layout="prev, pager, next" :total="totalItems"/>
  </div>
</template>

<style scoped>

</style>
