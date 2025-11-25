<template>
  <ArticleSkeleton v-if="loading" />

  <section v-else-if="Article">

    <div ref="scrollContainer" class="article-container">


      <HomeHeaderNavigation ref="headerRef"></HomeHeaderNavigation>


      <!-- <div class="article-main"> -->

      <div class="article-content-list" ref="articleContentListRef">
        <div class="Box1">
          1
        </div>

        <div class="Box3">



          <div class="article-header">
            <!-- <div><h1>{{ Article?.userId}}</h1></div> -->
            <div class="article-header-title">
              <h1><span>{{ Article.title }}</span></h1>
            </div>

            <div class="article-header-info">


              <div class="article-header-info-user">
                <el-avatar :size="25"
                  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                <span>{{ Article.nickName }}</span>
              </div>

              <div class="article-header-info-right">

                <div class="article-header-info-edit">
                  <!-- <img @click="handleEditArticle" src="/src/assets/pen-solid-full.svg" alt="edit" style="width: 1.5rem;height: 1.5rem;"></img> -->
                  <img @click="handleOpenEditArticleModal" src="/src/assets/pen-solid-full.svg" alt="edit"
                    style="width: 1.5rem;height: 1.5rem;"></img>
                  <!-- <el-button @click="handleOpenEditArticleModal()" type="primary">新增文章</el-button> -->
                </div>

                <div class="article-header-info-time">
                  <span>{{ dayjs(Article.createTime).format('YYYY-MM-DD HH:mm') }}</span>
                  <!-- <span>{{ dayjs(Article.updateTime).format('YYYY-MM-DD HH:mm') }}</span> -->
                  <!-- <span>{{ Article.updateTime }}</span> -->
                </div>


              </div>

            </div>





          </div>


          <div v-html="ArticleContent" class="article-content" ref="articleContentRef">

          </div>

        </div>

        <div class="Box2">

          <div class="Box4">
            <el-anchor ref="anchorRef" :offset="70" @change="handleChange">

              <el-anchor-link v-for="item in articleAnchorData" :key="item.id" :href="'#' + item.id">
                {{ item.title }}
              </el-anchor-link>

            </el-anchor>
          </div>

        </div>

      </div>

    </div>

    <div class="article-metrics">

      <div class="metrics-container">
        <div class="metrics-button-wrapper">
          <button @click="handleArticleLike" class="like-button">
            <img class="like-icon" src="/src/assets/eye-solid-full.svg" alt="like">
            <span class="like-count">{{ Article?.viewsCount ?? 0 }}</span>

          </button>
        </div>
      </div>

      <div class="metrics-container">
        <div class="metrics-button-wrapper">
          <button @click="handleArticleLike" class="like-button" :class="{ 'liked': isLiked }">
            <img class="like-icon" src="/src/assets/heart-solid-full.svg" alt="like">
            <span class="like-count">{{ Article?.likesCount ?? 0 }}</span>

          </button>
        </div>
      </div>









      <div class="metrics-container">
        <div class="metrics-button-wrapper">
          <button @click="handleArticleLike" class="like-button" :class="{ 'liked': isBooksMarked }">
            <img class="like-icon" src="/src/assets/bookmark-solid-full.svg" alt="like">

            <span class="like-count">{{ Article?.bookmarksCount ?? 0 }}</span>
          </button>
        </div>

      </div>
    </div>



    <div class="article-comment">


      <div class="article-comment-input">
        <el-input v-model="textarea1" style="width: 100%;font-size: 18px" :rows="8" maxlength="480" resize="none"
          type="textarea" placeholder="輸入評論..." />
      </div>

      <div class="article-comment-button">
        <el-button @click="handleCommitComment" size="large" type="primary" round>發表評論</el-button>
      </div>
    </div>

    <div class="article-footer">
      <div v-for="(articleComment, index) in renderedComments" :key="index" class="article-comment-context">

        <div class="article-comment-context-avatar">
          <img class="user-avatar" :src="articleComment.avatar" alt="avatar">
        </div>

        <div class="article-comment-context-item">


          <div class="article-comment-context-item-avatar">

            <div class="user-username">{{ articleComment.nickName }}</div>
            <div v-if="articleComment.parentCommentId" class="user-parentUsername"><img
                style="position: relative; top:0.5rem;  width: 3rem; height: 2rem;"
                src="/src/assets/share-solid-full.svg">{{articleComment.parentCommentId ?
                  renderedComments.find(item => item.commentId == articleComment.parentCommentId).nickName : ''}}</div>
            <!-- <div class="user-parentUsername"><img style="position: relative; top:0.5rem;  width: 3rem; height: 2rem;" src="/src/assets/share-solid-full.svg">{{renderedComments.find(item=>item.commentId==1968026366882635777).username}}</div> -->
            <!-- <div class="user-parentUsername"><img style="position: relative; top:0.5rem;  width: 3rem; height: 2rem;" src="/src/assets/share-solid-full.svg">{{articleComment.parentCommentId}}</div> -->
          </div>

          <!-- <div class="article-comment-context-item-main">{{articleComment.commentContent}}</div> -->
          <div v-html="articleComment.commentContent" class="article-comment-context-item-main"></div>
          <div class="article-comment-context-item-info">

            <div class="ararticle-comment-context-item-info-metrics">
              <div class="ararticle-comment-context-item-info-metrics-likesCount"><img
                  @click="handleLikes(articleComment.commentId)"
                  style="cursor: pointer; position: relative;top:0.45rem;width: 1.5rem; height: 1.5rem;"
                  src="/src/assets/heart-solid-full.svg">{{ articleComment.likesCount }}</div>

              <!-- <div class="ararticle-comment-context-item-info-metrics-replysCount"><img style=" cursor: pointer;position: relative;top:0.45rem;width: 1.5rem; height: 1.5rem;" src="/src/assets/reply-solid-full.svg">{{articleComment.replysCount}}</div> -->

              <div class="ararticle-comment-context-item-info-metrics-createAt"><img
                  style="position: relative;top:0.45rem;width: 1.5rem; height: 1.5rem;"
                  src="/src/assets/calendar-days-solid-full.svg">{{ articleComment.createAt }}</div>
              <div class="ararticle-comment-context-item-info-metrics-updateAt"><img
                  style="position: relative;top:0.45rem;width: 1.5rem; height: 1.5rem;"
                  src="/src/assets/pen-solid-full.svg">{{ articleComment.updateAt }}</div>
              <div class="ararticle-comment-context-item-info-metrics-reply"><el-button
                  @click="handleOpenReplyModal(articleComment)" type="primary"><img
                    style=" cursor: pointer;position: relative;right:0.5rem;width: 1.5rem; height: 1.5rem;"
                    src="/src/assets/reply-solid-full.svg">回覆</el-button></div>
              <!-- <div class="ararticle-comment-context-item-info-metrics-reply"><el-button v-click="handleReplyComment(articleComment.articleId,articleComment.commentId)" type="primary">回覆</el-button></div> -->

            </div>

          </div>
        </div>

      </div>

    </div>

    <reply-modal @close="handleCloseReplyCommentModal()" v-if="replyCommentModalVisible" :modalVisible="replyCommentModalVisible" @submit="handleReplyComment">
      <template v-slot:reply-comment-header>
        <!-- 評論功能：智能回覆提示區 -->
        <!-- <div v-if="props.model == 'replyComment' ? true : false" class="reply-header"> -->
        <div class="reply-header">
          <div class="reply-info">
            <span class="reply-text">正在回覆</span>
            <!-- <span class="reply-username">1111</span> -->
            <span class="reply-username">{{ currentReplyUser.username }}</span>
          </div>
          <div class="original-comment">

            {{ truncateText(currentReplyUser.commentContent, 50) }}
          </div>
          <button class="close-btn" @click="handleCancel">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </template>
    </reply-modal>

    <reply-modal @close="handleCloseEditArticleModal" v-if="createArticleModalVisible" @submit="handleEditArticle"
      :modalVisible="createArticleModalVisible" :content="Article.content">

      <template #article-editor-header>
        <!-- 新增文章功能：Header(標題、分類、標籤設置)-->
        <div class="create-article-header">
          <div class="create-article-info">
            <div class="create-article-title">
              <span class="create-article-title-text">標題</span>
              <el-input class="create-article-title-input" type="text" placeholder="輸入標題..."
                v-model="inputTitle"></el-input>

              <!-- <el-input class="create-article-title-input" type="text" :placeholder="`輸入標題... (文章ID: ${replyToUser.articleId})`" v-model="inputTitle"></el-input> -->

            </div>

            <div class="create-article-meta">
              <div class="create-article-category">
                <span class="create-article-title-text">分類</span>
                <el-tree-select v-model="selectCategoryId" :data="treeCategory" @change="handleCategoryChange"
                  :render-after-expand="false"
                  style="max-width: 20vh;min-width: 20vh;margin: 2% 2% 2% 0.2%;padding-top: 1%;" value-key="id" />
              </div>
              <div class="create-article-tag">
                <span class="create-article-title-text">標籤</span>
                <el-tree-select v-model="selectTagsValue" :data="tagsSelectData" :props="treeProps" multiple
                  @change="handleTagsChange" :render-after-expand="false" style="max-width: 20vh;min-width: 20vh;"
                  value-key="id" />
              </div>
            </div>


          </div>
        </div>
      </template>

    </reply-modal>

    <!-- 編輯文章彈出框 -->
    <!-- <ReplyModal :visible="createArticleModalVisible" model="editArticle" :replyToUser="currentReplyUser"
      @close="handleCloseEditArticleModal" @handleEditArticle="handleEditArticle" /> -->
    <!-- 回覆評論彈出框 -->
    <!-- <ReplyModal :visible="replyModalVisible" model="replyComment" :replyToUser="currentReplyUser"
      @close="handleCloseReplyModal" @submit="handleSubmitReply" /> -->
  </section>

  <EmptyOrError v-else />
