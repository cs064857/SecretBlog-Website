<template>
  <Teleport to="body">
    <Transition name="reply-modal" appear>
      <div v-if="isVisible" class="reply-modal-overlay" @click="handleOverlayClick">
        <!-- <div v-if="visible" class="reply-modal-overlay" @click="handleOverlayClick"> -->
        <div class="reply-modal-container" @click.stop>


          <!-- <div style="width: 500px; height: 600px; background-color: whitesmoke;"> -->
          <!-- 對已存在留言進行回覆時所需的原留言使用者名稱以及原留言內容 -->
          <div>
            <slot name="reply-comment-header" />
          </div>

          <!-- 新增文章或者編輯文章時所需的文章標題、文章分類、文章標籤等欄位 -->
          <div>
            <slot name="article-editor-header" />
          </div>


          <br></br>
          <!-- 智能工具列 -->
          <div class="smart-toolbar">
            <!-- 文字格式組 -->
            <div class="toolbar-group">
              <span class="group-label">格式</span>
              <div class="tool-buttons">
                <button v-for="tool in textFormattingTools" :key="tool.name" class="tool-btn"
                  :class="{ active: tool.active }" :title="tool.title" @click="applyFormat(tool)">
                  <svg class="tool-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path :d="tool.iconPath" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- 內容插入組 -->
            <div class="toolbar-group">
              <span class="group-label">插入</span>
              <div class="tool-buttons">
                <button v-for="tool in insertionTools" :key="tool.name" class="tool-btn" :title="tool.title"
                  @click="insertContent(tool)">
                  <svg class="tool-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path :d="tool.iconPath" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 編輯器區域 -->
          <div class="editor-container">
            <QuillEditor @paste="handlePaste" ref="quillEditor" v-model:content="content" content-type="text" :options="editorOptions"
              placeholder="撰寫您的回覆..." @ready="onEditorReady" />
          </div>

          <!-- 貼上圖片預覽（延遲至提交時才上傳） -->
          <div v-if="stagedImages.length" class="pasted-images-preview">
            <div class="pasted-images-header">
              <span class="pasted-images-title">貼上圖片預覽</span>
              <span class="pasted-images-hint">圖片將於發表回覆時才上傳</span>
            </div>

            <div class="pasted-images-grid">
              <div v-for="img in stagedImages" :key="img.id" class="pasted-image-card">
                <img class="pasted-image" :src="img.localUrl" :alt="img.file.name || '貼上圖片'" />
                <div class="pasted-image-footer">
                  <span class="pasted-image-name">{{ img.file.name || '貼上圖片' }}</span>
                  <button class="pasted-image-remove" type="button" @click="removeStagedImage(img.id)">移除</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="action-buttons">
            <button class="cancel-btn" @click="handleCancel">
              取消
            </button>
            <button class="submit-btn" @click="handleSubmit" :disabled="!isContentValid || isSubmitting">
              {{ isSubmitting ? '發送中...' : '發表回覆' }}
            </button>
          </div>
        </div>
      </div>

    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onUnmounted, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploadContentImageRequest } from '@/requests/useMinioRequest'

const modalVisible = ref<boolean>(false)
const content = ref<string>('')

interface StagedImage {
  id: string
  file: File
  localUrl: string
}

// 貼上圖片暫存佇列（延遲至提交時才上傳）
const stagedImages = ref<StagedImage[]>([])

const createStagedImageId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const revokeStagedImageUrl = (localUrl: string) => {
  try {
    URL.revokeObjectURL(localUrl)
  } catch (error) {
    console.warn('revokeObjectURL 失敗:', error)
  }
}

