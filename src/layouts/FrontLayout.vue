<template>
  <div class="home-container">
    <div class="home-header">

      <HomeHeaderNavigation></HomeHeaderNavigation>


    </div>


    <div class="home-main" ref="scrollContainer">
  <div class="fixed-home-left-navbar">
    <div class="home-left-navbar">
      <HomeLeftNavbar></HomeLeftNavbar>
    </div>
  </div>

  <div class="main-content-area">
    <div class="home-article-list" ref="containerRef">
      <HomeArticleList ref="articleList"></HomeArticleList>
      <div ref="bottomSentinel" style="height: 20px;"></div>
    </div>

    <el-affix style="height: 1vh" position="top" target=".home-main" :offset="50">
      <div class="home-right-article">
        <div class="scroll-info">
          <!-- Your content here -->
        </div>
      </div>
    </el-affix>
  </div>
</div>

    <!--    <div class="home-footer">home-footer</div>-->
  </div>

</template>

<style scoped>


.scroll-info {
  color: #ffffff;
}

.scroll-info h3 {
  margin-bottom: 10px;
  font-size: 16px;
}

.scroll-info p {
  margin: 5px 0;
  font-size: 14px;
}

</style>

<script setup lang="ts" name="Home">
import '../assets/css/Home.css';
import {computed, onMounted, ref, toRefs, onUnmounted, nextTick} from 'vue';
import {useRouter, useRoute} from 'vue-router'
import http from '../utils/httpRequest'
import {ArticleInter, Articles} from "@/interface/front/articleInterface";
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


</script>


