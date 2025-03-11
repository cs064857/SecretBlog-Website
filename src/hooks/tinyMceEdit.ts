import TinyMceEditManagement from '@/components/admin/TinyMceEditManagement.vue';
import {ComponentPublicInstance, ref} from 'vue'
export default function(){
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
  return {setContent,getContent,editorContent,tinymceRef}
};
}