</template>


<script setup lang="ts">
import HomeHeaderNavigation from "./HomeHeaderNavigation.vue";
import ReplyModal from "./ReplyModal.vue";
import { ElMessageBox } from "element-plus";
import http from '@/utils/httpRequest'
import { ArticleInter, Articles } from "@/interface/front/articleInterface";
import { nextTick, watch, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElAnchor, ElMessage } from "element-plus";
import { R } from "@/interface/R";
import { debounce } from 'throttle-debounce';
import { commentDataInterface } from "@/interface/commentDataInterface";
import { getCookieValue } from "@/utils/jwtUtils";
import { replyCommentDataInterface } from "@/interface/replyCommentDataInterface.ts";

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-tw' // 引入繁體中文語系
dayjs.extend(relativeTime)
dayjs.locale('zh-tw') // 設定預設語系為繁體中文

// Methods
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const Article = ref<ArticleInter | null>(null);
const ArticleContent = ref('')

const router = useRouter()
const route = useRoute()
const { articleId } = Array.isArray(route.params) ? route.params[0] : route.params
const commentId = ref()
const artComments = ref();

// 回覆模態框相關狀態
const replyCommentModalVisible = ref(false);
// const currentReplyUser = ref({
//   username: '',
//   commentContent: '',
//   commentId: '',
//   articleId: ''
// });

const currentReplyUser = ref(null);