const clearStagedImages = () => {
  stagedImages.value.forEach(img => revokeStagedImageUrl(img.localUrl))
  stagedImages.value = []
}

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const removeStagedImage = (id: string) => {
  const index = stagedImages.value.findIndex(img => img.id === id)
  if (index === -1) return

  const img = stagedImages.value[index]

  const editor = quillEditor.value?.getQuill()
  if (editor) {
    // 直接從 Quill 內容刪除包含該 blob URL 的整行，避免 v-model 不同步造成畫面殘留
    let text = editor.getText() || ''
    let pos = text.indexOf(img.localUrl)

    while (pos !== -1) {
      const prevNewline = text.lastIndexOf('\n', pos)
      const start = prevNewline === -1 ? 0 : prevNewline + 1
      const nextNewline = text.indexOf('\n', pos)
      const end = nextNewline === -1 ? text.length : nextNewline + 1

      editor.deleteText(start, end - start)

      text = editor.getText() || ''
      pos = text.indexOf(img.localUrl)
    }

    // 同步外部狀態（Quill 會自帶最後一個換行）
    content.value = editor.getText().replace(/\n$/, '')
  } else {
    // fallback：若 Quill 尚未就緒，至少先從內容字串移除對應的 Markdown 片段
    const localUrlPattern = escapeRegExp(img.localUrl)
    const markdownImageRegex = new RegExp(`\\n?!\\[[^\\]]*\\]\\(${localUrlPattern}\\)\\n?`, 'g')
    content.value = content.value.replace(markdownImageRegex, '\n').replace(/\n{3,}/g, '\n\n')
  }

  revokeStagedImageUrl(img.localUrl)
  stagedImages.value.splice(index, 1)
}

interface Props {
  modalVisible: boolean
  content?: string

}

const props = withDefaults(defineProps<Props>(), {
  modalVisible: false,
  content: ''
})

//當props.content變化時，將其同步到content.value
watch(() => props.content, (newValue) => {
  content.value = newValue
}, { immediate: true, deep: true })

// modal 關閉時清理暫存(避免記憶體外洩，也避免blob URL被帶到下次開啟))
watch(() => props.modalVisible, (visible) => {
  if (!visible) clearStagedImages()
})

onUnmounted(() => {
  clearStagedImages()
})

// 使用 computed 來同步 modalVisible

const isVisible = computed(
  () => props.modalVisible
)

const emit = defineEmits<{

  (e: 'close'): void,
  (e: 'submit', data: string): void

}>()

// 確定按鈕，先上傳暫存圖片→替換內容→再提交
const handleSubmit = async () => {
  if (isSubmitting.value) return

  //若沒有內容，直接拒絕
  if (!content.value || !content.value.trim()) return

  isSubmitting.value = true

  try {
    let finalContent = content.value

    //依序上傳，只處理仍存在於內容中的 blob URL
    for (const img of [...stagedImages.value]) {
      if (!finalContent.includes(img.localUrl)) {
        revokeStagedImageUrl(img.localUrl)
        stagedImages.value = stagedImages.value.filter(item => item.id !== img.id)
        continue
      }

      const res = await uploadContentImageRequest(img.file, img.file.name || 'pasted-image')

      if (res.code === '200' && res.data) {
        //將本地blob URL替換成後端回傳的真實URL
        finalContent = finalContent.split(img.localUrl).join(res.data)

        revokeStagedImageUrl(img.localUrl)
        stagedImages.value = stagedImages.value.filter(item => item.id !== img.id)
      } else {
        ElMessage.error(res.msg || '圖片上傳失敗')
        return
      }
    }

    content.value = finalContent
    emit('submit', finalContent)
  } catch (error) {
    console.error('提交前圖片上傳失敗:', error)
    ElMessage.error('圖片上傳失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}


// Props
// interface ReplyToUserInterface {
//   username: string
//   commentContent: string
//   commentId: string
//   articleId: string
// }

// interface Props {
//   visible: boolean
//   // replyToUser: ReplyToUserInterface
//   replyToUser: Object
//   model: "replyComment" | "createArticle" | "editArticle"
// }

// const props = withDefaults(defineProps<Props>(), {
//   visible: false,
//   model: 'createArticle',
//   // replyToUser: () => ({
//   //   username: '',
//   //   commentContent: '',
//   //   commentId: '',
//   //   articleId: ''
//   // })
// })

import { createArticleDataInterface } from "@/interface/createArticleDataInterface";

const createArticleData = ref<createArticleDataInterface>({
  title: '',
  content: '',
  categoryId: '',
  tagsId: ''
})

import { artTagsDataInterfaceList } from "@/interface/artTagsDataInterface";

interface editArticleDataInterface {
  title: string;
  content: string;
  categoryId: string;
  tagsId: string[];  // 改為字串陣列
  articleId?: string;  // 編輯時需要文章 ID
}

const editArticleData = ref<editArticleDataInterface>({
  title: '',
  content: '',
  categoryId: '',
  tagsId: [],
  articleId: '',
  // title: inputTitle.value,
  // content: content.value,
  // categoryId: selectCategoryId.value,
  // amsArtTagsVoList: selectTagsValue.value
})



// Reactive data

const isSubmitting = ref(false)
const quillEditor = ref()

// 智能工具列配置
const textFormattingTools = [
  {
    name: 'bold',
    title: '粗體 (Ctrl+B)',
    format: 'bold',
    iconPath: 'M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-4v1.9H7c-1.71 0-3.1-1.39-3.1-3.1s1.39-3.1 3.1-3.1h4v1.9h-1.5c-1.71 0-3.1 1.39-3.1 3.1s1.39 3.1 3.1 3.1z',
    active: false
  },
  {
    name: 'italic',
    title: '斜體 (Ctrl+I)',
    format: 'italic',
    iconPath: 'M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z',
    active: false
  },
  {
    name: 'code',
    title: '行內程式碼 (`)',
    format: 'code',
    iconPath: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4zM2 20h20v2H2v-2z',
    active: false
  }
]

const insertionTools = [
  {
    name: 'link',
    title: '插入連結',
    iconPath: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z'
  },
  {
    name: 'quote',
    title: '引用區塊',
    iconPath: 'M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z'
  },
  {
    name: 'ul',
    title: '無序清單',
    iconPath: 'M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z'
  },
  {
    name: 'ol',
    title: '編號清單',
    iconPath: 'M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z'
  },
  {
    name: 'code-block',
    title: '程式碼區塊',
    iconPath: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4zM2 20h20v2H2v-2z'
  }
]

// Quill編輯器配置
const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: false // 隱藏默認工具列，使用自定義的
  },
  placeholder: '撰寫您的回覆...'
}

// // Methods
// const truncateText = (text: string, maxLength: number): string => {
//   if (text.length <= maxLength) return text
//   return text.substring(0, maxLength) + '...'
// }

const handleOverlayClick = () => {
  handleCancel()
}


// const resetModal = function(){


// }

// Emits
// const emit = defineEmits<{
//   close: [];
//   submit: [content: string, replyData?: Object]
//   handleCreateArticle: [createArticleData?: createArticleDataInterface]
//   handleEditArticle: [articleId: string, editArticleData?: editArticleDataInterface];
// }>()



const handleCancel = () => {
  console.log("handleCancel");
  if (content.value.trim() && !isSubmitting.value) {
    ElMessageBox.confirm(
      '您有未儲存的內容，確定要關閉嗎？',
      '提示',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      emit('close')
    }).catch(() => {
      //使用者取消，不執行任何操作
    })
  } else {
    emit('close')
  }
}

