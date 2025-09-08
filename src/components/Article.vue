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



      
      <!-- <div class="article-comment">


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
      </div> -->
        
      <div class="article-footer">
        <div v-for="(articleComment,index) in artComments" :key="index" class="article-comment-context">

          <div class="article-comment-context-item">


              <div class="article-comment-context-item-user">{{articleComment.username}}</div>
              <div class="article-comment-context-item-main">{{articleComment.commentContent}}</div>
              <div class="article-comment-context-item-metrics">{{articleComment.replysCount}}</div>
          </div>
          
        </div>
        
      </div>

</template>

<style scoped>
.article-comment-context-item-user {
  text-align: left;
  
  flex: 1 1 0;
}
.article-comment-context-item-main{
  flex: 1 1 0;
}
.article-comment-context-item-metrics{
  flex: 1 1 0;
}

.article-comment-context-item{
  display: flex;
  flex-direction: column;

  flex-wrap: wrap;


  border: 0.1px solid rgb(190, 186, 186);
  text-align: center;
  background-color: #1a1d1d;
  min-height: 150px;
  min-width: 1570px;
  max-width: 1570px;
  width: 1570px;
}
/* .article-comment-context{

  width: 100px;
  height: 100px;
  
} */
.article-comment-context{
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
  background-color: #395c5c;
  min-width: 1570px;
  max-width: 1570px;
  width: 1570px;
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
  justify-content: right;
  align-content: start;
  background-color: darkslateblue;
  min-width: 51.5%;
  max-width: 51.5%;
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

import http from '@/utils/httpRequest'
import {ArticleInter, Articles} from "@/interface/front/articleInterface";
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import {ElAnchor, ElMessage} from "element-plus";
import {R} from "@/interface/R";
import { debounce } from 'throttle-debounce';
import { commentDataInterface } from "@/interface/commentDataInterface";
import { getCookieValue } from "@/utils/jwtUtils";
const Article = ref<ArticleInter | null>(null);
const ArticleContent = ref('')

const router = useRouter()
const route = useRoute()
const {articleId} = route.params
const artComments = ref();
//加載留言
onMounted(()=>{

  getArtComments()
  console.log("artComments:",artComments)
})

const getArtComments=function(){

  http({
    url: http.adornUrl(`/article/${articleId}/comments`),
    method: 'get',
  }).then(({data}:{data:any}) => {
    if (data.code == 200) {
      artComments.value=data.data
      ElMessage.success("成功加載文章留言區");
    } else {
      ElMessage.error("加載文章留言區失敗");
    }
  });

}

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
  
  const jwtToken:string|null=getCookieValue("jwtToken");


  console.log("jwtToken:",{jwtToken})
  // console.log("cookie:",{cookie})
  const commentData:commentDataInterface={
    commentContent:textarea1.value,
    userId: 1111.,
    articleId:acId,
    jwtToken:jwtToken
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
