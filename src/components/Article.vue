<template>
  <div ref="scrollContainer" class="article-container">


    <HomeHeaderNavigation ref="headerRef"></HomeHeaderNavigation>


    <!-- <div class="article-main"> -->

      <div class="article-content-list" ref="articleContentListRef">
        <div class="Box1">
          1
        </div>

        <div class="Box3">


          <div class="article-header">
            <h1>{{ articleId }}</h1>
          </div>

          <div v-html="ArticleContent" class="article-content" ref="articleContentRef">

          </div>

        </div>

        <div class="Box2">

          <div class="Box4">
            <el-anchor ref="anchorRef" :offset="70" @change="handleChange">

              <el-anchor-link v-for="item in articleAnchorData" :key="item.id" :href="'#'+item.id">
                {{ item.title }}
              </el-anchor-link>

            </el-anchor>
          </div>

        </div>

      </div>

    </div>

      <div class="article-metrics">

      </div>

      
      <div class="article-comment">


        <div class="article-comment-input">
          <el-input
              v-model="textarea1"
              style="width: 100%;font-size: 18px"
              :rows="8"
              maxlength="480"
              resize="none"
              type="textarea"
              placeholder="輸入評論..."
          />
        </div>
        
        <div class="article-comment-button">
          <el-button @click="handleCommitComment" size="large" type="primary" round>發表評論</el-button>
        </div>
      </div>
        
      <div class="article-footer">
        <div v-for="(articleComment,index) in renderedComments" :key="index" class="article-comment-context">

          <div class="article-comment-context-avatar">
            <img class="user-avatar" :src="articleComment.avatar" alt="avatar">
          </div>

          <div class="article-comment-context-item">


              <div class="article-comment-context-item-avatar">
                
                <div class="user-username">{{articleComment.username}}</div>
                <div v-if="articleComment.parentCommentId" class="user-parentUsername"><img style="position: relative; top:0.5rem;  width: 3rem; height: 2rem;" src="/src/assets/share-solid-full.svg">{{articleComment.parentCommentId ? renderedComments.find(item=>item.commentId==articleComment.parentCommentId).username : ''}}</div>
                <!-- <div class="user-parentUsername"><img style="position: relative; top:0.5rem;  width: 3rem; height: 2rem;" src="/src/assets/share-solid-full.svg">{{renderedComments.find(item=>item.commentId==1968026366882635777).username}}</div> -->
                <!-- <div class="user-parentUsername"><img style="position: relative; top:0.5rem;  width: 3rem; height: 2rem;" src="/src/assets/share-solid-full.svg">{{articleComment.parentCommentId}}</div> -->
              </div>
              
              <!-- <div class="article-comment-context-item-main">{{articleComment.commentContent}}</div> -->
              <div v-html="articleComment.commentContent" class="article-comment-context-item-main"></div>
              <div class="article-comment-context-item-info">
                
                  <div class="ararticle-comment-context-item-info-metrics">
                    <div class="ararticle-comment-context-item-info-metrics-likesCount"><img @click="handleLikes(articleComment.commentId)" style="cursor: pointer; position: relative;top:0.45rem;width: 1.5rem; height: 1.5rem;" src="/src/assets/heart-solid-full.svg">{{articleComment.likesCount}}</div>
          
                    <!-- <div class="ararticle-comment-context-item-info-metrics-replysCount"><img style=" cursor: pointer;position: relative;top:0.45rem;width: 1.5rem; height: 1.5rem;" src="/src/assets/reply-solid-full.svg">{{articleComment.replysCount}}</div> -->
                    
                    <div class="ararticle-comment-context-item-info-metrics-createAt"><img style="position: relative;top:0.45rem;width: 1.5rem; height: 1.5rem;" src="/src/assets/calendar-days-solid-full.svg">{{articleComment.createAt}}</div>
                    <div class="ararticle-comment-context-item-info-metrics-updateAt"><img  style="position: relative;top:0.45rem;width: 1.5rem; height: 1.5rem;" src="/src/assets/pen-solid-full.svg">{{articleComment.updateAt}}</div>
                    <div class="ararticle-comment-context-item-info-metrics-reply"><el-button @click="handleOpenReplyModal(articleComment)" type="primary"><img style=" cursor: pointer;position: relative;right:0.5rem;width: 1.5rem; height: 1.5rem;" src="/src/assets/reply-solid-full.svg">回覆</el-button></div>
                    <!-- <div class="ararticle-comment-context-item-info-metrics-reply"><el-button v-click="handleReplyComment(articleComment.articleId,articleComment.commentId)" type="primary">回覆</el-button></div> -->

                  </div>

              </div>
          </div>

        </div>
        
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
.article-metrics{
  min-width: 100%;
  max-width:100%;
  height: 100px;
  background-color: #88c847;
}

