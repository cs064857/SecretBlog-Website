<template>
  <div class="home-container">
    <div class="home-header">

      <HomeHeaderNavigation></HomeHeaderNavigation>


    </div>

    <div v-if="!isLargeScreen" class="mobile-menu-bar">
      <el-button @click="showMobileMenu = !showMobileMenu" :icon="Menu" type="primary">展開選單</el-button>
    </div>

    <div class="home-main" ref="scrollContainer">

      <div v-if="(!isLargeScreen && showMobileMenu)" class="mobile-menu-overlay" @click="showMobileMenu = false"></div>

      <div v-if="isLargeScreen || showMobileMenu" class="fixed-home-left-navbar">
        <div class="home-left-navbar">
          <HomeLeftNavbar></HomeLeftNavbar>
        </div>
      </div>

      <div class="main-content-area">


        <div class="home-article-list" ref="containerRef">

          <div class="home-article-header">
            <div class="home-article-header-main">
              <div class="home-article-header-main-tags">
                  <div>標籤列表</div>
                  <div>分類列表</div>

              </div>
              <div class="home-article-header-main-nav-pills">
                  <div>最新1</div>
                  <div>最新2</div>
                  <div>最新3</div>
              </div>
              <div class="home-article-header-main-controls">
                  <el-button @click="handleOpenCreateArticleModal()" type="primary">新增文章</el-button>

              </div>
            </div>
          </div>
 
          <div class="home-article-list-middle">
            <HomeArticleList ref="articleList"></HomeArticleList>
            <div ref="bottomSentinel" style="height: 20px;"></div>
            <!-- <div class="home-article-footer">
              <div class="home-article-footer-pagination">
                <el-pagination @current-change="handleCurrentPageChange" @size-change="handlePageSizeChange"
                    v-model:current-page="currentPage" v-model:page-size="pageSize" background
                    layout="prev, pager, next" :total="totalItems"/>
              </div>

            </div> -->
          </div>

        </div>

        <!-- <div style="width: 100px;height: 100px;background-color: #395c5c;" class="home-article-list-right">

          123
          
        </div> -->

        
      </div>
    </div>


    <!--    <div class="home-footer">home-footer</div>-->
  </div>


  <!-- 回覆評論彈出框 -->
  <ReplyModal
    :modalVisible="createArticleModalVisible"
    @close="handleCloseReplyModal"
    @submit="handleCreateArticle"
  />
</template>

<style scoped>



</style>

<script setup lang="ts" name="Home">
import '../assets/css/Home.css';
import {computed, onMounted, ref, toRefs, onUnmounted, nextTick} from 'vue';
import {useRouter, useRoute} from 'vue-router'
import http from '../utils/httpRequest'

import { Menu, User} from "@element-plus/icons-vue";
import {R} from "../interface/R.ts";
import {useTreeCategoryStore} from "../pinia/useTreeCategoryStore";
import {ElMessage} from "element-plus";
import { throttle } from '@/utils/debounce';
interface tagsButton {
  title: string
  route: string
  name: string
  articleId: string
}

const tagsButtons: tagsButton[] = [];
const router = useRouter()
const route = useRoute()




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
//     articleId: "1828018170493947905",
//     title: "新聞2",
//     route: "/Article",
//     name: "Article"
//   }
// ])


// left-main中導航列模塊
import HomeLeftNavbar from "../components/HomeLeftNavbar.vue";
// home-article-list文章列表模塊
import HomeArticleList from "../components/HomeArticleList.vue";
//home-header-navigation Home首頁最上方導航列模塊
import HomeHeaderNavigation from "../components/HomeHeaderNavigation.vue";

// const scrollContainer = ref<HTMLElement | null>(null)
// const windowHeight = ref(0)
// const scrollY = ref(0)
// const documentHeight = ref(0)

// // 檢測滾動到底部的函數
// const updateScrollInfo = () => {
//   if (scrollContainer.value) {
//     console.log("handleScroll")
//     windowHeight.value = scrollContainer.value.clientHeight
//     scrollY.value = scrollContainer.value.scrollTop

//     documentHeight.value = scrollContainer.value.scrollHeight


//   // 當滾動到底部時（考慮 20px 的緩衝區）
//   if (windowHeight.value + scrollY.value >= documentHeight.value - 100 && windowHeight.value != documentHeight.value) {
//     ElMessage({
//       message: '已到最底',
//       type: 'info',
//       duration: 2000
//     })
//     // alert("已到最底")
//   }
//   }
// }
// // 使用throttle函數包裝updateScrollInfo，以限制其執行頻率
// const throttledUpdateScrollInfo = throttle(updateScrollInfo, 1000);

