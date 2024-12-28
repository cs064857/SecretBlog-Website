<template>
  <div class="main-editarticle">

    <div id="inputHeader">
      <span class="noto-sans-tc" style="font-size: 18px;max-width: 4vh;min-width: 4vh;font-family: 'Noto Sans TC', sans-serif;padding-left: 1%;padding-top: 1%;">標題</span>
      <el-input v-model="inputTitle" style="width: 240px;margin: 2% 2% 2% 0.2%;padding-top: 1%;" placeholder="請輸入標題" />
      <span class="noto-sans-tc" style="font-size: 18px;max-width: 8vh;min-width: 8vh;font-family: 'Noto Sans TC', sans-serif;padding-left: 1%;padding-top: 1%;">文章分類</span>
      <el-tree-select
          v-model="selectValue"
          :data="treeSelectData"
          @change="handleChange"
          :render-after-expand="false"
          style="max-width: 20vh;min-width: 20vh;margin: 2% 2% 2% 0.2%;padding-top: 1%;"
          value-key="id"
      />
      <el-divider />

    </div>

    <div id="inputContent" >
      <editor style="overflow: scroll" v-cloak v-model="myValue" :init="init" :enabled="enabled" :id="tinymceId"></editor>
    </div>

    <div id="inputFooter">
      <el-button type="primary" round @click="handleInput" style="position: relative;bottom: 1vh">送出</el-button>
<!--      <button @click="handleInput">送出</button>-->
    </div>

  </div>



</template>
<style lang="scss" scoped>

[v-cloak] { 
  display: none 
}


// 添加 v-cloak 樣式


// 字體

@import '../../assets/font/font.css';

// @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap');
// .noto-sans-tc{
//   font-family: "Noto Sans TC", sans-serif !important;
//   font-optical-sizing: auto;
//   font-size: 18px;
//   font-weight: 400;
//   font-style: normal;
// }

//字體

:deep(.tox-tinymce) {

  // border: 1px solid #dcdfe6;
  border-radius: 4px;

  .tox-statusbar {
    display: none;
  }
}

html.dark #inputHeader {

display: flex;
align-items: center;
justify-content: start;
width: 100%;
height: 7vh;

border-radius: 30px 30px 0px 0px;
background-color: rgb(34, 33, 33);

}

#inputHeader {

  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  height: 7vh;

  border-radius: 30px 30px 0px 0px;
  background-color: bisque;


}

#inputContent {
  // background-color: #2d2d2d;
  width: 100%;
  height: 68vh;
}
#inputFooter{

  height: 3vh;
}
.main-editarticle {

  // background-color: chocolate;
  margin: 1%;
  width: 90%;
  //min-height: 740px;
  //max-height: 740px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  border-radius: 30px;
  box-shadow: 0px 0px 20px;

}
</style>

<script lang="ts" setup>


import { computed, reactive, watch, ref, nextTick, onMounted, initCustomFormatter } from "vue"; //全屏


import tinymce from "tinymce/tinymce";
// import "tinymce/skins/content/default/content.css";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/icons/default/icons";
import "tinymce/models/dom"; // 一定要引入
import "tinymce/themes/silver"; // 界面UI主題
import "tinymce/plugins/image";
import "tinymce/plugins/table";
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 文字計數
import "tinymce/plugins/preview"; // 預覽
import "tinymce/plugins/emoticons"; // emoji表情
import "tinymce/plugins/emoticons/js/emojis.js"; //必須引入這個文件才有表情圖庫
import "tinymce/plugins/code"; // 編輯源碼
import "tinymce/plugins/link"; // 鏈接插件
import "tinymce/plugins/advlist"; //高級列表
import "tinymce/plugins/codesample"; //代碼示例
import "tinymce/plugins/autoresize"; // 自動調整編輯器大小
import "tinymce/plugins/quickbars"; // 光標處快捷提示
import "tinymce/plugins/nonbreaking"; //插入不間斷空格
import "tinymce/plugins/searchreplace"; //查找替換
import "tinymce/plugins/autolink"; //自動鏈接
import "tinymce/plugins/directionality"; //文字方向
import "tinymce/plugins/visualblocks"; //顯示元素範圍
import "tinymce/plugins/visualchars"; //顯示不可見字符
import "tinymce/plugins/charmap"; // 特殊符號
import "tinymce/plugins/nonbreaking"; //插入不間斷空格
import "tinymce/plugins/insertdatetime"; //插入日期時間
import "tinymce/plugins/importcss"; //引入自定義樣式的css文件
import "tinymce/plugins/accordion"; // 可摺疊數據手風琴模式
import "tinymce/plugins/anchor"; //錨點
import "tinymce/plugins/fullscreen";
import "tinymce-i18n/langs7/zh_TW.js"

