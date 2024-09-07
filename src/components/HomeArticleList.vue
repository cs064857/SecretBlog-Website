<script setup lang="ts">
import {computed, onMounted, onUpdated, ref, watch} from "vue";
import {Articles} from "../interface/articleInterface.ts";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import http from "../utils/httpRequest"
import {R} from "../interface/R.ts";
import {ElMessage} from "element-plus";

const route = useRoute()
const router = useRouter();

let totalItems = ref<number>()
const pageSize = ref(10)//每條顯示條目個數,默認為10
const currentPage = ref(1)//目前頁數,默認為1
let limitItems = ref<number>(10)//默認顯示10個項目,limitItems與頁數掛勾

const handleCurrentPageChange = async function (CurrentPage) {
  limitItems.value = CurrentPage * pageSize.value
  console.log("CurrentPage變化:", CurrentPage)
  try {
    // 阻塞等待路由更新完畢
    await router.push({
      name: "Home", params: {categoryId: route.params.categoryId}, query: {page: CurrentPage}
    })
    //路由更新完畢後
    const categoryId = route.params.categoryId;
    const routePage = route.query.page;
    console.log("手動觸發: categoryId=" + categoryId + ", routePage=" + routePage)
    getArticles(categoryId,routePage)

  } catch (e) {
    console.error("路由更新失敗:",e)
  }

  // getArticles()
  // router.push({name:"Home",params:{categoryId: route.params.categoryId,Page: CurrentPage}})


}

const handlePageSizeChange = function (PageSize: string) {
  console.log("PageSize變化:", PageSize)
}

//獲取文章列表
const articleList = ref<Articles | null>(null)
// const categoryId = computed(() => route.params.categoryId)
// const routePage = computed(() => route.query.page)
// let categoryId = ref(route.params.categoryId)
// const routePage = ref(route.query.page)


const getArticles = function (categoryId, routePage) {
  console.log("getArticles:categoryId=" + categoryId + ",routePage=" + routePage)
  http({
    url: http.adornUrl(`/article/categories/${categoryId}/articles`),
    method: 'get',
    params: http.adornParams({routePage: routePage})
  }).then(({data}) => {
    if (data.code == 200) {
      console.log("根據分類ID與頁碼獲得的分頁資料:", data.data)
      articleList.value = data.data.records//要展示的所有文章列表資料
      console.log("根據分類ID與頁碼獲得的文章列表articleList.value:", articleList.value)
      totalItems = data.data.total//當前分類下所有文章的總數量
    } else {
      ElMessage.error("加載失敗,請重新嘗試");
    }
  })
}

onBeforeRouteUpdate((to, from) => {
  if (to.path !== from.path) {
    const categoryId = to.params.categoryId;
    const routePage = to.query.page
    console.log("檢測到Home路由改變:categoryId=" + categoryId + ",routePage=" + routePage)
    getArticles(categoryId, routePage)
  }
})

onMounted(() => {

  getArticles(route.params.categoryId, route.query.page)


  // {
  //   http({
  //     url: http.adornUrl('/article/list'),
  //     method: 'get',
  //     params: http.adornParams({})
  //   }).then(({data}: { data: R }) => {
  //     // alert("請求文章列表成功")
  //     articleList.value = data.data//要展示的所有文章列表資料
  //     totalItems = data.data.length//所有文章的總數量
  //     console.log("從後端接收到的總文章數量totalItems:", totalItems)
  //     console.log("從後端接收到的總文章列表articleList:", articleList.value)
  //   })
  // }
})
//獲取文章列表/

//根據categoryId篩選與分頁
// const limitArticleList: any = computed(() => {
//   if (articleList.value != null) {
//     //將路由中取的的Params page轉為bigint
//     let categoryId: bigint;
//     if (typeof route.params.categoryId === 'string') {
//       categoryId = BigInt(route.params.categoryId); // 直接转换为 BigInt
//     } else if (Array.isArray(route.params.categoryId) && route.params.categoryId.length > 0) {
//       categoryId = BigInt(route.params.categoryId[0]); // 如果是数组，取第一个元素并转换为 BigInt
//     } else {
//       throw new Error("Invalid category ID");
//     }
//     // console.log("轉換後categoryId",categoryId)
//     if (categoryId) {//若有指定文章分類的話
//       console.log("根據分類ID進行文章列表過濾...")
//       const limitarticleList=articleList.value.filter((article) => article.categoryId == categoryId)//根據URL中的Param參數,過濾出參數中指定分類的所有文章
//       console.log("文章根據分類ID:"+categoryId+",過濾後的List:", limitarticleList)
//       totalItems = limitarticleList.length
//       console.log("根據分類ID過濾後的總文章數量totalItems:", totalItems)
//       //執行分頁
//       const PageArticleList = limitarticleList.slice((currentPage.value - 1) * pageSize.value, limitItems.value)////默認顯示10個項目,根據limitItems變化而改變,而limitItems與頁數掛勾
//       return PageArticleList;
//     }else {//若未指定文章分類的話列出所有文章列表
//       //執行分頁
//       const PageArticleList = articleList.value.slice((currentPage.value - 1) * pageSize.value, limitItems.value)////默認顯示10個項目,根據limitItems變化而改變,而limitItems與頁數掛勾
//       return PageArticleList
//     }
//   }
// })
//根據categoryId篩選與分頁/


</script>

<template>
  <div v-for="article in articleList" :key="article.id" class="home-article">
    <div class="article-title">
      <router-link :to="{name:'Article',params:{articleId:article.id}}"><p>{{ article.title }}</p></router-link>
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