/**
 * 評論點讚
 */
const handleLikes = function (commentId: string) {
  console.log("commentId:", commentId)
  http({
    url: http.adornUrl(`/article/${articleId}/comments/${commentId}/likes`),
    method: 'post'
  }).then(({ data }: { data: R }) => {
    if (data.code == "200") {
      //將取得讚數賦值給 renderedComments 中的 likesCount
      renderedComments.value.find(item => item.commentId == commentId).likesCount = data.data;
      ElMessage.success("成功訊息");
    } else {
      ElMessage.error("錯誤訊息");
    }
  }).catch(() => {
    ElMessage.error("請求出錯，請稍後再試");
  });

}
/**
 * 展示評論
 */
import DOMPurify from 'dompurify';
import { marked } from "marked";
import { AmsArtTagListInterface } from "@/interface/amsArtTagInterface";


const renderedComments = ref([])

watch(artComments, async (newArtComments) => {
  console.log("newArtComments:", newArtComments);
  if (!newArtComments || newArtComments.length === 0) {
    renderedComments.value = [];
    return;
  }

  const processedList = await Promise.all(
    newArtComments.map(async (item) => {
      const rawHTML = await marked.parse(item.commentContent || '');
      const sanitizedHtml = DOMPurify.sanitize(rawHTML);
      return { ...item, commentContent: sanitizedHtml };
    })
  );

  // const processedList = await Promise.all(
  //   newArtComments.map(async (item) => {

  //     const rawHTML = await DOMPurify.sanitize(item.commentContent);
  //     const sanitizedHtml =  marked.parse( rawHTML|| '');
  //     return { ...item, commentContent: sanitizedHtml };
  //   })
  // );

  // 將處理完的結果賦值給 renderedComments
  renderedComments.value = processedList;
  console.log("renderedComments.value:", renderedComments.value)
}, { deep: true }); // 加上 deep: true 來監聽物件陣列內部的變化




// watch(artComments,async(newArtComments)=>{
//   console.log("newArtComments:",newArtComments)
//   if(!newArtComments || newArtComments.length==0){
//     renderedComments.value=[]
//     return;
//   }
//   const processedList = await Promise.all(
//     newArtComments.map(async (item) => {
//       const rawHTML=await marked.parse(item.commentContent || '');
//       const sanitizedHtml=DOMPurify.sanitize(rawHTML)
//       return {...item,commentContent:sanitizedHtml}

//     })

// );

// const renderedMarkdown =computed(() => {


//     artComments.value =artComments.value.forEach((item,index)=>{
//         const rawHTML=item.commentContent=marked.parse(item.commentContent)
//         const sanitizedHtml=item.commentContent = DOMPurify.sanitize(rawHTML)
//     }
// )

/**
 * 回覆評論
 */

const dialogVisible = ref(false);
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}


// const parentCommentId = ref<string>('')


const createArticleModalVisible = ref(false);
// 開啟編輯文章模態框
const handleOpenEditArticleModal = () => {
  console.log("handleOpenEditArticleModal:Article.value:", Article.value)

  inputTitle.value = Article.value.title
  selectCategoryId.value = String(Article.value.categoryId)
  selectTagsValue.value = Article.value.amsArtTagsVoList.map((articleTag: any) => {
    return articleTag.id
  })
  


// console.log("handleOpenEditArticleModal:Article.value.amsArtTagVoList:", Article.value.amsArtTagVoList)
// const artTagsIdList = Article.value.amsArtTagsVoList.map(articleTag => {
//   return articleTag.id
// })
// console.log("handleOpenEditArticleModal:artTagsIdList:", artTagsIdList)
// currentReplyUser.value = {
//   title: Article.value.title,
//   categoryId: String(Article.value.categoryId),
//   content: Article.value.content,
//   tagsId: artTagsIdList,

// } as editArticleInterface;

// currentReplyUser.value = {
//   title: Article.value.title,
//   articleId: Article.value.id,
//   categoryId: Article.value.categoryId,
//   commentContent: Article.value.content,
//   amsArtTagsVoList: Article.value.amsArtTagsVoList,

// };
console.log("handleOpenEditArticleModal:currentReplyUser.value:", currentReplyUser.value)
createArticleModalVisible.value = true;
}

// 關閉編輯文章模態框
const handleCloseEditArticleModal = () => {
  currentReplyUser.value = {
    username: '',
    commentContent: '',
    commentId: '',
    articleId: ''
  };
  createArticleModalVisible.value = false;

};



// 開啟評論回覆模態框
const handleOpenReplyModal = (comment: any) => {
  console.log("handleOpenReplyModal:comment:", comment)

  // parentCommentId.value = comment.commentId

  currentReplyUser.value = {
    username: comment.username,
    commentContent: comment.commentContent,
    commentId: comment.commentId,
    articleId: articleId as string
  };
  replyCommentModalVisible.value = true;

};

// 關閉評論回覆模態框
const handleCloseReplyCommentModal = () => {
  console.log("觸發handleCloseReplyModal")
  replyCommentModalVisible.value = false;
  currentReplyUser.value = {
    username: '',
    commentContent: '',
    commentId: '',
    articleId: ''
  };
};