// const handleSubmit = async () => {
//   if (!content.value.trim() || isSubmitting.value) return;

//   isSubmitting.value = true;

//   try {
//     console.log("props.model:", props.model);

//     if (props.model === "replyComment") {
//       // 處理留言回覆
//       emit('submit', content.value, props.replyToUser);

//     } else if (props.model === "createArticle") {
//       // 處理新增文章
//       createArticleData.value = {
//         title: inputTitle.value,
//         content: content.value,
//         categoryId: selectCategoryId.value,
//         tagsId: selectTagsValue.value
//       };
//       emit('handleCreateArticle', createArticleData.value);

//     } else if (props.model === "editArticle") {
//       // 處理編輯文章
//       editArticleData.value = {
//         title: inputTitle.value,
//         content: content.value,
//         categoryId: selectCategoryId.value,
//         tagsId: selectTagsValue.value,
//         // articleId: props.replyToUser.articleId
//       };
//       emit('handleEditArticle', props.replyToUser.articleId, editArticleData.value);
//     }

//     resetModal();
//   } catch (error) {
//     console.error('提交時出錯:', error);
//   } finally {
//     isSubmitting.value = false;
//   }
// };


// 真正的所見即所得格式應用
const applyFormat = (tool: any) => {
  const editor = quillEditor.value?.getQuill()
  if (!editor) return

  const range = editor.getSelection()
  if (!range) return

  // 切換工具的激活狀態
  tool.active = !tool.active

  if (range.length > 0) {
    // 有選中文字，直接應用格式
    const currentFormat = editor.getFormat(range)
    const isActive = currentFormat[tool.format]

    editor.formatText(range.index, range.length, tool.format, !isActive)

    // 更新工具的激活狀態以反映實際格式
    tool.active = !isActive
  } else {
    // 沒有選中文字，設定游標位置的格式
    const currentFormat = editor.getFormat()
    const isActive = currentFormat[tool.format]

    editor.format(tool.format, !isActive)
    tool.active = !isActive
  }

  // 保持編輯器焦點
  editor.focus()
}

