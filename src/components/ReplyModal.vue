<template>
  <Teleport to="body">
    <Transition name="reply-modal" appear>
      <div v-if="visible" class="reply-modal-overlay" @click="handleOverlayClick">
        <div class="reply-modal-container" @click.stop>
          <!-- 智能回覆提示區 -->
          <div class="reply-header">
            <div class="reply-info">
              <span class="reply-text">正在回覆</span>
              <span class="reply-username">@{{ replyToUser.username }}</span>
            </div>
            <div class="original-comment">
              {{ truncateText(replyToUser.commentContent, 50) }}
            </div>
            <button class="close-btn" @click="handleCancel">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
              </svg>
            </button>
          </div>

          <!-- Markdown工具列 -->
          <div class="markdown-toolbar">
            <button 
              v-for="tool in markdownTools" 
              :key="tool.name"
              class="toolbar-btn"
              :title="tool.title"
              @click="insertMarkdown(tool)"
            >
              {{ tool.icon }}
            </button>
          </div>

          <!-- 編輯器區域 -->
          <div class="editor-container">
            <QuillEditor
              ref="quillEditor"
              v-model:content="content"
              content-type="html"
              :options="editorOptions"
              placeholder="撰寫您的回覆..."
              @ready="onEditorReady"
            />
          </div>

          <!-- 操作按鈕 -->
          <div class="action-buttons">
            <button class="cancel-btn" @click="handleCancel">
              取消
            </button>
            <button 
              class="submit-btn" 
              @click="handleSubmit"
              :disabled="!content.trim() || isSubmitting"
            >
              {{ isSubmitting ? '發送中...' : '發表回覆' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

// Props
interface ReplyToUser {
  username: string
  commentContent: string
  commentId: string
  articleId: string
}

interface Props {
  visible: boolean
  replyToUser: ReplyToUser
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  replyToUser: () => ({
    username: '',
    commentContent: '',
    commentId: '',
    articleId: ''
  })
})

// Emits
const emit = defineEmits<{
  close: []
  submit: [content: string, replyData: ReplyToUser]
}>()

// Reactive data
const content = ref('')
const isSubmitting = ref(false)
const quillEditor = ref()

// Markdown工具列配置
const markdownTools = [
  { name: 'bold', icon: 'B', title: '粗體', syntax: '**text**' },
  { name: 'italic', icon: 'I', title: '斜體', syntax: '*text*' },
  { name: 'link', icon: '🔗', title: '連結', syntax: '[text](url)' },
  { name: 'code', icon: '< >', title: '代碼', syntax: '`code`' },
  { name: 'quote', icon: '"', title: '引用', syntax: '> quote' },
  { name: 'ul', icon: '•', title: '無序清單', syntax: '- item' },
  { name: 'ol', icon: '1.', title: '有序清單', syntax: '1. item' },
  { name: 'help', icon: '?', title: 'Markdown說明', syntax: '' }
]

// Quill編輯器配置
const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: false // 隱藏默認工具列，使用自定義的
  },
  placeholder: '撰寫您的回覆...'
}

// Methods
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const handleOverlayClick = () => {
  handleCancel()
}

const handleCancel = () => {
  if (content.value.trim() && !isSubmitting.value) {
    if (confirm('您有未儲存的內容，確定要關閉嗎？')) {
      resetModal()
      emit('close')
    }
  } else {
    resetModal()
    emit('close')
  }
}

