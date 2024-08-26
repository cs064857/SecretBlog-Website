

<template>

<!--  <admin-vue></admin-vue>-->
<!--  <main-grid></main-grid>-->
<!--  <Grip-Test></Grip-Test>-->
<!--<Home></Home>-->
<router-view name="app"></router-view>


<!-- <TinyMceEdit></TinyMceEdit> -->


</template>

<script lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import MinioUpload from "./components/minioUpload.vue";
import Main from "./components/AdminVue.vue"
import MainGrid from "./components/MainGrid.vue";
import Home from "./views/Home.vue";
import TinyMceEdit from "./components/TinyMceEdit.vue"
import AdminVue from "./components/AdminVue.vue";
export default {
  components:{AdminVue, MainGrid, MinioUpload,Main,Home,TinyMceEdit}
}


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