//提交評論回覆
const handleReplyComment = function (content: string) {
  // console.log("articleId:",articleId)
  console.log("handleReplyComment:content:", content)
  console.log("handleReplyComment:currentReplyUser:", currentReplyUser.value)
  console.log("handleReplyComment:articleId:", articleId)

  const replyCommentData: replyCommentDataInterface = {
    parentCommentId: currentReplyUser.value.commentId,
    commentContent: content
  }
  console.log("handleReplyComment:replyCommentData:",replyCommentData)
  http({
    url: http.adornUrl(`/article/${articleId}/comments`),
    method: 'post',
    data: http.adornData(replyCommentData, false)
  }).then(({ data }: { data: R}) => {
    if (data.code == "200") {

      ElMessage.success("成功訊息");
    } else {
      ElMessage.error("錯誤訊息");
    }
  }).catch(() => {
    ElMessage.error("請求出錯，請稍後再試");
  });

}
// 提交回覆
// const handleSubmitReply = async (content: string, replyData: any) => {
//   console.log("handleSubmitReply:replyData:", replyData)
//   try {
//     const response = await http({
//       url: http.adornUrl('/article/comment/create'),
//       method: 'post',
//       data: http.adornData({
//         commentContent: content,
//         parentCommentId: replyData.commentId,
//         articleId: replyData.articleId
//       }, false)
//     });

//     if (response.data.code === "200") {
//       ElMessage.success("回覆發送成功！");
//       handleCloseReplyCommentModal();
//       // 重新加載評論
//       getArtComments();
//     } else {
//       ElMessage.error("回覆發送失敗：" + response.data.msg);
//     }
//   } catch (error) {
//     ElMessage.error("網路錯誤，請稍後再試");
//     console.error('發送回覆時出錯:', error);
//   }
// };

console.log("初始 replyModalVisible:", replyCommentModalVisible.value);
console.log("初始 createArticleModalVisible:", createArticleModalVisible.value);

watch([replyCommentModalVisible, createArticleModalVisible], ([reply, create]) => {
  console.log("模態框狀態變化 - reply:", reply, "create:", create);
  console.trace(); // 顯示調用堆棧
});


/**
 * 遷移
 */
/*
* 新增文章
*/
/**
 * 文章標籤
 */

const selectTagsValue = ref()

interface tagsSelectData {
  name: string,
  id: string,
}

const tagsSelectData = ref<tagsSelectData[]>()

// tagsSelectData.value=[
//   {
//     name: "標籤1",
//     id: "1",
//   },
//   {
//     name: "標籤2",
//     id: "2",
//   },
// ]

const treeProps = {
  label: 'name', // 指定用數據中的 'name' 屬性作為顯示的標籤
  value: 'id',   // 指定用數據中的 'id' 屬性作為選項的值
}

import { useTreeCategoryStore } from "@/pinia/useTreeCategoryStore"

/**
 * 獲取分類資訊
 */
const treeCategory = useTreeCategoryStore().getTreeData;



const handleCategoryChange = function (value: string) {
  //得到樹形選擇器中該分類的ID
  selectCategoryId.value = value
  console.log("handleChange.value", value)
}

onMounted(() => {

  /**
   * 獲取標籤資訊
   */
  http({
    url: http.adornUrl('/article/tags/list'),
    method: 'get',
  }).then(({ data }: { data: R }) => {
    console.log("data", data)
    if (data.code == "200") {
      tagsSelectData.value = data.data
      console.log("tagsSelectData:", tagsSelectData.value)
      ElMessage.success("文章標籤獲取成功")
    } else {
      ElMessage.error("文章標籤獲取失敗")
    }
  });
})
const handleTagsChange = function (value: number) {

  selectTagsValue.value = value
  console.log("handleTagsChange.value", value)

}

/**
 * watch編輯文章內容
 */

/**
 * 已被被handleOpenEditArticleModal取代
 */

// watch(() => createArticleModalVisible.value, (newValue) => {
//   if (newValue) {
//     console.log("編輯模式，載入文章資料:", currentReplyUser.value.replyToUser);
//     console.log("編輯模式，載入文章資料amsArtTagsVoList:", currentReplyUser.value.amsArtTagsVoList);
//     // 載入文章資料到表單
//     inputTitle.value = currentReplyUser.value.title || '';
//     // content.value = currentReplyUser.value.commentContent || '';
//     selectCategoryId.value = currentReplyUser.value.categoryId || '';

//     // 處理標籤資料
//     if (currentReplyUser.value.replyToUser.amsArtTagsVoList) {
//       selectTagsValue.value = currentReplyUser.value.amsArtTagsVoList.map(
//         (item: any) => item.id
//       );
//     }

//     console.log("載入完成 - 標題:", inputTitle.value);
//     console.log("載入完成 - 分類:", selectCategoryId.value);
//     console.log("載入完成 - 標籤:", selectTagsValue.value);
//   }
// });

/**
 * 編輯文章
 */

const inputTitle = ref<string>('')
const selectCategoryId = ref<string>()


import editArticleInterface from "@/interface/editorArticleInterface";
import { ITEM_RENDER_EVT } from "element-plus/es/components/virtual-list/src/defaults";

const handleEditArticle = async function (newContent: string) {
  //補上文章 ID
  // editArticleData.articleId=articleId
  console.log("handleEditArticle:editArticleData:articleId:", articleId)
  console.log("handleEditArticle:editArticleData:inputTitle.value:", inputTitle.value)
  console.log("handleEditArticle:editArticleData:newContent:", newContent)
  console.log("handleEditArticle:editArticleData:selectCategoryId.value:", selectCategoryId.value)
  console.log("handleEditArticle:editArticleData:selectTagsValue.value:", selectTagsValue.value)

  const updateArticle = ref<editArticleInterface>({
    title: inputTitle.value,
    content: newContent,
    categoryId: selectCategoryId.value,
    tagsId: selectTagsValue.value,
  })

  console.log("handleEditArticle:updateArticle.value:", updateArticle.value)

  const { data } = await http({
    url: http.adornUrl(`/article/update/${articleId}`),
    method: 'put',
    data: http.adornData(updateArticle.value, false)
  })

  if (data.code == "200") {
    console.log("handleEditArticle:data.data", data.data)
    ElMessage.success("編輯成功")
  } else {
    ElMessage.error("編輯失敗")
  }

}

