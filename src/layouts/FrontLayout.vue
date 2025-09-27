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
            <el-button @click="handleOpenReplyModal()" type="primary">新增文章</el-button>

        </div>
      </div>
    </div>
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


  <!-- 回覆評論彈出框 -->
  <ReplyModal
    :visible="replyModalVisible"
    :replyToUser="currentReplyUser"
    @close="handleCloseReplyModal"
    @submit="handleSubmitReply"
  />
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

/**
 * 新增文章
 */

// 開啟回覆模態框
// 回覆模態框相關狀態
import ReplyModal from "@/components/ReplyModal.vue";
const replyModalVisible = ref(false);
const currentReplyUser = ref({
  username: '',
  commentContent: '',
  commentId: '',
  articleId: ''
});
const handleOpenReplyModal = () => {
  // 為了測試，提供一組模擬數據
  // currentReplyUser.value = {
  //   username: '測試用戶',
  //   commentContent: '這是一條等待被回覆的原始評論內容...',
  //   commentId: 'mock-comment-id-123',
  //   articleId: 'mock-article-id-456'
  // };
  replyModalVisible.value = true;
};

// 關閉回覆模態框
const handleCloseReplyModal = () => {
  replyModalVisible.value = false;
  currentReplyUser.value = {
    username: '',
    commentContent: '',
    commentId: '',
    articleId: ''
  };
};

// 提交回覆
const handleSubmitReply = async (content: string, replyData: any) => {
  try {
    const response = await http({
      url: http.adornUrl('/article/comment/create'),
      method: 'post',
      data: http.adornData({
        commentContent: content,
        parentCommentId: replyData.commentId,
        articleId: replyData.articleId
      }, false)
    });

    if (response.data.code === 200) {
      ElMessage.success("回覆發送成功！");
      handleCloseReplyModal();
      // 重新加載評論
      // getArtComments();
    } else {
      ElMessage.error("回覆發送失敗：" + response.data.msg);
    }
  } catch (error) {
    ElMessage.error("網路錯誤，請稍後再試");
    console.error('發送回覆時出錯:', error);
  }
};

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
</script>