const handleSubmit = async () => {
  if (!content.value.trim() || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    emit('submit', content.value, props.replyToUser)
    resetModal()
  } catch (error) {
    console.error('發送回覆時出錯:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetModal = () => {
  content.value = ''
  isSubmitting.value = false
}

const insertMarkdown = (tool: any) => {
  if (tool.name === 'help') {
    showMarkdownHelp()
    return
  }

  const editor = quillEditor.value?.getQuill()
  if (!editor) return

  const range = editor.getSelection()
  if (range) {
    // 獲取用戶選擇的文字，如果沒有選擇則使用空字串
    const selectedText = range.length > 0 ? editor.getText(range.index, range.length) : ''
    
    let textToInsert = tool.syntax
    let selectionStart = range.index
    let selectionEnd = range.index + textToInsert.length

    // 特殊處理不同的Markdown語法
    switch (tool.name) {
      case 'bold':
        if (selectedText) {
          textToInsert = `**${selectedText}**`
          // 如果有選擇文字，插入後不需要再選擇
          selectionStart = range.index + textToInsert.length
          selectionEnd = selectionStart
        } else {
          textToInsert = '**粗體文字**'
          selectionStart = range.index + 2
          selectionEnd = range.index + 6
        }
        break
      case 'italic':
        if (selectedText) {
          textToInsert = `*${selectedText}*`
          selectionStart = range.index + textToInsert.length
          selectionEnd = selectionStart
        } else {
          textToInsert = '*斜體文字*'
          selectionStart = range.index + 1
          selectionEnd = range.index + 5
        }
        break
      case 'link':
        if (selectedText) {
          textToInsert = `[${selectedText}](https://)`
          selectionStart = range.index + selectedText.length + 3
          selectionEnd = range.index + textToInsert.length - 1
        } else {
          textToInsert = '[連結文字](https://)'
          selectionStart = range.index + 1
          selectionEnd = range.index + 5
        }
        break
      case 'code':
        if (selectedText) {
          textToInsert = `\`${selectedText}\``
          selectionStart = range.index + textToInsert.length
          selectionEnd = selectionStart
        } else {
          textToInsert = '`代碼`'
          selectionStart = range.index + 1
          selectionEnd = range.index + 3
        }
        break
      case 'quote':
        if (selectedText) {
          textToInsert = `> ${selectedText}`
          selectionStart = range.index + textToInsert.length
          selectionEnd = selectionStart
        } else {
          textToInsert = '> 引用文字'
          selectionStart = range.index + 2
          selectionEnd = range.index + 6
        }
        break
      case 'ul':
        if (selectedText) {
          textToInsert = `- ${selectedText}`
          selectionStart = range.index + textToInsert.length
          selectionEnd = selectionStart
        } else {
          textToInsert = '- 清單項目'
          selectionStart = range.index + 2
          selectionEnd = range.index + 6
        }
        break
      case 'ol':
        if (selectedText) {
          textToInsert = `1. ${selectedText}`
          selectionStart = range.index + textToInsert.length
          selectionEnd = selectionStart
        } else {
          textToInsert = '1. 清單項目'
          selectionStart = range.index + 3
          selectionEnd = range.index + 7
        }
        break
    }

    // 如果有選擇的文字，先刪除選擇的內容，再插入新內容
    if (range.length > 0) {
      editor.deleteText(range.index, range.length)
    }
    
    editor.insertText(range.index, textToInsert)
    editor.setSelection(selectionStart, selectionEnd - selectionStart)
  }
}

const showMarkdownHelp = () => {
  alert(`Markdown 語法說明:
  
**粗體**: **文字**
*斜體*: *文字*
連結: [文字](網址)
代碼: \`代碼\`
引用: > 引用文字
無序清單: - 項目
有序清單: 1. 項目`)
}

const onEditorReady = () => {
  nextTick(() => {
    if (quillEditor.value) {
      quillEditor.value.focus()
    }
  })
}
</script>

<style scoped>
/* 彈出框動畫 */
.reply-modal-enter-active,
.reply-modal-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.reply-modal-enter-from,
.reply-modal-leave-to {
  opacity: 0;
}

.reply-modal-enter-from .reply-modal-container,
.reply-modal-leave-to .reply-modal-container {
  transform: translateY(100%);
}

/* 遮罩層 */
.reply-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

/* 主容器 */
.reply-modal-container {
  width: 90%;
  max-width: 800px;
  max-height: 70vh;
  background: #2A2A2A;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  animation: slideUp 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 回覆提示區 */
.reply-header {
  padding: 20px 24px 16px;
  background: #1E1E1E;
  border-radius: 16px 16px 0 0;
  border-bottom: 1px solid #3A3A3A;
  position: relative;
}

.reply-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.reply-text {
  color: #999;
  font-size: 14px;
}

.reply-username {
  color: #007AFF;
  font-size: 14px;
  font-weight: 500;
}

.original-comment {
  color: #CCC;
  font-size: 13px;
  line-height: 1.4;
  background: #333;
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #007AFF;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #FFF;
  background: rgba(255, 255, 255, 0.1);
}

/* Markdown工具列 */
.markdown-toolbar {
  padding: 12px 24px;
  background: #333333;
  border-bottom: 1px solid #3A3A3A;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-btn {
  background: #444;
  border: 1px solid #555;
  border-radius: 6px;
  color: #E0E0E0;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-btn:hover {
  background: #555;
  border-color: #007AFF;
  color: #FFF;
}

.toolbar-btn:active {
  transform: translateY(1px);
}

/* 編輯器區域 */
.editor-container {
  flex: 1;
  padding: 0 24px 20px;
  min-height: 200px;
  overflow: hidden;
}

:deep(.ql-container) {
  border: none !important;
  font-size: 15px;
  line-height: 1.6;
  background: transparent;
  color: #F2F2F2;
}

:deep(.ql-editor) {
  border: none;
  padding: 16px;
  background: #1A1A1A;
  border-radius: 12px;
  border: 1px solid #3A3A3A;
  min-height: 120px;
  color: #F2F2F2;
}

:deep(.ql-editor.ql-blank::before) {
  color: #888;
  font-style: normal;
}

:deep(.ql-editor:focus) {
  border-color: #007AFF;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
  outline: none;
}

/* 操作按鈕 */
.action-buttons {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.cancel-btn,
.submit-btn {
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 100px;
}

.cancel-btn {
  background: #444;
  color: #CCC;
  border: 1px solid #555;
}

.cancel-btn:hover {
  background: #555;
  color: #FFF;
}

.submit-btn {
  background: #007AFF;
  color: #FFF;
}

.submit-btn:hover:not(:disabled) {
  background: #0066CC;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.submit-btn:disabled {
  background: #444;
  color: #888;
  cursor: not-allowed;
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}
</style>