// onMounted(async () => {
//   await nextTick(); // 等待 DOM 更新完成
//   updateScrollInfo(); // 现在获取到的 scrollHeight 是正确的
//   // 組件掛載時添加滾動監聽器
//   scrollContainer.value?.addEventListener('scroll', throttledUpdateScrollInfo);
//   window.addEventListener('resize', throttledUpdateScrollInfo);
// });

// onUnmounted(() => {
//   scrollContainer.value?.removeEventListener('scroll', throttledUpdateScrollInfo)
//   window.removeEventListener('resize', throttledUpdateScrollInfo)
// })

/**
 * 新增文章
 */

// 開啟回覆模態框
// 回覆模態框相關狀態
import ReplyModal from "@/components/ReplyModal.vue";
const createArticleModalVisible = ref(false);
const currentReplyUser = ref({
  username: '',
  commentContent: '',
  commentId: '',
  articleId: ''
});
const handleOpenCreateArticleModal = () => {
  // 為了測試，提供一組模擬數據
  // currentReplyUser.value = {
  //   username: '測試用戶',
  //   commentContent: '這是一條等待被回覆的原始評論內容...',
  //   commentId: 'mock-comment-id-123',
  //   articleId: 'mock-article-id-456'
  // };
  createArticleModalVisible.value = true;
};

// 關閉回覆模態框
const handleCloseReplyModal = () => {
  createArticleModalVisible.value = false;
  currentReplyUser.value = {
    username: '',
    commentContent: '',
    commentId: '',
    articleId: ''
  };
};

// 提交回覆
import {createArticleDataInterface} from "@/interface/createArticleDataInterface";
const handleCreateArticle = function (createArticle: createArticleDataInterface) {

// const save = ref(
//   {
//     title: inputTitle.value,
//     content: content.value,
//     categoryId:selectCategoryId.value,
//     tagsId: selectTagsValue.value
//   },
// )
// console.log("selectTagsValue:",selectTagsValue)

// console.log("save:", save)
if(createArticle == null){
  ElMessage.error("文章發布失敗")
  return
}
console.log("createArticle:", createArticle)
http({
  url: http.adornUrl('/article/save'),
  method: 'post',
  data: http.adornData(createArticle, false)
}).then(({data}:{ data: R }) => {
  console.log("data",data)
  if(data.code==200){
    createArticleModalVisible.value = false;
    ElMessage.success("文章發布成功")
    //刷新頁面
    window.location.reload();
  }else {
    ElMessage.error("文章發布失敗")
  }
});

}// 處理送出至資料庫中



// const handleNewArticle = async ()=>{
//   await http({
//     url: http.adornUrl('/article/save'),
//     method: 'post',
//     data: http.adornData(save.value, false)
//   }).then(({data}:{ data: R }) => {
//     console.log("data",data)
//     if(data.code==200){
//       ElMessage.success("文章發布成功")
//     }else {
//       ElMessage.error("文章發布失敗")
//     }
//   });
// }

// /**
//  * 分頁按鈕功能
//  */
//  let totalItems = ref<number>()
// const pageSize = ref(20)//每條顯示條目個數,默認為20
// const currentPage = ref(1)//目前頁數,默認為1
// let limitItems = ref<number>(20)//默認顯示20個項目,limitItems與頁數掛勾

// const handleCurrentPageChange = async function (CurrentPage) {
//   limitItems.value = CurrentPage * pageSize.value
//   console.log("CurrentPage變化:", CurrentPage)
//   try {
//     // 阻塞等待路由更新完畢
//     await router.push({
//       name: "Home", params: {categoryId: route.params.categoryId}, query: {page: CurrentPage}
//     })
//     //路由更新完畢後
//     const categoryId = route.params.categoryId;
//     const routePage = route.query.page;
//     console.log("手動觸發: categoryId=" + categoryId + ", routePage=" + routePage)
//     getArticles(categoryId,routePage)

//   } catch (e) {
//     console.error("路由更新失敗:",e)
//   }

//   // getArticles()
//   // router.push({name:"Home",params:{categoryId: route.params.categoryId,Page: CurrentPage}})


// }

// const handlePageSizeChange = function (PageSize: string) {
//   console.log("PageSize變化:", PageSize)
// }


// //獲取文章列表
// const articleList = ref<Articles | null>(null)
// // const categoryId = computed(() => route.params.categoryId)
// // const routePage = computed(() => route.query.page)
// // let categoryId = ref(route.params.categoryId)
// // const routePage = ref(route.query.page)

// import { AmsListRecordsListInterface } from "@/interface/amsListRecordsInterface"
// import {R} from "@/interface/R"
// const getArticles = function (categoryId, routePage) {