// 處理送出至資料庫中
import http from '../../utils/httpRequest';
import {ElMessage} from "element-plus";
import {R} from "@/interface/R";
import {useTreeCategoryStore} from "@/pinia/useTreeCategoryStore"
const inputTitle = ref('')

// 選擇器
const TreeCategoryStore= useTreeCategoryStore()
const treeSelectData = TreeCategoryStore.getTreeData
console.log("treeSelectData:",treeSelectData)

const selectValue = ref()//選中項綁定的分類

// 選擇器/
const selectCategoryId=ref<number>()
const handleChange = function (value:number){
  //得到樹形選擇器中該分類的ID
  selectCategoryId.value=value
  console.log("handleChange.value",value)
}

const handleInput = function () {
  const save = ref(
    {
      title: inputTitle.value,
      content: handleGetContent(),
      categoryId:selectCategoryId.value
    },
  )
  console.log("selectValue2:",selectValue)

  console.log("save:", save)

  http({
    url: http.adornUrl('/article/save'),
    method: 'post',
    data: http.adornData(save.value, false)
  }).then(({data}:{ data: R }) => {
    console.log("data",data)
    if(data.code==200){
      ElMessage.success("文章發布成功")
    }else {
      ElMessage.error("文章發布失敗")
    }
  });

}// 處理送出至資料庫中