// const handleEditArticle = async function (articleId: string, editArticleData: editArticleInterface) {
//   //補上文章 ID
//   // editArticleData.articleId=articleId
//   console.log("handleEditArticle:editArticleData:", editArticleData)


//   const updateArticle = ref<editArticleInterface>({

//     title: editArticleData.title,
//     content: editArticleData.content,
//     categoryId: editArticleData.categoryId,
//     tagsId: editArticleData.tagsId,
//   })

//   console.log("handleEditArticle:updateArticle.value:", updateArticle.value)

//   const { data } = await http({
//     url: http.adornUrl(`/article/update/${articleId}`),
//     method: 'put',
//     data: http.adornData(updateArticle.value, false)
//   })

//   if (data.code == "200") {
//     console.log("handleEditArticle:data.data", data.data)
//     ElMessage.success("編輯成功")
//   } else {
//     ElMessage.error("編輯失敗")
//   }

// }

//評論

const textarea1 = ref()


// const handleCommitComment=function (){
//   const artInfo={
//     comment:textarea1.value,
//     userId: 1111,
//     articleId:articleId,
//   }
//   http({
//     url: http.adornUrl('/article/artInfo'),
//     method: 'post',
//     data: http.adornData(artInfo, false)
//   }).then(({data}:{data:any}) => {
//     if (data.code == "200") {
//       ElMessage.success("成功發送評論");
//     } else {
//       ElMessage.error("提交評論失敗");
//     }
//   });
// }

///TODO 登入才能評論
// const handleCommitComment = function () {

//   const acId = Array.isArray(articleId) ? articleId[0] : articleId

//   // const jwtToken:string|null=getCookieValue("jwtToken");


//   // console.log("jwtToken:",{jwtToken})
//   // console.log("cookie:",{cookie})
//   const commentData: commentDataInterface = {
//     commentContent: textarea1.value,
//     // userId: 1111.,
//     articleId: acId,
//     // jwtToken:jwtToken
//   }
//   http({
//     url: http.adornUrl('/article/comment/create'),
//     method: 'post',
//     data: http.adornData(commentData, false)
//   }).then(({ data }: { data: any }) => {
//     if (data.code == "200") {
//       ElMessage.success("成功發送評論");
//     } else {
//       ElMessage.error("提交評論失敗");
//     }
//   });
// }

//評論/

//獲得article-content的高度

// const articleContentRef = ref<HTMLElement | null>(null)
// let articleContentRefObserver: ResizeObserver

// onMounted(() => {
// debounce(5000,()=>{
//   if (!articleContentRef.value) return
//   articleContentRefObserver = new ResizeObserver(entries => {
//     for (let entry of entries) {
//       const articleContentHeight = entry.contentRect.height
//       console.log("articleContentHeight:", articleContentHeight)
//
//       if (articleContentHeight > 0 && articleContentListRef.value) {
//         articleContentListRef.value.style.height = `${articleContentHeight + 150}px`
//       }
//     }
//   })
//
//   articleContentRefObserver.observe(articleContentRef.value)
// })

// })

// onUnmounted(() => {
//   if (articleContentRefObserver) {
//     articleContentRefObserver.disconnect()
//   }
// })

// const articleContentRef = ref<HTMLElement | null>(null)
// let articleContentObserver: MutationObserver
// onMounted(() => {
//
//   articleContentObserver = new MutationObserver((mutations) => {
//     const articleContentHeight = articleContentRef.value?.offsetHeight;
//     console.log("articleContentRef", articleContentRef.value);
//
//
//     console.log("articleContentHeight:", articleContentHeight);
//     if (articleContentHeight && articleContentHeight > 0) {
//       if (articleContentHeight && articleContentListRef.value) {
//         articleContentListRef.value.style.height = `${articleContentHeight + 150}px`;
//       }
//       // articleContentObserver.disconnect(); // 停止觀察
//     }
//   });
//
//   if (articleContentRef.value) {
//     articleContentObserver.observe(articleContentRef.value, {
//       childList: true,
//       subtree: true,
//       characterData: true,
//       attributes: true // 增加對屬性變化的監控
//     });
//   }
// })
// onUnmounted(() => {
//   articleContentObserver.disconnect()
// })

//獲得article-content的高度/


//控制右方導航列類似sticky功能

const scrollContainer = ref<HTMLElement | null>(null);
const anchorRef = ref<InstanceType<typeof ElAnchor> | null>(null);


const handleScroll = () => {
  const currentScrollDistance = scrollContainer.value?.scrollTop || 0;
  console.log("目前滾動距離:", currentScrollDistance + "px")
  const threshold: number = 250;

  if (anchorRef.value) {
    if (currentScrollDistance > threshold) {  // 若超越臨界點
      console.log("超越臨界點...")
      if (anchorRef.value) {
        anchorRef.value.$el.style.position = 'fixed';
        anchorRef.value.$el.style.left = '81.4%';
        anchorRef.value.$el.style.top = initialStyles.top;
        // anchorRef.value.$el.style.width = '15.5%';
        anchorRef.value.$el.style.width = initialStyles.width;
      }

    } else {  // 回到臨界點時復原
      if (anchorRef.value) {
        anchorRef.value.$el.style.position = initialStyles.position;
        anchorRef.value.$el.style.left = initialStyles.left;
        anchorRef.value.$el.style.top = initialStyles.top;
        anchorRef.value.$el.style.width = initialStyles.width;
        anchorRef.value.$el.style.height = initialStyles.height;
      }

    }
  }
}

// 在組件掛載後保存 Box4 的初始樣式
let anchorObserver: MutationObserver;

