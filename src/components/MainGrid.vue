<script setup lang="ts">
import TinyMceEditManagement from './Management/TinyMceEditManagement.vue';
import {ComponentPublicInstance, ref} from 'vue'



// 定义 TinyMceEditManagement 组件暴露的方法类型
interface TinyMceEditManagementMethods {
  handleSetContent: (content: string) => void;
  handleGetContent: () => string;
}
const tinymceRef = ref<ComponentPublicInstance<TinyMceEditManagementMethods> | null>(null);
// 在 setup 函数中定义的方法
const setContent = () => {
  if (tinymceRef.value) {
    // 调用子组件暴露的方法来设置内容
    tinymceRef.value.handleSetContent('<p>新内容</p>');
  }
};
const editorContent = ref('');
const getContent = () => {
  if (tinymceRef.value) {
    // 调用子组件暴露的方法来获取内容
    const content = tinymceRef.value.handleGetContent();
    editorContent.value=content
    console.log('Editor Content:', content);
  }
};
</script>

<template>

    <div class="container">
      <div v-html="editorContent" class="header"></div>
      <div class="tag"><span style="font-family: 'Noto Sans TC', sans-serif;" >標題</span></div>
      <div class="main">

        <div>
          <TinyMceEditManagement ref="tinymceRef"></TinyMceEditManagement>
        </div>
        <div style="background-color: antiquewhite;">
          <button @click="setContent">Set Content</button>
          <button @click="getContent">Get Content</button>
        </div>
      </div>
      <div class="aside"></div>
    </div>


</template>

<style lang="scss" scoped>
@import'../assets/font/font.css';

.container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 0.4fr 2.2fr 0.4fr;
  grid-template-rows: 0.32fr 0.17fr 2.65fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "header header header"
    "aside tag tag"
    "aside main main";
}

.header {
  background-color: aqua;
  border: 1px solid #1a1a1a;
  grid-area: header;
}

.tag {

  border: 1px solid #1a1a1a;
  grid-area: tag;
}

.main {
  border: 1px solid #1a1a1a;

  grid-area: main;
}

.aside {
  border: 1px solid #1a1a1a;
  grid-area: aside;
}
/*
html,body{
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;

  block-size: 100%;
}
 */
</style>
