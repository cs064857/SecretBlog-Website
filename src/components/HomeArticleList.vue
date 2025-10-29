<script setup lang="ts">
import {computed, onMounted, onUpdated, ref, watch} from "vue";

import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import http from "../utils/httpRequest"
import {ElMessage} from "element-plus";
// 時間組件
// import dayjs from 'dayjs'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-tw' // 引入繁體中文語系
dayjs.extend(relativeTime)
dayjs.locale('zh-tw') // 設定預設語系為繁體中文


const route = useRoute()
const router = useRouter();

let totalItems = ref<number>()
const pageSize = ref(20)//每條顯示條目個數,默認為20
const currentPage = ref(1)//目前頁數,默認為1
let limitItems = ref<number>(20)//默認顯示20個項目,limitItems與頁數掛勾

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

import { AmsListRecordsListInterface } from "@/interface/amsListRecordsInterface"
import {R} from "@/interface/R"
const getArticles = function (categoryId, routePage) {

    console.log("getArticles:categoryId=" + categoryId + ",routePage=" + routePage)
    http({
      url: http.adornUrl(`/article/categories/${categoryId}/articles`),
      method: 'get',
      params: http.adornParams({routePage: routePage})
    }).then(({data}: {data:R<AmsListRecordsListInterface>}) => {
      
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

    <div class="home-article">

        <div v-for="article in articleList"   :key="article.articleId"  class="article-box">
          <div class="article-title">
            <router-link :to="{name:'Article',params:{articleId:article.articleId}}"><p>{{ article.title }}</p></router-link>
          </div>
          <div class="article-info">
            <div class="article-category">
                {{article.categoryName}}
                
                <!-- <div>username</div> -->
                
                <!-- <div>avatar</div> -->


            </div>
            <div class="article-tags">
              <div v-for="amsArtTag in article.amsArtTagList" class="article-tag">
                {{ amsArtTag.tagsId }}
            </div>
            <!-- <div class="article-tag">
                AI API
            </div> -->
            <!-- <div class="article-tag">
                LLM大模型
            </div>
            <div class="article-tag">
                RAG知識庫
            </div> -->
            </div>

            <div class="article-metrics">

                <div class="article-metrics-label">喜歡</div>
                <div class="article-metrics-label">查看</div>
                <div class="article-metrics-label">書籤</div>
                <div class="article-metrics-label">創建時期</div>
                <div class="article-metrics-label">更新日期</div>

                <div class="article-metrics-value">{{article.likesCount}}</div>
                <div class="article-metrics-value">{{article.viewsCount}}</div>
                <div class="article-metrics-value">{{article.bookmarksCount}}</div>
                <div class="article-metrics-value">{{ dayjs(article.createTime).fromNow() }}</div>
                <div class="article-metrics-value">{{ dayjs(article.updateTime).fromNow() }}</div>

                <!-- <div class="article-metrics-label">喜歡</div>
                <div class="article-metrics-label">查看</div>
                <div class="article-metrics-label">書籤</div>
                <div class="article-metrics-label">創建時期</div>
                <div class="article-metrics-label">更新日期</div>

                <div class="article-metrics-value">001</div>
                <div class="article-metrics-value">002</div>
                <div class="article-metrics-value">003</div>
                <div class="article-metrics-value">12小時</div>
                <div class="article-metrics-value">24小時</div> -->

            </div>
          </div>

        </div>
    <hr>
    </div>


  <!-- <div v-for="article in articleList"  :key="article.id" class="home-article">

    <div class="article-box">
      <div class="article-title">
        <router-link :to="{name:'Article',params:{articleId:article.amsArtTagList[0].articleId}}"><p>{{ article.title }}</p></router-link>
      </div>
      <div class="article-info">
        <div class="article-category"></div>
        <div class="article-metrics"></div>
      </div>

    </div>
    <hr>
  </div> -->


<!-- <div v-for="article in articleList" :key="article.id" class="home-article"> -->
    <!-- <div class="article-title">
      <router-link :to="{name:'Article',params:{articleId:article.id}}"><p>{{ article.title }}</p></router-link>
    </div>
    <div class="article-content"></div>

    <div class="article-info"></div>
  </div> -->

  <div class="home-article-footer">
    <el-pagination @current-change="handleCurrentPageChange" @size-change="handlePageSizeChange"
                   v-model:current-page="currentPage" v-model:page-size="pageSize" background
                   layout="prev, pager, next" :total="totalItems"/>
  </div>
</template>

<style scoped>
.article-category-categoryname{
  text-align: center;
  width: 50%;
  
}

.article-tag{
  background-color: #549122;
  
}

.article-tags{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: bisque;
  flex: 4.5;

  min-width: 0; 

  overflow: hidden;

  padding: 0.5rem; 
  box-sizing: border-box;
  height: 100%;
}
.article-metrics{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #881d1d;
  flex: 4.5;

  min-width: 0; 
  

  overflow: hidden;

  padding: 0.5rem; 
  box-sizing: border-box;
}
.article-category{
  /* display: flex;
  flex-direction: row;
  align-items: center; */

  /* 將這個 div 變成 flex 容器 */
  display: flex;
  

  justify-content: center; 
  

  align-items: center;   
  background-color: #1d5888;
  flex: 1;
  min-width: 0; 
  overflow: hidden;
  padding: 0.5rem; 
  box-sizing: border-box;
  height: 100%;
}
.article-metrics-label{
  text-align: center;
  width: 20%;
}
.article-metrics-value{
  text-align: center;
  
  width: 20%;
}
.article-title p[data-v-7a0f854b] {
  font-size: 22px;
  font-weight: bold;


  /* 由左至右依序嘗試使用字體，最後使用系統預設的無襯線字體 */
  /* font-family: 'Microsoft JhengHei', 'PingFang TC', 'STHeiti', 'Noto Sans TC', ; */
  /* font-family: 'Source Han Sans'; */

}

.article-title a {
  text-decoration: none;  /* 移除超連結底線 */

}

/* .article-info-1{
  background-color: #0c2a5a;
  width: 100%;
  height: 10px;
} */
hr{
  background-color: #ffffff;
  opacity: 0.5; /* 0.3 代表 30% 的不透明度 */
  width: 100%;
  position: relative;
  top: 1.5vh;
}
.article-info{
  background-color: #549122;
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: row;
  justify-content: center;


}
.article-title{
  background-color: #5c390e;
  display: flex;

  align-items: center;
  width: 100%;
  height: 60%;
}

.article-box{
  
  background-color: #9a6e3a;
  width: 100%;
  height: 12vh;
}
.home-article{
  display: flex;
  flex-direction: column;
  gap:1rem;
  /* 間距 */

}
.article-title p {
  max-height: 20%;
  min-height: 20%;

  font-size: 20px;
  margin-top: 0;
  position: relative;
  top: 6px;

}


.home-article {
  display: flex;
  flex-direction: column;
  overflow: visible;
  /*border: 3px solid mediumpurple;*/
  /*border-radius: 30px 30px 30px 30px;*/
  /*box-shadow: deeppink 0 0 5px;*/
  /*background-color: white;*/
  margin: 0% 5% 2% 5%;
  /*width: 60%;*/
  /*max-height: 100vh;*/
  /*min-height: auto;*/
  height: auto;


  /*position: relative; !* 設置相對定位 *!*/
}
.article-content {
  /*height: 70vh;*/
  max-height: 20vh;
  min-height: 20vh;

  padding: 0 0 18px 10px;
  background-color: #9a6e3a;
  width: 100%;

  /*border-radius: 0 0 0 0;*/
  overflow: hidden; /* 隱藏溢出內容 */

  text-wrap: wrap;
}

.home-article-footer {
  grid-column: 1 / -1; /* 橫跨整個行 */
  display: flex;
  justify-content: center;
  align-self: center;
  background-color: darkred;
  width: 100%;
  height: 5vh;


}
</style>