let initialStyles = {
  position: '',
  left: '',
  top: '',
  width: '',
  height: ''
};

onMounted(() => {
  nextTick(() => {
    if (anchorRef.value) {
      console.log('Successfully obtained anchorRef', anchorRef.value.$el.style);
      anchorObserver = new MutationObserver(() => {
        if (anchorRef.value) {
          const computedStyles = window.getComputedStyle(anchorRef.value.$el); // Fetch the computed styles
          initialStyles = {
            position: computedStyles.position,
            left: computedStyles.left,
            top: computedStyles.top,
            width: computedStyles.width,
            height: computedStyles.height
          };
          console.log("原anchorRef(右方導航列)初始樣式", initialStyles)

          if (scrollContainer.value) {//開啟滾動條監聽
            scrollContainer.value.addEventListener('scroll', handleScroll);
          }

          if (initialStyles) {
            anchorObserver.disconnect();
          }
        }
      });

      anchorObserver.observe(anchorRef.value.$el, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    } else {
      console.error('Failed to retrieve anchorRef');
    }
  });


});
onUnmounted(() => {
  anchorObserver.disconnect()
})

onUnmounted(() => {// 在組件卸載後移除滾動事件監聽器
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll);
  }
});

//控制右方導航列類似sticky功能/


// 獲得HTMLElement ref高度與寬度
// const elementRef=ref<HTMLElement | null>(null);
// const width =ref(0);
// const height =ref(0);
// const updateSize =()=>{
//     setTimeout(()=>{
//       if(elementRef.value) {
//       console.log("elementRef:",elementRef)
//       console.log("className:",elementRef.value.className)
//
//       width.value = elementRef.value.clientWidth
//       height.value = elementRef.value.clientHeight
//       console.log("目標寬度:", width.value)
//       console.log("目標高度:", height.value)
//       }
//     },1000)
// }

//設定article-content-list的margin-top為HomeHeaderNavigation組件的高度
// 獲得VUE組件的 ref高度與寬度
// const headerRef = ref<InstanceType<typeof HomeHeaderNavigation> | null>(null);
// const HeaderWidth = ref(0);
// const HeaderHeight = ref(0);
// const updateHeaderSize = () => {
//   if (headerRef.value) {
//     // console.log("headerRef.value.$el:", headerRef.value.$el)
//     HeaderWidth.value = headerRef.value.$el.offsetWidth
//     HeaderHeight.value = headerRef.value.$el.offsetHeight
//     // console.log("Header width:", HeaderWidth.value);
//     // console.log("Header height:", HeaderHeight.value);
//   }
// }
// // 獲得VUE組件的 ref高度與寬度/
//
// let resizeObserver: ResizeObserver | null = null;
// onMounted(() => {
//   // 初始更新尺寸
//   updateHeaderSize();
//   // updateArticleContentList();
//   // 设置 ResizeObserver
//   if (headerRef.value && headerRef.value.$el) {
//     resizeObserver = new ResizeObserver(() => {
//       updateHeaderSize();
//       // updateArticleContentList();
//     });
//     resizeObserver.observe(headerRef.value.$el);//監視headerRef的值,若發生變化則觸發callback中的回調函數
//   }
// });
//
// onUnmounted(() => {
//   // 清理 ResizeObserver
//   if (resizeObserver) {
//     resizeObserver.disconnect();
//   }
// });
//
//
// const articleContentListRef = ref<InstanceType<typeof HTMLElement>>()
//
// const updateArticleContentList = function () {
//   console.log("articleContentListRef:", articleContentListRef)
//   if (articleContentListRef.value) {
//     // articleContentListRef.value.style.marginTop='50px'
//     const marginTop: string = HeaderHeight.value * 2.9 + ""
//     articleContentListRef.value.style.marginTop = marginTop + "px"
//     console.log("成功設置article-content-list的margin-top為:", marginTop)
//   }
// }
//設定article-content-list的margin-top為HomeHeaderNavigation組件的高度/


//使用後端JSON
// onMounted(()=>{
//   http({
//     url: http.adornUrl(`/article/get/${articleId}`),
//     method: 'get',
//     params: http.adornParams({})
//   }).then(({data}) => {
//     // alert("請求完畢")
//     console.log("data:",data)
//     const lastData=JSON.parse(data.data)
// console.log("lastData:",lastData);
//     if(data.code==200){//若請求成功
//       Article.value=lastData
//       if(Article.value!=null){
//         ArticleContent.value = Article.value.content
//       }
//
//       // console.log("ArticleContent.value:",ArticleContent.value)
//     }else {
//       //elementPlus的Message消息提示組件
//       ElMessage.error("獲取文章資料失敗")
//     }
//   })
// })

//後端使用泛型
// onMounted(() => {
//   http({
//     url: http.adornUrl(`/article/articles/${articleId}`),
//     method: 'get',
//     params: http.adornParams({})
//   }).then(({data}: { data: R }) => {
//     console.log("data:", data);
//     if (data.code == "200") {
//       Article.value = data.data;
//       if (Article.value != null) {
//         ArticleContent.value = Article.value.content;
//         console.log("ArticleContent.value:", ArticleContent.value);

//         const parser = new DOMParser();
//         const doc = parser.parseFromString(ArticleContent.value, 'text/html');
//         console.log("doc:", doc);
//         // 1. 使用正確的選擇器
//         const anchors = doc.querySelectorAll('a[id]:empty');
//         console.log("anchors:", anchors);
//         // 2. 遍歷查詢結果
//         anchors.forEach(anchor => {
//           const id = anchor.id;
//           let title = '';

//           // 3. 使用正確的標題提取邏輯
//           const nextNode = anchor.nextSibling;
//           if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
//             title = nextNode.textContent.trim();
//           }

