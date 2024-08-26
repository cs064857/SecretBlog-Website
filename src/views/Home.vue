<template>
  <div class="header-outer-wrapper">
    <div class="header-search-wrapper">
      <div class="header-left-wrapper">
        <img src="../img/1.jpg" alt="">
      </div>

      <div class="header-right-wrapper">
        <div id="header-search-Input">
          <button @click="handleIntoBackGround" style="float: right;margin:5px 50px 50px 25px">後台</button>
        </div>
        <div id="header-search-keywords">keywords</div>
      </div>
    </div>

    <div class="main-content">

      <div id="main-content-tags">

        <router-link v-for="(button,index) in buttons" :key="index" :to="button.route">
          <div class="mb-4">
            <el-button type="primary"
                       style="width: 100px;height: 35px;background-color: beige;font-size: 30px;" text bg>
              {{ button.title }}
            </el-button>

          </div>
        </router-link>


        <button @click="testRoute">111</button>


        <!-- <el-link class="tags-button" type="primary">首頁</el-link>
        <el-link class="tags-button" type="primary">新聞</el-link>
        <el-link class="tags-button" type="primary">關於</el-link> -->


        <!-- <button class="tags-button">首頁</button>
        <button class="tags-button">新聞</button>
        <button class="tags-button">關於</button> -->
      </div>
      <li style="list-style-type: none;">

        <div style="border: 2px solid darkslateblue; margin: 0 20% 1% 20%; height: 600px;width: 60%;">
          <router-view name="HomeRouter"></router-view>
          <!-- <router-view name="Home"></router-view> -->
        </div>
      </li>

      <!-- <img src="../img/1.jpg" height="1000px" alt=""> -->
    </div>

  </div>
  <!-- <div class="header-inner-wrapper">

  </div> -->
  <!-- <div style="background-color: darkgoldenrod;">Two</div>
      <div style="background-color: darkgray;">Three</div>
      <div style="background-color: darkgreen;">Four</div> -->


</template>

<script setup lang="ts" name="Home">
import {ref} from 'vue';
import {useRouter, useRoute} from 'vue-router'

interface tagsButton {
  title: string
  route: string
}

const tagsButtons: tagsButton[] = [];
const router = useRouter()
const route = useRoute()

const handleIntoBackGround = function () {//進入後台管理系統
  router.push('/AdminVue')
}
const testRoute = function () {
  router.push('/Home/News1Test')
}

const buttons = ref<typeof tagsButtons>([
  {
    title: "首頁",
    route: "/",
  },
  {
    title: "新聞1",
    route: "/Home/News1Test",
  },
  {
    title: "關於",
    route: "/Home/News2Test",
  }
])
</script>

<style scoped>
.header-outer-wrapper {
  display: grid;
  place-items: center;
  /*將該grid容器下的子容器設定為置中*/
  grid-template-columns: auto;
  /* grid-template-rows: 0.2fr 0.9fr; */
  /* row-gap: 150px; */

  width: 100%;


  /* 確保最小高度為100%,例如main-content若有3000px的話,則header-outer-wrapper也會同步成3000px*/
  background-color: rgb(50, 112, 112);

}

.main-content {
  background-color: beige;
  width: 85%;
  height: 1500px;
  /*padding-top: 11%; /* 設置與 header-search-wrapper 相同的高度 */
  margin-top: calc(9%);
  /* 在 header-search-wrapper 高度的基礎上增加20px的間隔

  /* margin-top: 15%; */
  /* place-items: center;
  justify-content: center;
  align-items: center; */
}

#main-content-tags {
  border: 2px solid black;
  margin: 0 20% 1% 20%;
  height: 100px;
  width: 60%;
  /* place-items: center; */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* .tags-button {
    width: 150px;
    height: 50px;
    font-size: 20px;

} */


.header-search-wrapper {
  background-color: #00feff;
  display: grid;
  /* grid-template-columns: 0.15fr 0.85fr; */
  grid-template-columns: 15% 85%;
  grid-template-rows: 100%;
  /* justify-content: end; */
  /* 水平對齊方式 */
  /* align-content: end; */
  /* 垂直對齊方式，使內容靠下對齊 */

  /* background-color: darkblue; */
  /* border: 0.1px solid black; */
  /*行之間間隔*/


  position: fixed;
  /* 固定元素*/
  top: 0;
  /* 固定元素置於最上層*/
  min-width: 100%;
  max-width: 100%;
  /* 固定元素的寬度 */
  min-height: 11%;
  max-height: 11%;
  /* 固定元素的高度 */


}

.header-right-wrapper {
  row-gap: 8%;
  display: grid;
  grid-template-rows: 46% 46%;
  background-color: red;
}

.header-left-wrapper {

  justify-content: center;
  display: grid;
  min-height: 1fr;
  max-height: 1fr;
  background-color: pink;

  overflow: hidden;
}

.header-left-wrapper img {
  /*height: 100%;*/
  max-width: 100%;
  height: auto;
}

#header-search-Input {

  background-color: rgb(181, 209, 23);
  /*display: flex;*/

  /* margin-left: 50%; */
  /* height: 50%; */
}

#header-search-keywords {
  background-color: #152a7c;
  /*max-height: 100%;*/
  /*min-height: 100%;*/

  /* margin-bottom: 20px; */
  /* margin-left: 50%; */
  /* height: 200%; */
}

/* 按鈕樣式 */

/* .tags-button {
    font-size: 30px;
} */

/* :deep(.el-link){
    font-size: 30px;
} */

/* ::v-depp .el-link {
  margin-right: 8px;
  font-size: 30px;
  line-height: 1
} */
</style>
