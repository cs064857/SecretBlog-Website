<template>
  <div class="home-container">
    <div class="home-header">

      <div class="home-header-navigation">
        <el-image src="https://element-plus.org/images/element-plus-logo.svg"
                  style="position: absolute;right: 83%;width: auto;height: 75%">
        </el-image>
        <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoCategory" type="primary" :icon="Menu"/>-->
        <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoUser" type="primary" :icon="User"/>-->
        <el-button style="height: 6vh;width: 6vh" @click="handleGoBackend" type="primary" :icon="Management"/>

      </div>

    </div>


    <div class="home-main">

<!--      <el-affix style="background-color: #646cff;width: 100%;height: 50px" target=".home-main" :offset="77">-->
<!--        <div class="home-article-navigation"><span-->
<!--            style="font-size: 20px;font-family: 'Noto Sans TC',sans-serif">標籤1</span></div>-->
<!--      </el-affix>-->


      <div class="fixed-home-left-navbar">
        <div class="home-left-navbar">
          <HomeLeftNavbar></HomeLeftNavbar>
        </div>

      </div>


      <div class="home-article-list" ref="containerRef">


        <HomeArticleList></HomeArticleList>


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
  articleId: string
}

const tagsButtons: tagsButton[] = [];
const router = useRouter()
const route = useRoute()



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





</script>


