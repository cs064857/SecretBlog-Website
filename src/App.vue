

<template>

<!--  <admin-vue></admin-vue>-->
<!--  <main-grid></main-grid>-->
<!--  <Grip-Test></Grip-Test>-->
<!--<Home></Home>-->
<router-view name="app"></router-view>


<!-- <TinyMceEditManagement></TinyMceEditManagement> -->


</template>

<script lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import {onMounted} from "vue"
import { useIsLoginStore } from "@/pinia/useIsLoginStore.js";
import {isLoginRequest} from "@/requests/userAuthRequest"

import MinioUpload from "./components/minioUpload.vue";
import Main from "./layouts/AdminLayout.vue"
// import MainGrid from "./components/MainGrid.vue";
import Home from "./layouts/FrontLayout.vue";
import TinyMceEditManagement from "@/components/admin/TinyMceEditManagement.vue"

import AdminVue from "./layouts/AdminLayout.vue";
export default {
  components:{AdminVue,MinioUpload,Main,Home,TinyMceEditManagement}
}

onMounted(async () => {
  // 應用程式啟動時，呼叫後端 API 驗證登入狀態，
  // isLoginRequest 函數內部會更新 Pinia store。
  await isLoginRequest(); 

})

</script>

<style>
html,body,#app{
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;

  block-size: 100%;
}
/* tinymce */
.tinymce-box {
  width: 100%;
}
/* /tinymce */
</style>
