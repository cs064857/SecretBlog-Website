<template>
  <div class="article-container">


    <HomeHeaderNavigation ref="headerRef"></HomeHeaderNavigation>


    <div ref="scrollContainer" class="article-main">

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

          <div ref="Box4Ref" class="Box4">
            <el-anchor :offset="70" @change="handleChange">

              <el-anchor-link v-for="item in articleAnchorData" :key="item.id" :href="'#'+item.id">
                {{item.title}}
              </el-anchor-link>

            </el-anchor>
          </div>

        </div>



      </div>

    </div>
  </div>
</template>

<style scoped>


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
  /*height: auto;*/

  /*重要*/
  max-height: none;
  /*max-height: 200%;*/
  /*overflow: visible;*/

  /*padding: 0 0 5% 0;*/

  /*position: absolute;*/
  /*top: 16%; !* Add this to position from the top of article-main *!*/
  /*left: 0; !* Add this to position from the left of article-main *!*/
  /*right: 0; !* Add this to stretch the width *!*/

  /* 自動換行的樣式 */
  word-wrap: break-word; /* 遇到長單詞自動換行 */
  word-break: break-all; /* 對於所有內容進行換行，防止超出容器 */
  /*overflow-wrap: break-word; !* 讓內容在需要時自動換行 *!*/


}

.article-container {
  background-color: darksalmon;
  width: 100%;
  height: 100%;

}

.Box3 {
  background-color: darkgreen;
  /*width: 50%;*/
  /*max-width: 80%;*/
  flex: 2.5;
  /*max-height: none;*/
  /*height: auto;*/
  /*overflow: visible;*/

  display: flex;
  flex-direction: column;
  /*gap: 5%;*/
  /*align-content: center;*/
  /*justify-content: flex-start;*/
  justify-items: flex-start;


  position: relative;
  min-height: 92%;


}

.article-main {
  background-color: darkgrey;
  width: 100%;
  min-height: 92%;
  max-height: none;

  display: flex;
  justify-content: center;
  /*align-items: center;*/
  /*overflow: auto;*/

  /*position: relative;*/
  overflow: visible;
}

.article-content-list {
  display: flex;
  flex-direction: row;
  background-color: darkslategray;
  justify-content: flex-start;
  align-content: flex-start;
  width: 90%;

  /*重要*/
  min-height: 100%;

  max-height: none;
  height: auto;
  /*height: auto;*/


  /*margin-top: 15%;*/


}


.Box1 {
  background-color: darksalmon;
  /*width: 100%;*/
  height: 92vh;
  flex: 0.5;
}

.Box2 {
  background-color: darkmagenta;
  /*width: 100%;*/
  height: 92vh;
  flex: 0.5;

  position: relative;
  display: flex;
  justify-content: flex-start;
  align-content: start;
}


.Box4 {
  background-color: darkblue;
  width: 100%;
  height: min-content;

  /*position: sticky;*/
  position: relative;
  top: 150px;
}

</style>

<script setup lang="ts">
import HomeHeaderNavigation from "./HomeHeaderNavigation.vue";

import http from '../utils/httpRequest'
import {ArticleInter, Articles} from "../interface/articleInterface.ts";
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {R} from "../interface/R.ts";

const Article = ref<ArticleInter | null>(null);
const ArticleContent = ref('')

const router = useRouter()
const route = useRoute()
const {articleId} = route.params


//獲得article-content的高度

const articleContentRef=ref<HTMLElement|null>(null)