const emits = defineEmits(["update:modelValue", "setHtml"]);
//這裡我選擇將數據定義在props裡面，方便在不同的頁面也可以配置出不同的編輯器，當然也可以直接在組件中直接定義
const props = defineProps({
  value: {
    type: String,
    default: () => {
      return "";
    },
  },
  baseUrl: {
    type: String,
    default: "",
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  // 編輯器初始可編輯狀態
  editable_root: {
    type: Boolean,
    default: true,
  },
  plugins: {
    type: [String, Array],
    default:
      "importcss autoresize searchreplace autolink directionality code visualblocks visualchars fullscreen image link codesample table charmap nonbreaking anchor insertdatetime advlist lists wordcount charmap quickbars emoticons accordion",
  },
  knwlgId: {
    type: String,
  },
  toolbar: {
    type: [String, Array, Boolean],
    default: "undo redo | accordion accordionremove | blocks fontfamily fontsize| bold italic underline strikethrough ltr rtl  | align numlist bullist | link image | table | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | anchor codesample",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  minHeight: {
    type: Number,
    default: 630,
  },
});
const loading = ref(false);
const tinymceId = ref(
  "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "")
);


// import {useDarkModeToggleStore} from '@/pinia/useDarkModeToggleStore'
// const darkModeToggleStore = useDarkModeToggleStore()
// const darkModeToggle = computed(()=> darkModeToggleStore.darkModeToggle)
// watch(()=> darkModeToggle.value,()=>{
//   console.log("darkModeToggle.value：",darkModeToggle.value)
// })


/**
 * 深色init
 */
// 添加編輯器載入狀態控制
const editorReady = ref(false)

// import 'tinymce/skins/content/dark/content.css'
// //定義一個對象 init初始化
const init = reactive({

  setup: (editor) => {
    editor.on('init', () => {
      editorReady.value = true
    })
  },

  selector: "#" + tinymceId.value, //富文本編輯器的id,
  // language_url: "public/langs/zh_TW.js", // 語言包的路徑，具體路徑看自己的項目
  language_url: "tinymce-i18n/langs7/zh_TW.js", // 語言包的路徑，具體路徑看自己的項目
  language: "zh_TW",
  // !skin_url: "/tinymce/skins/ui/oxide", // skin路徑，具體路徑看自己的項目

  // 修改這些設定
  skin_url: '/tinymce/skins/ui/oxide-dark', // 修改 skin_url(工具欄深顏色)
  // skin_url: '/tinymce/skins/ui/oxide', // 修改 skin_url(工具欄淺顏色)
  // skin: 'oxide-dark',
  content_css: '/tinymce/skins/content/dark/content.css', // 指定具體的 content_css 路徑(輸入欄深色)
  // content_css: '/tinymce/skins/content/default/content.css', // 指定具體的 content_css 路徑(輸入欄淺色)
  
  // content_style: `
  //   body {
  //     font-family: Helvetica, Arial, sans-serif;
  //     font-size: 16px;
  //     color: #ffffff !important;
  //     background-color: #2d2d2d !important;
  //   }
  //   p {
  //     margin: 3px;
  //     line-height: 24px;
  //     color: #ffffff !important;
  //   }
  //   * {
  //     color: #ffffff !important;
  //   }
  // `,

  editable_root: props.editable_root,
  height: 600,
  branding: false, // 是否禁用“Powered by TinyMCE”
  promotion: false, //去掉 upgrade
  // toolbar_sticky: true,
  // toolbar_sticky_offset: 100,
  menubar: "edit view insert format tools table",
  paste_data_images: true, //允許粘貼圖像
  image_dimensions: false, //去除寬高屬性
  plugins: props.plugins, //這裡的數據是在props裡面就定義好了的
  toolbar: props.toolbar, //這裡的數據是在props裡面就定義好了的
  // 取消圖片資源路徑轉換
  convert_urls: false,
  // table邊框位0是否展示網格線
  // visual: false,
  // 超鏈接默認打開方式
  link_default_target: "_blank",
  link_context_toolbar: true,
  // 默認快捷菜單
  quickbars_insert_toolbar: "image codesample table",
  // 選中圖片的快捷提示
  quickbars_image_toolbar: "alignleft aligncenter alignright | rotateleft rotateright | imageoptions",
  editimage_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
  // 文字樣式
  font_family_formats:
    "Arial=arial,helvetica,sans-serif; 宋體=SimSun; 微軟雅黑=Microsoft Yahei; Impact=impact,chicago;", //字體
  font_size_formats: "11px 12px 14px 16px 18px 24px 36px 48px 64px 72px", //文字大小
  image_caption: true,
  editimage_cors_hosts: ["picsum.photos"],
  noneditable_class: "mceNonEditable",
  toolbar_mode: "wrap", // 工具欄模式 floating / sliding / scrolling / wrap
  // 默認樣式
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:16px;}p {margin:3px; line-height:24px;}",
  image_advtab: true,
  importcss_append: true,
  paste_webkit_styles: "all",
  paste_merge_formats: true,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: false,
  file_picker_types: "file",
  // 選中文字的快捷提示
  quickbars_selection_toolbar:
    "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
  // 編輯器高度自適應
  autoresize_bottom_margin: 20,
  // autoresize_overflow_padding: 16,
  min_height: props.minHeight,
  // content_css: "/tinymce/skins/content/default/content.css", //以css文件方式自定義可編輯區域的css樣式，css文件需自己創建並引入
  // !content_css: "/src/assets/css/content.css", //以css文件方式自定義可編輯區域的css樣式，css文件需自己創建並引入

  // setup: function (editor) {
  // },
  //圖片上傳  -實列 具體請根據官網補充-
  images_upload_handler: function (blobInfo, progress) {
    new Promise((resolve, reject) => {
      let file = blobInfo.blob();
      if (file.size / 1024 / 1024 > 200) {
        reject({
          message: "上傳失敗，圖片大小請控制在 200M 以內",
          remove: true,
        });
      }
      const formData = new FormData();
      formData.append("file", file);
      console.log(formData)
      axios.post("/api/upload/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          progress(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      }).then((res) => {
        resolve(res.data.url);
      })
        .catch()

    });
  },
});



// 外部傳遞進來的數據變化
const myValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emits("update:modelValue", val);
  },
});

//監聽富文本中的數據變化
watch(
  () => myValue.value,
  () => {
    emits(
      "setHtml",
      tinymce.activeEditor.getContent({ format: "text" }),
      myValue.value
    );
  }

);

// 設置編輯器只讀模式
watch(
  () => props.readonly,
  (newValue, oldValue) => {
    nextTick(() => {
      tinymce.activeEditor.mode.set(newValue ? "readonly" : "design");
      let iframeDom = document.querySelector("iframe");
      iframeDom &&
        (iframeDom.contentWindow.document.body.style.margin = newValue
          ? 0
          : "16px");
    });
  },
  { immediate: true }
);

//初始化編輯器
// onMounted(() => {
//   tinymce.init({});
// });

// 設置值
const handleSetContent = (content) => {
  tinymce.activeEditor.setContent(content);
};

// 獲取值
const handleGetContent = () => {
  return tinymce.activeEditor.getContent();
};

defineExpose({
  handleSetContent,
  handleGetContent,
});
</script>