//           // 4. 確保 id 和 title 都有效
//           if (id && title) {
//             articleAnchorData.value.push({ id, title });
//           }
//         });


//         console.log("articleAnchorData.value:", articleAnchorData.value);
//       }
//     }
//   });

// });

const getArticle = (async () => {

  try {
    const { data } = await http({
      url: http.adornUrl(`/article/articles/${articleId}`),
      method: 'get',
      params: http.adornParams({})
    }) as { data: R };

    console.log("data:", data);

    if (data.code == "200" && data.data) {
      // Article.value = data.data;
      // ArticleContent.value = Article.value.content;
      // console.log("ArticleContent.value:", ArticleContent.value);
      return data;
    }
  } catch (error) {
    console.error("獲取文章資料失敗:", error);
  }
})


const getArtComments = async function () {
  try {
    const { data } = await http({
      url: http.adornUrl(`/article/${articleId}/comments`),
      method: 'get',
    }) as { data: R }

    if (data.code == "200") {
      // artComments.value=data.data

      // console.log("文章留言區artComments.value:",artComments.value)
      // ElMessage.success("成功加載文章留言區");
      return data;
    } else {
      ElMessage.error("加載文章留言區失敗");
    }
  } catch (error) {
    console.error("獲取文章留言區失敗:", error);
  }


  ;
}
const loading = ref(true);

//加載文章以及留言
onMounted(async () => {
  const [articleResult, commentsResult] = await Promise.allSettled([getArticle(), getArtComments()]);
  console.log("artComments:", artComments)
  console.log("commentsResult:", commentsResult)

  //檢查文章是否載入成功(必須成功)
  if (articleResult.status === 'rejected') {

    ElMessage.error("獲取文章資料失敗")
    return;
  }
  //評論加載失敗也無訪
  const article = articleResult.value.data;
  // Article.value = article.article.value;

  const comments = commentsResult.status === 'fulfilled' ? commentsResult.value.data : [];
  Article.value = article;
  ArticleContent.value = article.content;
  artComments.value = comments;
  loading.value = false;
  console.log("初始化加載article:", article)
  console.log("初始化加載comments:", comments)

})





//右方導航列錨點
interface AnchorItem {
  id: string;
  title: string;
}

const articleAnchorData = ref<AnchorItem[]>([]);

const handleChange = (href: string) => {
  console.log(`anchor change: ${href}`)
}
//右方導航列錨點/


// 文章點讚相關狀態
// const articleLikesCount = ref(0);
const isLiked = ref(false);
const isBooksMarked = ref(false);
/**
 * 文章點讚處理函數
 */
const handleArticleLike = function () {
  console.log("articleId:", articleId);

  http({
    url: http.adornUrl(`/article/articles/${articleId}/like`),
    method: 'get'
  }).then(({ data }: { data: R }) => {
    // console.log("handleArticleLike data:", data);
    if (data.code === "200") {
      // console.log("handleArticleLike更新點讚數前 Article.value:", Article.value);
      // 更新點讚數
      Article.value.likesCount = data.data;
      // console.log("handleArticleLike更新點讚數後 Article.value:", Article.value);

      // 標記為已點讚
      isLiked.value = true;
      ElMessage.success("點讚成功！");
    } else {
      ElMessage.error("點讚失敗：" + data.msg);
    }
  }).catch(() => {
    ElMessage.error("請求出錯，請稍後再試");
  });
};
</script>

<style scoped>
/**
* 新增文章或者編輯文章相關
*/
.create-article-header {
  padding: var(--padding-1)
}

.create-article-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;

}

.create-article-title-text {
  color: var(--text-tertiary);
  font-size: 20px;
  font-weight: 500;
}


.create-article-title-input {
  width: 90%;
}

.create-article-title {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.create-article-meta {
  display: flex;
  flex-direction: row;
  justify-content: start;
}

.create-article-category {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex: 1
}

.create-article-tag {
  display: flex;
  flex-direction: row;
  gap: 1rem;

  flex: 1
}


/* ==========================================
   Reply Header
   ========================================== */
.reply-header {
  padding: var(--space-5) var(--space-6) var(--space-4);
  background: var(--surface-primary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  border-bottom: 1px solid var(--border-default);
  position: relative;
}

.reply-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: var(--space-6);
  right: var(--space-6);
  height: 1px;
  background: var(--gradient-border-subtle);
}

.reply-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.reply-text {
  color: var(--text-tertiary);
  font-size: 14px;
  font-weight: 500;
}

.reply-username {
  color: var(--primary-500);
  font-size: 14px;
  font-weight: 600;
  background: var(--primary-50);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.original-comment {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
  background: var(--surface-tertiary);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-500);
  border: 1px solid var(--border-subtle);
  border-left: 3px solid var(--primary-500);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.original-comment::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--primary-500), transparent);
}

.close-btn {
  position: absolute;
  top: var(--space-4);
  right: var(--space-5);
  background: none;
  border: 1px solid transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--text-primary);
  background: var(--surface-hover);
  border-color: var(--border-muted);
  transform: rotate(90deg);
  box-shadow: var(--shadow-sm);
}



.article-metrics {
  min-width: 100%;
  max-width: 100%;
  height: 100px;
  background-color: #88c847;
}

.ararticle-comment-context-item-info-metrics {
  display: flex;
  gap: 1rem;
  align-items: center;

  justify-content: end;
}

.user-avatar {
  display: block;
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
}

.user-username {
  text-align: left;

  flex: 1 1 0;
}

.article-comment-context-item-avatar {
  display: flex;

  flex: 1 1 0;
}

.article-comment-context-item-main {
  text-align: start;
  word-break: break-all;
  flex: 1 1 0;
}