// 內容插入功能
const insertContent = (tool: any) => {
  const editor = quillEditor.value?.getQuill()
  if (!editor) return

  const range = editor.getSelection() || { index: editor.getLength(), length: 0 }
  const selectedText = range.length > 0 ? editor.getText(range.index, range.length) : ''

  let textToInsert = ''
  let selectionStart = range.index
  let selectionLength = 0

  switch (tool.name) {
    case 'link':
      if (selectedText) {
        textToInsert = `[${selectedText}](https://example.com)`
        selectionStart = range.index + selectedText.length + 3
        selectionLength = 19 // 選中 "https://example.com"
      } else {
        textToInsert = '[連結文字](https://example.com)'
        selectionStart = range.index + 1
        selectionLength = 4 // 選中 "連結文字"
      }
      break
    case 'quote':
      const quoteText = selectedText || '引用內容'
      textToInsert = `\n> ${quoteText}\n`
      if (!selectedText) {
        selectionStart = range.index + 3
        selectionLength = 4
      } else {
        selectionStart = range.index + textToInsert.length
      }
      break
    case 'ul':
      const ulText = selectedText || '清單項目'
      textToInsert = `\n- ${ulText}\n`
      if (!selectedText) {
        selectionStart = range.index + 3
        selectionLength = 4
      } else {
        selectionStart = range.index + textToInsert.length
      }
      break
    case 'ol':
      const olText = selectedText || '編號項目'
      textToInsert = `\n1. ${olText}\n`
      if (!selectedText) {
        selectionStart = range.index + 4
        selectionLength = 4
      } else {
        selectionStart = range.index + textToInsert.length
      }
      break
    case 'code-block':
      const codeText = selectedText || 'console.log("Hello, World!");'
      textToInsert = `\n\`\`\`javascript\n${codeText}\n\`\`\`\n`
      if (!selectedText) {
        selectionStart = range.index + 15 // 定位到程式碼內容
        selectionLength = 29 // 選中範例程式碼
      } else {
        selectionStart = range.index + textToInsert.length
      }
      break
  }

  // 刪除選中的文字並插入新內容
  if (range.length > 0) {
    editor.deleteText(range.index, range.length)
  }

  editor.insertText(range.index, textToInsert)

  // 設定新的選中範圍
  if (selectionLength > 0) {
    editor.setSelection(selectionStart, selectionLength)
  } else {
    editor.setSelection(selectionStart, 0)
  }

  editor.focus()
}

// 更新格式化工具的激活狀態
const updateToolStates = () => {
  const editor = quillEditor.value?.getQuill()
  if (!editor) return

  const range = editor.getSelection()
  if (!range) return

  const format = editor.getFormat(range)

  textFormattingTools.forEach(tool => {
    tool.active = !!format[tool.format]
  })
}

// // 監聽 props.visible 變化以重置狀態
// watch(() => props.visible, (newVisible) => {
//   if (newVisible) {
//     // 模態開啟時重置狀態
//     showMarkdownGuide.value = false
//     nextTick(() => {
//       const editor = quillEditor.value?.getQuill()
//       if (editor) {
//         editor.focus()
//         updateToolStates()
//       }
//     })
//   } else {
//     // 模態關閉時清理狀態
//     textFormattingTools.forEach(tool => {
//       tool.active = false
//     })
//   }
// })

// 擷便的鍵盤快捷鍵提示
const getShortcutHint = (toolName: string): string => {
  const shortcuts: Record<string, string> = {
    'bold': 'Ctrl+B',
    'italic': 'Ctrl+I',
    'code': 'Ctrl+`',
    'link': 'Ctrl+K'
  }
  return shortcuts[toolName] || ''
}

// 加強的提交檢查
const isContentValid = computed(() => {
  const trimmedContent = content.value.trim()
  // 檢查是否只有HTML標籤而沒有實際內容
  const textContent = trimmedContent.replace(/<[^>]*>/g, '').trim()
  console.log("isContentValid textContent:", textContent)
  return textContent.length > 0
})