onMounted(()=>{

  const observer = new MutationObserver((mutations) => {
    const articleContentHeight = articleContentRef.value?.offsetHeight;
    console.log("articleContentRef", articleContentRef.value);
    console.log("articleContentHeight:", articleContentHeight);
    if (articleContentHeight && articleContentHeight > 0) {
      if (articleContentHeight && articleContentListRef.value) {
        articleContentListRef.value.style.height = `${articleContentHeight}px`;
      }
      observer.disconnect(); // 停止觀察
    }
  });

  if (articleContentRef.value) {
    observer.observe(articleContentRef.value, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
})


//獲得article-content的高度/


//控制右方導航列類似sticky功能

const scrollContainer = ref<HTMLElement | null>(null);
const Box4Ref=ref<HTMLElement|null>(null)

let initialStyles = {
  position: '',
  left: '',
  top: '',
  width: '',
  height: ''
};

const handleScroll = () => {
  const currentScrollDistance = scrollContainer.value?.scrollTop || 0;
  const threshold: number = 150;

  if (Box4Ref.value) {
    if (currentScrollDistance > threshold) {  // 若超越臨界點
      console.log("超越臨界點...")
      Box4Ref.value.style.position = 'fixed';
      Box4Ref.value.style.left = '78.5%';
      // Box4Ref.value.style.left = '1507px';
      Box4Ref.value.style.top = '77px';
      Box4Ref.value.style.width = '15.5%';
      Box4Ref.value.style.height = '281.75px';
    } else {  // 回到臨界點時復原
      Box4Ref.value.style.position = initialStyles.position;
      Box4Ref.value.style.left = initialStyles.left;
      Box4Ref.value.style.top = initialStyles.top;
      Box4Ref.value.style.width = initialStyles.width;
      Box4Ref.value.style.height = initialStyles.height;
    }
  }
};


onMounted(() => {// 在組件掛載後保存 Box4 的初始樣式
  if (Box4Ref.value) {
    initialStyles = {
      position: Box4Ref.value.style.position,
      left: Box4Ref.value.style.left,
      top: Box4Ref.value.style.top,
      width: Box4Ref.value.style.width,
      height: Box4Ref.value.style.height
    };
  }

  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll);
  }
});


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
const headerRef = ref<InstanceType<typeof HomeHeaderNavigation> | null>(null);
const HeaderWidth = ref(0);
const HeaderHeight = ref(0);
const updateHeaderSize = () => {
  if (headerRef.value) {
    // console.log("headerRef.value.$el:", headerRef.value.$el)
    HeaderWidth.value = headerRef.value.$el.offsetWidth
    HeaderHeight.value = headerRef.value.$el.offsetHeight
    // console.log("Header width:", HeaderWidth.value);
    // console.log("Header height:", HeaderHeight.value);
  }
}
// 獲得VUE組件的 ref高度與寬度/

let resizeObserver: ResizeObserver | null = null;
onMounted(() => {
  // 初始更新尺寸
  updateHeaderSize();
  // updateArticleContentList();
  // 设置 ResizeObserver
  if (headerRef.value && headerRef.value.$el) {
    resizeObserver = new ResizeObserver(() => {
      updateHeaderSize();
      // updateArticleContentList();
    });
    resizeObserver.observe(headerRef.value.$el);//監視headerRef的值,若發生變化則觸發callback中的回調函數
  }
});

onUnmounted(() => {
  // 清理 ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});


const articleContentListRef = ref<InstanceType<typeof HTMLElement>>()

const updateArticleContentList = function () {
  console.log("articleContentListRef:", articleContentListRef)
  if (articleContentListRef.value) {
    // articleContentListRef.value.style.marginTop='50px'
    const marginTop: string = HeaderHeight.value * 2.9 + ""
    articleContentListRef.value.style.marginTop = marginTop + "px"
    console.log("成功設置article-content-list的margin-top為:", marginTop)
  }
}
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
        console.log("ArticleContent.value:",ArticleContent.value)
        //將文章錨點及該標題放入右側導航列中
          const anchorIdRegex = new RegExp(/id="([^"]*)"/g);
          // const anchorIdRegex = new RegExp(/id="(\w*)"/g);
          const anchorId = ArticleContent.value.matchAll(anchorIdRegex);
          const anchorTitleRegex = new RegExp(/<\/a>([^<]*)/g)
          const anchorTitle = ArticleContent.value.matchAll(anchorTitleRegex);
          if(anchorId && anchorTitle){
            let anchorIdIterator = anchorId.next();
            let anchorTitleIterator = anchorTitle.next();

            while ((!anchorIdIterator.done && !anchorTitleIterator.done)){
              const association = {id:anchorIdIterator.value[1],title:anchorTitleIterator.value[1]}
              articleAnchorData.value.push(association)
              anchorIdIterator= anchorId.next()
              anchorTitleIterator= anchorTitle.next();
            }

            console.log("anchorId",anchorId)
            console.log("anchorTitle",anchorTitle)
            console.log("articleAnchorData.value",articleAnchorData.value)
          }
        }
      console.log("Header height:", HeaderHeight.value);
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
