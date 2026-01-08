<template>

  <!--  <admin-vue></admin-vue>-->
  <!--  <main-grid></main-grid>-->
  <!--  <Grip-Test></Grip-Test>-->
  <!--<Home></Home>-->
  <router-view name="app"></router-view>


  <!-- <TinyMceEditManagement></TinyMceEditManagement> -->


</template>

<script setup lang="ts">
// import { onMounted } from "vue"
// import { isLoginRequest } from "@/requests/userAuthRequest"

// onMounted(async () => {
//   // 延遲執行
//   setTimeout(async () => {
//     console.log("App.vue: 執行全域登入狀態檢查...");
//     await isLoginRequest(false);
//   }, 200);
// })
</script>

<style>
html,
body,
#app {
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