const onEditorReady = () => {
  nextTick(() => {
    const editor = quillEditor.value?.getQuill()
    if (editor) {
      editor.focus()

      // 監聽選擇變化以更新工具狀態
      editor.on('selection-change', updateToolStates)

      // 監聽內容變化以同步狀態
      editor.on('text-change', updateToolStates)

      // 鍵盤快捷鍵支援
      const toolbar = editor.getModule('toolbar')
      editor.keyboard.addBinding({
        key: 'B',
        ctrlKey: true
      }, () => {
        const boldTool = textFormattingTools.find(tool => tool.name === 'bold')
        if (boldTool) applyFormat(boldTool)
        return false // 阻止預設行為
      })

      editor.keyboard.addBinding({
        key: 'I',
        ctrlKey: true
      }, () => {
        const italicTool = textFormattingTools.find(tool => tool.name === 'italic')
        if (italicTool) applyFormat(italicTool)
        return false
      })

      editor.keyboard.addBinding({
        key: 'K',
        ctrlKey: true
      }, () => {
        const linkTool = insertionTools.find(tool => tool.name === 'link')
        if (linkTool) insertContent(linkTool)
        return false
      })

      editor.keyboard.addBinding({
        key: '`',
        ctrlKey: true
      }, () => {
        const codeTool = textFormattingTools.find(tool => tool.name === 'code')
        if (codeTool) applyFormat(codeTool)
        return false
      })

      // Enter 鍵提交支援 (Ctrl+Enter)
      editor.keyboard.addBinding({
        key: 'Enter',
        ctrlKey: true
      }, () => {
        if (content.value.trim() && !isSubmitting.value) {
          handleSubmit()
        }
        return false
      })

      // ESC 鍵關閉支援
      editor.keyboard.addBinding({
        key: 'Escape'
      }, () => {
        handleCancel()
        return false
      })
    }
  })
}

// 全局鍵盤事件監聽器
const handleGlobalKeydown = (event: KeyboardEvent) => {
  // 在模態開啟時處理全局鍵盤事件
  if (!props.modalVisible) return

  // ESC 鍵關閉模態
  if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  }
}

// 監聽全局鍵盤事件
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleGlobalKeydown)

  // 清理函式（當組件銷毀時）
  const cleanup = () => {
    window.removeEventListener('keydown', handleGlobalKeydown)
  }

  // Vue 3 的 onUnmounted
  onUnmounted(cleanup)
}

const handlePaste = async (event: ClipboardEvent) => {
  const clipboardData = event.clipboardData
  if (!clipboardData) return

  //從剪貼簿抓圖片檔案(部分瀏覽器會放在items，有些會放在files)
  const imageFiles: File[] = []

  const items = Array.from(clipboardData.items || [])
  for (const item of items) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const f = item.getAsFile()
      if (f) imageFiles.push(f)
    }
  }

  //有些瀏覽器會同時在items與files提供相同圖片，避免重複插入：
  // - 優先使用items
  // - 若items沒拿到圖片，才從files讀取
  if (imageFiles.length === 0) {
    const files = Array.from(clipboardData.files || [])
    for (const f of files) {
      if (f.type.startsWith('image/')) imageFiles.push(f)
    }
  }

  //沒有圖片就交給Quill預設貼上流程
  if (imageFiles.length === 0) return

  //攔截貼上，避免Quill預設把圖片轉成 base64 直接塞進內容
  event.preventDefault()

  const editor = quillEditor.value?.getQuill()
  if (!editor) return

  //若剪貼簿同時有純文字，手動補上，避免preventDefault導致文字沒有貼上
  const plainText = clipboardData.getData('text/plain')
  let insertIndex = (editor.getSelection() || { index: editor.getLength(), length: 0 }).index

  if (plainText) {
    editor.insertText(insertIndex, plainText)
    insertIndex += plainText.length
    editor.setSelection(insertIndex, 0)
  }

  //本地預覽+暫存：用blob URL先插入佔位符，提交時再替換
  for (const file of imageFiles) {
    const id = createStagedImageId()
    const localUrl = URL.createObjectURL(file)

    stagedImages.value.push({ id, file, localUrl })

    const altText = file.name || '貼上圖片'
    const markdown = `\n![${altText}](${localUrl})\n`

    editor.insertText(insertIndex, markdown)
    insertIndex += markdown.length
    editor.setSelection(insertIndex, 0)
  }

  editor.focus()
}



</script>

<style scoped>
/* ==========================================
   Design System Variables
   ========================================== */
