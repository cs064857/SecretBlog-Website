<template>




    <HomeHeaderNavigation></HomeHeaderNavigation>




    <div class="home-categorys">
      <div class="home-category-list-container">

          <!-- 使用單一循環直接遍歷所有子分類 -->
          <div v-for="child in allChildren" :key="child.id" class="home-category-list-item">
            
            <div class="home-category-list-item-image">

            </div>
            <div class="home-category-list-item-title">
              <!-- <span>{{child.label}}</span> -->
              <a href="#" @click.prevent="handleCategoryRouterLink(child)">{{child.label}}</a>

            </div>

          </div>

      </div>
    </div>

    <!--    <div class="home-footer">home-footer</div>-->


</template>

<style scoped>


.home-category-list-item-image{
  width: 100%;
  height: 90%;
  background: rgba(29, 231, 3, 0.667);
}
.home-category-list-item-title{
  width: 100%;
  height: 10%;
  background: rgba(10, 10, 185, 0.667);
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid rgba(10, 10, 185, 0.667); */
}
.home-categorys{
  width: 100%;
  min-height: 91.5%;
  background-color: #B7F7F7;
  display: flex;
  justify-content: center;
  
}

.home-category-list-container{
  width: 60%;
  min-height: 100%; /* 設置最小高度 */
  height: auto; /* 讓高度自適應內容 */
  background-color: #AAD7F7;
  /* display: flex; */
  /* flex-direction: column; */

  display: grid;
  grid-template-columns:1fr 1fr;
  grid-template-rows: 1fr 1fr;
  
  grid-gap: 50px 0px;
  padding: 2.5%; /* 新增padding替代原本的子元素尺寸縮小 */
  box-sizing: border-box; /* 確保padding不會增加元素實際尺寸 */
  overflow-y: visible; /* 確保內容可見 */
  place-items: center; /* 實現網格項目的水平和垂直置中 */
}

.home-category-list-item{
  border: 2px solid #000;
  width: 400px;
  height: 225px;
  background-color: #AAD7F7;
  display: flex; /* 新增 */
  flex-direction: column;
  justify-content: flex-end; /* 將內容靠下對齊 */
  align-items: center; /* 水平置中 */
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import http from '../utils/httpRequest'
import {useRouter} from 'vue-router';
//home-header-navigation Home首頁最上方導航列模塊
import HomeHeaderNavigation from "../components/HomeHeaderNavigation.vue";

const router = useRouter()

const handleCategoryRouterLink = function (child) {
  console.log("child",child)
  // router.push({
  //   name: "Home",
  //   params: { categoryId: child.id },
  //   query: { page: 1 } // Add page param directly here
  // })

  router.push({
    name:"Home",
    params:{categoryId:child.id}
  })
}

// 樹形分類數據
let categoryList = ref()
// let categoryList=ref<TreeCategoryNode | undefined>()
const getTreeCategoryList = function () {
  http({
    url: http.adornUrl('/article/category/tree/list'),
    method: 'get',
    params: http.adornParams({})
  }).then(({data}) => {
    if (data.code == "200") {
      // categoryList=data.data
      categoryList.value=data.data
      console.log("categoryList.value",categoryList.value)
      // console.log("從後端獲取樹型分類數據:",categoryList)
    } else {
      ElMessage.error("獲取分類數據錯誤");
    }
  })
}

// 獲取所有子分類的函數
const allChildren = computed(() => {
  if (!categoryList.value) return [];
  
  const children = [];
  categoryList.value.forEach(category => {
    if (category.children && category.children.length) {
      children.push(...category.children);
    }
  });
  
  return children;
});

onMounted(() => {
  getTreeCategoryList()//從後端獲取分類數據
})
</script>


