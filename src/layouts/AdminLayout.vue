<template>

    <el-container class="common-layout">
      <el-header class="common-layout-header">
        Header

        <el-switch v-model="darkModeToggle" class="ml-2" @change="switchchange" />
      </el-header>
      <el-container class="common-layout-body">
        <el-aside style="width: 200px">
          <!--   NavMenu導航菜單     -->
          <el-row style="min-height: 100%;max-height: 100%">
            <el-col :span="12" style="height: 100%">
<!--              <h5 class="mb-2">導航菜單</h5>-->
              <el-menu

                  class="el-menu-vertical-demo"
                  default-active="2"
                  text-color="#fff"
                  router
                  @open="handleOpen"
                  @close="handleClose"
                  @select="handleSelect"
              >
                <!-- <el-sub-menu   index="1">
                  <template #title >
                    <el-icon >
                      <location />
                    </el-icon>
                    <span >Navigator One</span>
                  </template>
                  <el-menu-item-group title="Group One">
                    <el-menu-item index="MainGrid">MainGrip</el-menu-item>
                    <el-menu-item index="UserManagement" >用戶系統</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="Group Two">
                    <el-menu-item index="Home">Home</el-menu-item>
                  </el-menu-item-group>
                  <el-sub-menu index="1-4">
                    <template #title>
                      <el-icon >
                      <location />
                    </el-icon>
                      item four
                    </template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                  </el-sub-menu>
                </el-sub-menu> -->

                <!-- <el-menu-item index="2">
                  <el-icon>
                    <icon-menu/>
                  </el-icon>
                  <span>Navigator Two</span>
                </el-menu-item>
                <el-menu-item index="3" disabled>
                  <el-icon>
                    <document/>
                  </el-icon>
                  <span>Navigator Three</span>
                </el-menu-item> -->

                <el-menu-item index="UserManagement">
                  <el-icon>
                    <setting/>
                  </el-icon>
                  <span>用戶系統</span>
                </el-menu-item>

                <el-menu-item index="TinyMceEditManagement">
                  <el-icon>
                    <setting/>
                  </el-icon>
                  <span>編輯介面</span>

                </el-menu-item>

                <el-menu-item index="TreeCategories">
                  <el-icon>
                    <setting/>
                  </el-icon>
                  <span>分類系統</span>
                </el-menu-item>

                <el-menu-item index="ArticleManagement">
                  <el-icon>
                    <setting/>
                  </el-icon>
                  <span>文章系統</span>
                </el-menu-item>

                <el-menu-item index="Home">
                  <el-icon>
                    <setting/>
                  </el-icon>
                  <span>網站首頁</span>
                </el-menu-item>

              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-container class="common-layout-content">
          <el-main class="common-layout-main">
            <router-view  name="AdminVueRouter"></router-view>

            <!--            <div class="grid-item">-->
            <!--              <el-button class="b1" type="primary" round>新增</el-button>-->
            <!--            </div>-->
          </el-main>
<!--          <el-footer style="background: #1b192d;min-height: 10%;max-height: 10%">Footer</el-footer>-->
        </el-container>
      </el-container>
    </el-container>

</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import {onMounted, ref} from 'vue'
const router = useRouter()

const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}

// const handleGoTinyMceEditManagementor =function (){ //使用@click綁定於el-menu-item上,點擊觸發此方法並且跳轉路由
//   router.push({name:'TinyMceEditManagement'})
// }

const handleSelect =function (index:string){
  //利用@select放置於el-menu上,當點擊其中的el-menu-item的話,會獲得index參數並且觸發方法將參數傳入,並跳轉路由
  router.push({name:index})
}
/**
 * 黑暗模式開關
 */

// import 'element-plus/theme-chalk/dark/css-vars.css'
 
onMounted(()=>{
  document.documentElement.className = 'dark';
})

// onMounted(()=>{
//   document.documentElement.className = 'dark';
// })

// import {useDarkModeToggleStore} from '@/pinia/useDarkModeToggleStore'
// const darkModeToggleStore = useDarkModeToggleStore()

//  const darkModeToggle = ref(false)
  
//  const switchchange = (val:any) => {
// console.log("val：",val)
//  // 取得 html 根元素
//  let html = document.documentElement  //获取html根元素
// // 根據開關狀態設定 html 根元素的 class 屬性，實現暗黑模式切換，透過html.dark來設定CSS
// if (val) {
//     darkModeToggleStore.setDarkModeToggle('dark');
//     html.className = 'dark';
//   } else {
//     darkModeToggleStore.setDarkModeToggle('light');
//     html.className = '';
//   }

// }


</script>


<style scoped>

/* 定義暗黑模式的全局變量 */
html.dark .el-menu-item-group{
  background-color: var(--bg-hex-111111e7);
}
html.dark .el-sub-menu,html.dark .el-menu-item{
  /* 設置背景顏色(左側導航的字體顏色) */
  --el-menu-text-color: #ffffff;
}
html.dark .el-menu-vertical-demo {
  background-color: var(--bg-hex-111111);
}

html.dark .el-menu-vertical-demo{
  position: absolute;
  height: 100%;
  width: 100%;
  /*border-right-width: 0;*/
  /*active-text-color:#ffd04b;*/
  /* 設置背景顏色(左側導航的背景顏色) */
  background-color: var(--bg-hex-111111);
  border: #333333 1px solid;;
}
html.dark .el-sub-menu[data-v-39f105c9] {

--el-menu-bg-color: #111111e7;
}
html.dark .common-layout-header{
  height: 75px;
  background-color: var(--bg-hex-121212);
}
/* 修改el-menu-item hover顏色 */
.el-menu-item:hover{
  background-color: var(--bg-hex-1f1f1f);
}
.el-sub-menu[data-v-39f105c9] {

    --el-menu-bg-color: #6b788be7;
}


.common-layout-header{
  height: 75px;
  background-color: var(--bg-hex-38866c);
}

.el-menu-item-group{
  background-color: var(--bg-hex-da6969e7);
}


.el-sub-menu,.el-menu-item{
  /* 設置背景顏色(左側導航的字體顏色) */
  --el-menu-text-color: #000000;
}

.el-menu-vertical-demo{
  position: absolute;
  height: 100%;
  width: 100%;
  /*border-right-width: 0;*/
  /*active-text-color:#ffd04b;*/
  /* 設置背景顏色(左側導航的背景顏色) */
  background-color: var(--bg-hex-5a3636);
  border: #333333 1px solid;;
}

.common-layout{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 避免 flex 佈局下內容被撐高導致無法捲動 */
.common-layout-body {
  flex: 1;
  min-height: 0;
}

.common-layout-content {
  flex: 1;
  min-height: 0;
}

.common-layout-main {
  padding: 0;
  min-width: 100%;
  overflow: auto;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

:deep(.el-button) {
  width: 90px;
  height: auto;
}

:deep(.el-container) {
  min-width: 0;
  min-height: 0;
}


</style>