.reply-modal-container {
  --padding-1: 1rem;
  --padding-2: 2rem;
  --padding-3: 3rem;
  --padding-4: 4rem;
  --padding-5: 5rem;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;

  /* Core Colors */
  --primary-500: #007AFF;
  --primary-600: #0066CC;
  --primary-50: rgba(0, 122, 255, 0.1);
  --primary-100: rgba(0, 122, 255, 0.2);
  --primary-200: rgba(0, 122, 255, 0.3);

  /* Grayscale */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;

  /* Dark Theme Palette */
  --surface-primary: #1A1A1A;
  --surface-secondary: #2A2A2A;
  --surface-tertiary: #333333;
  --surface-elevated: #3A3A3A;
  --surface-hover: #444444;
  --surface-active: #555555;

  /* Text Colors */
  --text-primary: #F2F2F2;
  --text-secondary: #CCCCCC;
  --text-tertiary: #999999;
  --text-quaternary: #888888;
  --text-disabled: #666666;

  /* Semantic Colors */
  --success-500: #10B981;
  --warning-500: #F59E0B;
  --error-500: #EF4444;






  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* Border Colors & Effects */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-muted: rgba(255, 255, 255, 0.12);
  --border-default: rgba(255, 255, 255, 0.16);
  --border-strong: rgba(255, 255, 255, 0.24);
  --border-primary: var(--primary-500);
  --border-primary-hover: var(--primary-400);

  /* Gradient Borders */
  --gradient-border-primary: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  --gradient-border-subtle: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --shadow-modal: 0 -4px 24px rgba(0, 0, 0, 0.3);

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-smooth: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  --transition-bounce: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}



/* ==========================================
   Modal Animations
   ========================================== */
.reply-modal-enter-active,
.reply-modal-leave-active {
  transition: all var(--transition-smooth);
}

.reply-modal-enter-from,
.reply-modal-leave-to {
  opacity: 0;
}

.reply-modal-enter-from .reply-modal-container,
.reply-modal-leave-to .reply-modal-container {
  transform: translateY(100%);
}

/* ==========================================
   Modal Layout
   ========================================== */
.reply-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.reply-modal-container {
  width: 92%;
  max-width: 850px;
  max-height: 75vh;
  background: var(--surface-secondary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow:
    var(--shadow-modal),
    0 0 0 1px var(--border-default),
    inset 0 1px 0 var(--border-subtle);
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  animation: slideUp var(--transition-smooth);
  border: 1px solid white;
  position: relative;

}

.reply-modal-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-border-primary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}




/* ==========================================
   Smart Toolbar
   ========================================== */
.smart-toolbar {
  padding: var(--space-4) var(--space-6);
  background: var(--surface-tertiary);
  border-bottom: 1px solid var(--border-default);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  gap: var(--space-8);
  overflow-x: auto;
  scrollbar-width: none;
  position: relative;
}

.smart-toolbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gradient-border-subtle);
  opacity: 0.7;
}

.smart-toolbar::-webkit-scrollbar {
  display: none;
}

.toolbar-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
  min-width: 0;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.02);
  transition: all var(--transition-base);
  min-height: 80px;

}

.toolbar-group:hover {
  border-color: var(--border-muted);
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.group-label {
  color: var(--text-quaternary);
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-left: var(--space-1);
}

.tool-buttons {
  display: flex;
  gap: var(--space-1);
  align-items: center;
}

.tool-btn {
  background: var(--surface-hover);
  border: 1px solid var(--border-muted);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  padding: var(--space-2);
  cursor: pointer;
  transition: all var(--transition-base);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 0 var(--border-subtle);
}

.tool-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left var(--transition-base);
}

.tool-btn:hover {
  background: var(--surface-active);
  border-color: var(--border-primary);
  color: var(--text-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md), 0 0 0 1px var(--border-primary-hover);
}

.tool-btn:hover::before {
  left: 100%;
}

.tool-btn.active {
  background: var(--gradient-border-primary);
  border-color: var(--primary-600);
  color: white;
  box-shadow: 0 0 0 2px var(--primary-100), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
}

.tool-btn.active::after {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: calc(var(--radius-md) - 1px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent 50%);
  pointer-events: none;
}

.tool-btn:active {
  transform: translateY(0) scale(0.98);
}

.tool-icon {
  width: 18px;
  height: 18px;
  transition: transform var(--transition-base);
}

