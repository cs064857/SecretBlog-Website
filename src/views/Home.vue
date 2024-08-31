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
      <div class="home-left-article">



          <el-menu :default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
            <menu-item v-for="item in categoryList" :key="item.id" :item="item" />
          </el-menu>



<!--                <h5 class="mb-2">Custom colors</h5>-->
<!--        <el-menu-->
<!--            active-text-color=""-->
<!--            background-color=""-->
<!--            class="el-menu-vertical-demo"-->
<!--            default-active="Home"-->
<!--            text-color=""-->
<!--            @open="handleOpen"-->
<!--            @close="handleClose"-->
<!--        >-->

<!--          <el-menu-item index="Home">-->
<!--            <el-icon>-->
<!--              <HomeFilled/>-->
<!--            </el-icon>-->
<!--            <span>首頁</span>-->
<!--          </el-menu-item>-->

<!--          <el-sub-menu index="1">-->
<!--            <template #title>-->
<!--              <el-icon>-->
<!--                <location/>-->
<!--              </el-icon>-->
<!--              <span>Navigator One</span>-->
<!--            </template>-->
<!--            <el-menu-item-group title="Group One">-->
<!--              <el-menu-item index="1-1">item one</el-menu-item>-->
<!--              <el-menu-item index="1-2">item two</el-menu-item>-->
<!--            </el-menu-item-group>-->
<!--            <el-menu-item-group title="Group Two">-->
<!--              <el-menu-item index="1-3">item three</el-menu-item>-->
<!--            </el-menu-item-group>-->
<!--            <el-sub-menu index="1-4">-->
<!--              <template #title>item four</template>-->
<!--              <el-menu-item index="1-4-1">item one</el-menu-item>-->
<!--            </el-sub-menu>-->
<!--          </el-sub-menu>-->
<!--        </el-menu>-->

<!--          <el-sub-menu v-for="category in categoryList"  :index="category.id">-->
<!--            <template #title>-->
<!--              <el-icon>-->
<!--                <location/>-->
<!--              </el-icon>-->
<!--              <span>Navigator One</span>-->
<!--            </template>-->
<!--            <el-menu-item-group title="Group One">-->
<!--              <el-menu-item index="1-1">item one</el-menu-item>-->
<!--              <el-menu-item index="1-2">item two</el-menu-item>-->
<!--            </el-menu-item-group>-->
<!--            <el-menu-item-group title="Group Two">-->
<!--              <el-menu-item index="1-3">item three</el-menu-item>-->
<!--            </el-menu-item-group>-->
<!--            <el-sub-menu index="1-4">-->
<!--              <template #title>item four</template>-->
<!--              <el-menu-item index="1-4-1">item one</el-menu-item>-->
<!--            </el-sub-menu>-->
<!--          </el-sub-menu>-->


          <!--          <el-menu-item index="2">-->
          <!--            <el-icon><icon-menu /></el-icon>-->
          <!--            <span>Navigator Two</span>-->
          <!--          </el-menu-item>-->
          <!--          -->
          <!--          <el-menu-item index="3" disabled>-->
          <!--            <el-icon><document /></el-icon>-->
          <!--            <span>Navigator Three</span>-->
          <!--          </el-menu-item>-->


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
  console.log("articleList:", articleList)
  if (articleList.value != null) {
    let limitarticleList = articleList.value.slice((currentPage.value - 1) * pageSize.value, limitItems.value)////默認顯示10個項目,根據limitItems變化而改變,而limitItems與頁數掛勾

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
      console.log("執行文章分類過濾...")
      // for (let i = 0; i < limitarticleList.length; i++) {
      //   console.log("文章分類ID:"+i+":"+limitarticleList[i].categoryId)
      // }
      limitarticleList = limitarticleList.filter((article) => article.categoryId == categoryId)//根據URL中的Param參數,過濾出參數中指定分類的所有文章
      totalItems = limitarticleList.length
    }
    console.log("文章根據分類ID過濾後的List", limitarticleList)
    return limitarticleList;
    // const t1=articleList.value.slice((currentPage.value-1)*pageSize.value,limitItems.value)////默認顯示10個項目,根據limitItems變化而改變,而limitItems與頁數掛勾
    // console.log("t1:",t1)
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
      console.log("totalItems:", totalItems)
      console.log("articleList.value", articleList.value)
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
import MenuItem from '../components/MenuItem.vue'// 導入遞規組件


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