.ararticle-comment-context-item-info-metrics{
  display: flex;
  gap: 1rem;
  align-items: center;

  justify-content: end;
}
.user-avatar{
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

.article-comment-context-item-avatar{
  display: flex;
  
  flex: 1 1 0;
}
.article-comment-context-item-main{
  text-align: start;
  word-break: break-all;
  flex: 1 1 0;
}
.article-comment-context-item-info{
  text-align: end;
  flex: 1 1 0;
}
.article-comment-context-avatar{
    margin: 0 auto;
    padding: 1rem;
}
.article-comment-context-item{
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
  box-sizing:border-box
}
/* .article-comment-context{

  width: 100px;
  height: 100px;
  
} */
.article-comment-context{
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
  justify-content: center;  /* footer 內容置中 */
  align-items: center;
  background-color: #213547;
  width: 90%;
  margin: 40px auto 0;      /* 置中並與上方內容留距 */
  position: static;         /* 確保參與正常文流，不覆蓋內容 */
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

.article-content {
  border: black 3px solid;
  max-width: 92%;
  min-width: 92%;
  margin: 0 50px 50px 50px;
  background-color: #d7e6c8;
  box-shadow: 0px 0px 30px;
  max-height: none;     /* 不裁切內容 */
  word-wrap: break-word;
  word-break: break-all;
}

.article-container {
  background-color: #d57656;
  width: 100%;
  /* 重要：不要限制高度或隱藏溢出，改由整個頁面滾動 */
  /* height: 100%; */
  overflow: visible;    /* 不顯示容器自身滾軸 */
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
  align-items: stretch;  /* 讓左右欄高度跟隨中間欄 */
  width: 90%;
  margin: 0 auto;       /* 置中 */
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
  position: relative;  /* 若要吸頂可改為 sticky */
  top: 150px;
}
</style>

<script setup lang="ts">
import HomeHeaderNavigation from "./HomeHeaderNavigation.vue";
import ReplyModal from "./ReplyModal.vue";
import { ElMessageBox } from "element-plus";
import http from '@/utils/httpRequest'
import {ArticleInter, Articles} from "@/interface/front/articleInterface";
import {nextTick,watch, onMounted, onUnmounted, ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import {ElAnchor, ElMessage} from "element-plus";
import {R} from "@/interface/R";
import { debounce } from 'throttle-debounce';
import { commentDataInterface } from "@/interface/commentDataInterface";
import { getCookieValue } from "@/utils/jwtUtils";
import {replyCommentDataInterface} from "@/interface/replyCommentDataInterface.ts";
const Article = ref<ArticleInter | null>(null);
const ArticleContent = ref('')

const router = useRouter()
const route = useRoute()
const {articleId} = Array.isArray(route.params) ? route.params[0] : route.params
const commentId =ref()
const artComments = ref();

// 回覆模態框相關狀態
const replyModalVisible = ref(false);
const currentReplyUser = ref({
  username: '',
  commentContent: '',
  commentId: '',
  articleId: ''
});




/**
 * 評論點讚
 */
const handleLikes=function(commentId: string) {
    console.log("commentId:", commentId)
  http({
      url: http.adornUrl(`/article/comment/${commentId}/like`),
      method: 'post'
  }).then(({data}:{data:R}) => {
      if (data.code == 200) {
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


const renderedComments=ref([])

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
  console.log("renderedComments.value:",renderedComments.value)
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



const handleReplyComment= function(parentCommentId:string){
  // console.log("articleId:",articleId)
  console.log("parentCommentId:",parentCommentId)
  
  const data:replyCommentDataInterface={
    parentCommentId:parentCommentId,
    commentContent:textarea1.value,
    articleId:articleId,
  }

  http({
      url: http.adornUrl('/article/comment/create'),
      method: 'post',
      data: http.adornData(data, false)
  }).then(({data}:{data:R}) => {
      if (data.code == 200) {

          ElMessage.success("成功訊息");
      } else {
          ElMessage.error("錯誤訊息");
      }
  }).catch(() => {
      ElMessage.error("請求出錯，請稍後再試");
  });

}

const getArtComments=function(){

  http({
    url: http.adornUrl(`/article/${articleId}/comments`),
    method: 'get',
  }).then(({data}:{data:any}) => {
    if (data.code == 200) {
      artComments.value=data.data
      console.log("文章留言區artComments.value:",artComments.value)
      ElMessage.success("成功加載文章留言區");
    } else {
      ElMessage.error("加載文章留言區失敗");
    }
  });

}

//加載留言
onMounted(()=>{
  
  getArtComments()
  console.log("artComments:",artComments)
})

// 開啟回覆模態框
const handleOpenReplyModal = (comment: any) => {
  currentReplyUser.value = {
    username: comment.username,
    commentContent: comment.commentContent,
    commentId: comment.commentId,
    articleId: articleId as string
  };
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
      getArtComments();
    } else {
      ElMessage.error("回覆發送失敗：" + response.data.msg);
    }
  } catch (error) {
    ElMessage.error("網路錯誤，請稍後再試");
    console.error('發送回覆時出錯:', error);
  }
};

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
//     if (data.code == 200) {
//       ElMessage.success("成功發送評論");
//     } else {
//       ElMessage.error("提交評論失敗");
//     }
//   });
// }

///TODO 登入才能評論
const handleCommitComment=function (){

  const acId= Array.isArray(articleId) ? articleId[0] : articleId
  
  // const jwtToken:string|null=getCookieValue("jwtToken");


  // console.log("jwtToken:",{jwtToken})
  // console.log("cookie:",{cookie})
  const commentData:commentDataInterface={
    commentContent:textarea1.value,
    // userId: 1111.,
    articleId:acId,
    // jwtToken:jwtToken
  }
  http({
    url: http.adornUrl('/article/comment/create'),
    method: 'post',
    data: http.adornData(commentData, false)
  }).then(({data}:{data:any}) => {
    if (data.code == 200) {
      ElMessage.success("成功發送評論");
    } else {
      ElMessage.error("提交評論失敗");
    }
  });
}

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
onMounted(() => {
  http({
    url: http.adornUrl(`/article/articles/${articleId}`),
    method: 'get',
    params: http.adornParams({})
  }).then(({data}: { data: R }) => {
    // alert("請求完畢")
    console.log("data:", data)
    if (data.code == 200) {//若請求成功
      Article.value = data.data
      if (Article.value != null) {
        ArticleContent.value = Article.value.content
        console.log("ArticleContent.value:", ArticleContent.value)
        //將文章錨點及該標題放入右側導航列中
        const anchorIdRegex = new RegExp(/a id="([^"]*)"/g);
        // const anchorIdRegex = new RegExp(/id="(\w*)"/g);
        const anchorId = ArticleContent.value.matchAll(anchorIdRegex);
        // const anchorTitleRegex = new RegExp(/<\/a>([^<]*)/g)
        const anchorTitleRegex = new RegExp(/"><\/a>([^<]*)/g)
        const anchorTitle = ArticleContent.value.matchAll(anchorTitleRegex);
        if (anchorId && anchorTitle) {
          let anchorIdIterator = anchorId.next();
          let anchorTitleIterator = anchorTitle.next();

          while ((!anchorIdIterator.done && !anchorTitleIterator.done)) {
            const association = {id: anchorIdIterator.value[1], title: anchorTitleIterator.value[1]}
            articleAnchorData.value.push(association)
            anchorIdIterator = anchorId.next()
            anchorTitleIterator = anchorTitle.next();
          }

          console.log("anchorId", anchorId)
          console.log("anchorTitle", anchorTitle)
          console.log("articleAnchorData.value", articleAnchorData.value)
        }
      }
      // console.log("Header height:", HeaderHeight.value);
    } else {
      //elementPlus的Message消息提示組件
      ElMessage.error("獲取文章資料失敗")
    }
  })
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
</script>