.article-comment-context-item-info {
  text-align: end;
  flex: 1 1 0;
}

.article-comment-context-avatar {
  margin: 0 auto;
  padding: 1rem;
}

.article-comment-context-item {
  display: flex;
  gap: 2rem;
  flex-direction: column;

  flex-wrap: wrap;


  /* border: 0.1px solid rgb(190, 186, 186); */
  text-align: center;
  background-color: #1a1d1d;
  /* min-height: 150px;
  min-width: 1570px;
  max-width: 1570px; */
  margin: 0 auto;
  padding: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box
}

/* .article-comment-context{

  width: 100px;
  height: 100px;
  
} */
.article-comment-context {
  display: flex;
  flex-direction: row;
  /* gap: 20px; */
  background-color: #395c5c;
  /* min-width: 1570px;
  max-width: 1570px;
  width: 1570px; */
  width: 100%;
  border: 0.1px solid rgb(190, 186, 186);
  background-color: #1a1d1d;
}

.article-comment-button {
  background-color: #0d9393;
  min-width: 90%;
  max-width: 90%;
  display: flex;
  justify-content: end;
  align-items: center;
  /* 移除高度鎖定，讓內容自然撐開 */
  /* max-height: 18%; */
  /* min-height: 18%; */
}

.article-comment-input {
  background-color: #98710e;
  min-width: 90%;
  max-width: 90%;
  /* 移除高度鎖定，讓內容自然撐開 */
  /* max-height: 82%; */
  /* min-height: 82%; */
}

.article-comment {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: start;
  background-color: darkslateblue;
  min-width: 100%;
  max-width: 100%;
  /* 讓高度由內容撐開 */
  /* max-height: 80%; */
  /* min-height: 80%; */
}

.article-footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* footer 內容置中 */
  align-items: center;
  background-color: #213547;
  width: 90%;
  margin: 40px auto 0;
  /* 置中並與上方內容留距 */
  position: static;
  /* 確保參與正常文流，不覆蓋內容 */
  /* 移除 left 與高度限制 */
  /* left: 5%; */
  /* min-height: 55%; */

  /* gap: 6rem; */
}

.article-header {
  border: black 3px solid;
  max-width: 92%;
  min-width: 92%;
  margin: 50px 50px 0 50px;
  background-color: #88c847;
  box-shadow: 0px 0px 30px;
}

.article-header-title {

  background-color: #81156a;

}

.article-header-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.article-header-info-user {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  background-color: #03638f;

}

.article-header-info-time {

  /* display: flex; */
  /* flex-direction: row;
  justify-content: end;
  align-items: center; */
  background-color: #0c038f;

}

.article-header-info-right {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  gap: 1rem;
  background-color: #332f6b;
}

.article-title {
  border: black 3px solid;
  max-width: 92%;
  min-width: 92%;
  margin: 50px 50px 0 50px;
  background-color: #324222;
  box-shadow: 0px 0px 30px;
}

.article-content {
  border: black 3px solid;
  max-width: 92%;
  min-width: 92%;
  margin: 0 50px 50px 50px;
  background-color: #d7e6c8;
  box-shadow: 0px 0px 30px;
  max-height: none;
  /* 不裁切內容 */
  word-wrap: break-word;
  word-break: break-all;
}

.article-container {
  background-color: #d57656;
  width: 100%;
  /* 重要：不要限制高度或隱藏溢出，改由整個頁面滾動 */
  /* height: 100%; */
  overflow: visible;
  /* 不顯示容器自身滾軸 */
}

.Box3 {
  background-color: darkgreen;
  flex: 2.5;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  position: relative;
  /* 移除最小高度限制，避免內容被截斷 */
  /* min-height: 92%; */
}

.article-main {
  background-color: darkgrey;
  width: 100%;
  /* 讓內容自然撐開 */
  /* min-height: 92%; */
  max-height: none;
  display: flex;
  justify-content: center;
}

.article-content-list {
  display: flex;
  flex-direction: row;
  background-color: darkslategray;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: stretch;
  /* 讓左右欄高度跟隨中間欄 */
  width: 90%;
  margin: 0 auto;
  /* 置中 */
  /* 不鎖在視窗高度，讓高度由內容決定 */
  /* min-height: 92vh; */
  max-height: none;
}

.Box1 {
  background-color: darksalmon;
  flex: 0.5;
  /* 移除視窗高度鎖定 */
  /* height: 92vh; */
}

.Box2 {
  background-color: darkmagenta;
  flex: 0.5;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-content: start;
  /* 移除視窗高度鎖定 */
  /* height: 92vh; */
}

.Box4 {
  background-color: darkblue;
  width: 100%;
  height: min-content;
  position: relative;
  /* 若要吸頂可改為 sticky */
  top: 150px;
}

/**
* 點讚按鈕
*/
.article-metrics {
  min-width: 100%;
  max-width: 100%;
  height: 100px;
  background-color: #1a1d1d;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.metrics-container {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.metrics-button-wrapper {
  display: flex;
  align-items: center;
}

.like-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: #2c3e50;
  border: 2px solid #34495e;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  color: #ecf0f1;
}

.like-button:hover {
  background-color: #34495e;
  border-color: #e74c3c;
  transform: scale(1.05);
}

.like-button.liked {
  background-color: #e74c3c;
  border-color: #c0392b;
}

.like-button.liked:hover {
  background-color: #c0392b;
}

.like-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.3s ease;
}

.like-button:hover .like-icon {
  transform: scale(1.2);
}

.like-button.liked .like-icon {
  filter: brightness(1.2);
}

.like-count {
  font-weight: bold;
  min-width: 2rem;
  text-align: center;
}
</style>