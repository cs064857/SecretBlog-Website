<template>
  <div class="home-container">
    <div class="home-header">

      <div class="home-header-navigation">
        <el-image src="https://element-plus.org/images/element-plus-logo.svg"
                  style="position: absolute;right: 83%;width: auto;height: 75%">11
        </el-image>
        <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoCategory" type="primary" :icon="Menu"/>-->
        <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoUser" type="primary" :icon="User"/>-->
        <el-button style="height: 6vh;width: 6vh" @click="handleGoBackend" type="primary" :icon="Management"/>


      </div>

    </div>
    <div class="home-main">
      <el-affix style="background-color: #646cff;width: 100%;height: 50px" target=".home-main" :offset="77">
        <div class="home-article-navigation"><span
            style="font-size: 20px;font-family: 'Noto Sans TC',sans-serif">標籤1</span></div>
      </el-affix>
      <div class="home-left-navbar">
<!--   左側菜單使用el-menu       -->
<!--          <el-menu :default-active="1" class="el-menu-vertical-demo" @select="handleSelect">-->
<!--            <menu-item v-for="item in categoryList" :key="item.id" :item="item" />-->
<!--          </el-menu>-->

        <HomeLeftNavbar :categoryList="categoryList"></HomeLeftNavbar>

      </div>

      <div class="home-article-list" ref="containerRef">


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

      </div>

      <el-affix style="height: 1vh" position="top" target=".home-main" :offset="50">
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
// 左側left-article分類導航列
// const handleCategoryRouterLink=function (children){
//   console.log("分類ID:",children.id)
//   router.push({name: "Home",params: {categoryId:children.id}})
//   // router.push('/Home/' + children.id)
// }
// 左側left-article分類導航列/

// 分頁
let totalItems = ref<number>()
const pageSize = ref(10)//每條顯示條目個數,默認為10
const currentPage = ref(1)//目前頁數,默認為1
let limitItems = ref<number>(10)//默認顯示10個項目,limitItems與頁數掛勾
// handleCurrentPageChange()

const handleCurrentPageChange = function (CurrentPage) {
  limitItems.value = CurrentPage * pageSize.value
  console.log("CurrentPage變化:", CurrentPage)
}
const handlePageSizeChange = function (PageSize: string) {
  console.log("PageSize變化:", PageSize)
}


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
//分頁
//文章列表
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
// 樹形分類數據
const getTreeCategoryList = function () {
  http({
    url: http.adornUrl('/article/category/tree/list'),
    method: 'get',
    params: http.adornParams({})
  }).then(({data}) => {
    if (data.code == 200) {
      // categoryList=data.data
      categoryList.value=data.data
      console.log("categoryList.value",categoryList.value)
      // console.log("從後端獲取樹型分類數據:",categoryList)
    } else {
      ElMessage.error("獲取分類數據錯誤");
    }
  })
}
onMounted(() => {

  getTreeCategoryList()//從後端獲取分類數據

})

// left-main中導航列
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  HomeFilled,
} from '@element-plus/icons-vue'
import {TreeCategoryNode} from '../interface/treeCategoryInterface'
import MenuItem from '../components/MenuItem.vue'
import HomeLeftNavbar from "../components/HomeLeftNavbar.vue";
// 導入遞規組件


let categoryList = ref()

// let categoryList=ref<TreeCategoryNode | undefined>()

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const activeIndex = ref(); // 默认选中的菜单项

const handleSelect = (key, keyPath) => {
  console.log('Selected key:', key);
  console.log('Key path:', keyPath);
};
// 分類/


// left-main中導航列 /
</script>