.tool-btn:hover .tool-icon {
  transform: scale(1.1);
}

.help-btn:hover {
  background: var(--warning-500);
  border-color: var(--warning-500);
}

/* ==========================================
   Editor Container
   ========================================== */
.editor-container {
  flex: 0 0 auto;
  padding: 0 var(--space-6) var(--space-5);
  min-height: 220px;
  height: 220px;
  overflow: hidden;
  border-top: 1px solid #e0e0e0;
  /* 設定上邊框 */
  border-bottom: 1px solid #e0e0e0;
  /* 設定下邊框 */
  overflow-y: auto;
}

:deep(.ql-container) {
  border: none !important;
  font-size: 15px;
  line-height: 1.6;
  background: transparent;
  color: var(--text-primary);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

:deep(.ql-editor) {
  border: none;
  padding: var(--space-4);
  background: var(--surface-primary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-default);
  min-height: 240px;
  color: var(--text-primary);
  transition: all var(--transition-base);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

:deep(.ql-editor)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gradient-border-subtle);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

:deep(.ql-editor.ql-blank::before) {
  color: var(--text-quaternary);
  font-style: normal;
  font-weight: 400;
}

:deep(.ql-editor:focus) {
  border-color: var(--border-primary);
  box-shadow:
    0 0 0 3px var(--primary-100),
    0 4px 12px rgba(0, 122, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  outline: none;
  background: var(--surface-secondary);
}

:deep(.ql-editor strong) {
  color: var(--text-primary);
  font-weight: 700;
}

:deep(.ql-editor em) {
  color: var(--text-secondary);
  font-style: italic;
}

:deep(.ql-editor code) {
  background: var(--surface-tertiary);
  color: var(--primary-500);
  padding: 2px 4px;
  border-radius: var(--radius-sm);
  font-family: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
}

/* ==========================================
   Action Buttons
   ========================================== */
.action-buttons {
  padding: var(--space-4) var(--space-6) var(--space-6);
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}

.cancel-btn,
.submit-btn {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  border: none;
  min-width: 120px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.cancel-btn {
  background: var(--surface-hover);
  color: var(--text-secondary);
  border: 2px solid var(--border-default);
  box-shadow: inset 0 1px 0 var(--border-subtle);
}

.cancel-btn:hover {
  background: var(--surface-active);
  color: var(--text-primary);
  border-color: var(--border-strong);
  transform: translateY(-1px);
  box-shadow:
    var(--shadow-md),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.submit-btn {
  background: var(--gradient-border-primary);
  color: white;
  border: 2px solid var(--primary-600);
  box-shadow:
    var(--shadow-md),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left var(--transition-base);
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-600), #0052CC);
  border-color: var(--primary-500);
  transform: translateY(-2px);
  box-shadow:
    var(--shadow-lg),
    0 0 20px var(--primary-200),
    0 0 0 1px var(--border-primary-hover),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.submit-btn:disabled {
  background: var(--surface-hover);
  color: var(--text-disabled);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.submit-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

/* ==========================================
   Responsive Design
   ========================================== */
@media (max-width: 640px) {
  .reply-modal-container {
    width: 100%;
    max-height: 85vh;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    border: 1px solid white;
  }

  .smart-toolbar {
    padding: var(--space-3) var(--space-4);
    gap: var(--space-6);
  }

  .toolbar-group {
    min-width: auto;
  }

  .action-buttons {
    flex-direction: column-reverse;
    gap: var(--space-3);
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .reply-header {
    padding: var(--space-4) var(--space-4) var(--space-3);
  }

  .close-btn {
    top: var(--space-3);
    right: var(--space-4);
  }

  .editor-container {
    padding: 0 var(--space-4) var(--space-4);

  }

  .action-buttons {
    padding: var(--space-3) var(--space-4) var(--space-4);
  }
}

.pasted-images-preview {
  margin-top: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.pasted-images-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.pasted-images-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.pasted-images-hint {
  font-size: 12px;
  color: var(--text-tertiary);
}

.pasted-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.pasted-image-card {
  overflow: hidden;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.pasted-image {
  display: block;
  width: 100%;
  height: 110px;
  object-fit: cover;
}

.pasted-image-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
}

.pasted-image-name {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pasted-image-remove {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--primary-500);
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.pasted-image-remove:hover {
  color: var(--primary-600);
}
</style>