//     console.log("getArticles:categoryId=" + categoryId + ",routePage=" + routePage)
//     http({
//       url: http.adornUrl(`/article/categories/${categoryId}/articles`),
//       method: 'get',
//       params: http.adornParams({routePage: routePage})
//     }).then(({data}: {data:R<AmsListRecordsListInterface>}) => {
      
//       if (data.code == "200") {
//         console.log("根據分類ID與頁碼獲得的分頁資料:", data.data)
//         articleList.value = data.data.records//要展示的所有文章列表資料
//         console.log("根據分類ID與頁碼獲得的文章列表articleList.value:", articleList.value)

//         totalItems = data.data.total//當前分類下所有文章的總數量
//       } else {
//         ElMessage.error("加載失敗,請重新嘗試");
//       }
//     })

// }

// onBeforeRouteUpdate((to, from) => {
//   if (to.path !== from.path) {
//     const categoryId = to.params.categoryId;
//     const routePage = to.query.page;
//     console.log("檢測到Home路由改變:categoryId=" + categoryId + ",routePage=" + routePage)
//     getArticles(categoryId, routePage)
//   }
// })

// onMounted(() => {

//   getArticles(route.params.categoryId, route.query.page)


//   // {
//   //   http({
//   //     url: http.adornUrl('/article/list'),
//   //     method: 'get',
//   //     params: http.adornParams({})
//   //   }).then(({data}: { data: R }) => {
//   //     // alert("請求文章列表成功")
//   //     articleList.value = data.data//要展示的所有文章列表資料
//   //     totalItems = data.data.length//所有文章的總數量
//   //     console.log("從後端接收到的總文章數量totalItems:", totalItems)
//   //     console.log("從後端接收到的總文章列表articleList:", articleList.value)
//   //   })
//   // }
// })
// //獲取文章列表/

// //根據categoryId篩選與分頁
// // const limitArticleList: any = computed(() => {
// //   if (articleList.value != null) {
// //     //將路由中取的的Params page轉為bigint
// //     let categoryId: bigint;
// //     if (typeof route.params.categoryId === 'string') {
// //       categoryId = BigInt(route.params.categoryId); // 直接转换为 BigInt
// //     } else if (Array.isArray(route.params.categoryId) && route.params.categoryId.length > 0) {
// //       categoryId = BigInt(route.params.categoryId[0]); // 如果是数组，取第一个元素并转换为 BigInt
// //     } else {
// //       throw new Error("Invalid category ID");
// //     }
// //     // console.log("轉換後categoryId",categoryId)
// //     if (categoryId) {//若有指定文章分類的話
// //       console.log("根據分類ID進行文章列表過濾...")
// //       const limitarticleList=articleList.value.filter((article) => article.categoryId == categoryId)//根據URL中的Param參數,過濾出參數中指定分類的所有文章
// //       console.log("文章根據分類ID:"+categoryId+",過濾後的List:", limitarticleList)
// //       totalItems = limitarticleList.length
// //       console.log("根據分類ID過濾後的總文章數量totalItems:", totalItems)
// //       //執行分頁
// //       const PageArticleList = limitarticleList.slice((currentPage.value - 1) * pageSize.value, limitItems.value)////默認顯示10個項目,根據limitItems變化而改變,而limitItems與頁數掛勾
// //       return PageArticleList;
// //     }else {//若未指定文章分類的話列出所有文章列表
// //       //執行分頁
// //       const PageArticleList = articleList.value.slice((currentPage.value - 1) * pageSize.value, limitItems.value)////默認顯示10個項目,根據limitItems變化而改變,而limitItems與頁數掛勾
// //       return PageArticleList
// //     }
// //   }
// // })
// //根據categoryId篩選與分頁/


/**
 * 響應式
 */

import { useMediaQuery } from '@vueuse/core';


const isLargeScreen = useMediaQuery('(min-width: 960px)');
const showMobileMenu = ref(false);


// const matches = ref(false)
// let mediaQueryList = null;

// const updateMatch = (e) =>{
//   console.log('updateMatch',e)
//   matches.value = e.matches;
//   if (e.matches) {
//       console.log('小型螢幕');
//     } else {
//       console.log('中型螢幕');
//     }
// }

// const matchMedia = function(){

//   mediaQueryList = window.matchMedia('(max-width: 768px)');

//   mediaQueryList.addEventListener('change', updateMatch)


// }
// onMounted(() => {
//   matchMedia();
// })
// onUnmounted(() => {
//   if(mediaQueryList){
//     mediaQueryList.removeEventListener('change', updateMatch)
//   }
// })
</script>
