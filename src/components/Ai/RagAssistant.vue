<template>
  <div class="rag-assistant">
    <!-- Sidebar -->
    <el-aside class="chat-sidebar" width="260px">
      <div class="sidebar-header">
        <router-link to="/" class="back-link">
          <el-icon><Back /></el-icon> 返回
        </router-link>
        <el-button class="new-chat-btn" color="#2f2f2f" dark @click="handleNewChat">
          <el-icon><Plus /></el-icon> 新問題
        </el-button>
      </div>
      <div class="sidebar-content">
        <ul v-if="chatSessions.length > 0" class="session-list">
          <li v-for="session in chatSessions" :key="session.id" 
              :class="['session-item', { active: currentMemoryId === session.id }]"
              @click="loadSession(session)">
            <div class="session-info">
              <span class="session-title">{{ session.title }}</span>
              <span class="session-date">{{ formatDate(session.updatedAt) }}</span>
            </div>
            <el-icon class="delete-icon" @click.stop="deleteSession(session.id)"><Delete /></el-icon>
          </li>
        </ul>
        <p v-else class="history-placeholder">機器人對話記錄將顯示在這裡。</p>
      </div>
    </el-aside>


    <el-main class="chat-main">

      <!-- 聊天訊息列表(有訊息時顯示) -->
      <div v-if="messages.length" class="chat-messages" ref="messagesContainer">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message-row"
          :class="msg.role"
        >
          <div class="message-avatar">
            <span v-if="msg.role === 'user'">👤</span>
            <span v-else>🤖</span>
          </div>
          <div class="message-content">
            <p class="message-text" v-html="formatCitationLinks(msg.content, index)"></p>
            <span v-if="msg.role === 'assistant' && msg.streaming" class="streaming-cursor">▊</span>

            <!-- 參考文獻區塊 -->
            <div
              v-if="msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && !msg.streaming"
              class="citations-section"
            >
              <div class="citations-label">📚 參考文獻</div>
              <div class="citations-list">
                <div
                  v-for="cite in msg.citations"
                  :key="cite.index"
                  :id="`cite-${index}-${cite.index}`"
                  class="citation-item"
                >
                  <router-link
                    v-if="cite.articleId"
                    :to="`/article/${cite.articleId}`"
                    class="citation-link"
                    :title="cite.textSnippet"
                  >
                    <span class="citation-badge">[{{ cite.index }}]</span>
                    <span class="citation-snippet">{{ cite.textSnippet }}</span>
                  </router-link>
                  <span v-else class="citation-no-link" :title="cite.textSnippet">
                    <span class="citation-badge">[{{ cite.index }}]</span>
                    <span class="citation-snippet">{{ cite.textSnippet }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空白狀態(無訊息時顯示) -->
      <div v-else class="chat-empty-state">
        <h1 class="greeting">我能幫上什麼忙？</h1>
      </div>

      <!-- 輸入區域(始終固定在底部) -->
      <div class="input-container" :class="{ 'has-messages': messages.length > 0 }">
        <div class="input-wrapper">
          <div class="input-icon left">
            <el-icon><Upload /></el-icon>
          </div>
          <input
            type="text"
            class="chat-input"
            placeholder="提問..."
            v-model="inputText"
            :disabled="isStreaming"
            @keyup.enter="handleSend"
          />
          <div
            class="input-icon right"
            :class="{ disabled: !inputText.trim() || isStreaming }"
            @click="handleSend"
          >
            <el-icon v-if="!isStreaming"><Promotion /></el-icon>
            <el-icon v-else class="is-loading"><Loading /></el-icon>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, onUnmounted } from 'vue'
import { Back, Plus, Upload, Promotion, Loading, Delete } from '@element-plus/icons-vue'
import { streamChat } from '@/api/ai'
import type { CitationItem } from '@/api/ai'
import { ElMessage } from 'element-plus'

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
    streaming?: boolean
    citations?: CitationItem[]
}

interface ChatSession {
    id: string;
    title: string;
    updatedAt: number;
    messages: ChatMessage[];
}

const STORAGE_KEY = 'rag_chat_sessions';
const chatSessions = ref<ChatSession[]>([]);

const inputText = ref('')
const messages = ref<ChatMessage[]>([])
const isStreaming = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const currentMemoryId = ref(crypto.randomUUID())

let abortController: AbortController | null = null

function scrollToBottom() {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    })
}

//將AI回覆中的[N]轉為可點擊的錨點連結
function formatCitationLinks(text: string, msgIndex: number): string {
    if (!text) return ''
    return text.replace(/\[(\d+)\]/g, `<a class="citation-anchor" href="#cite-${msgIndex}-$1">[$1]</a>`)

}


function saveToLocalStorage() {
    if (messages.value.length === 0) return;

    const index = chatSessions.value.findIndex(s => s.id === currentMemoryId.value);
    const firstUserMsg = messages.value.find(m => m.role === 'user');
    const title = firstUserMsg ? firstUserMsg.content.slice(0, 15) + (firstUserMsg.content.length > 15 ? '...' : '') : '新對話';

    const sessionData: ChatSession = {
        id: currentMemoryId.value,
        title,
        updatedAt: Date.now(),
        messages: JSON.parse(JSON.stringify(messages.value))
    };

    if (index !== -1) {
        chatSessions.value[index] = sessionData;
    } else {
        chatSessions.value.unshift(sessionData); 
    }
    
    chatSessions.value.sort((a, b) => b.updatedAt - a.updatedAt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatSessions.value));
}

function loadSession(session: ChatSession) {
    if (isStreaming.value) {
        ElMessage.warning('目前有對話正在進行中，請稍後再切換');
        return;
    }
    currentMemoryId.value = session.id;
    messages.value = JSON.parse(JSON.stringify(session.messages));
    scrollToBottom();
}

function deleteSession(id: string) {
    if (isStreaming.value && currentMemoryId.value === id) {
        ElMessage.warning('此對話進行中，無法刪除');
        return;
    }
    chatSessions.value = chatSessions.value.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatSessions.value));
    if (currentMemoryId.value === id) {
        handleNewChat();
    }
}

function formatDate(timestamp: number) {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

const handleBeforeUnload = () => {
    if (messages.value.length > 0) {
        saveToLocalStorage();
    }
}

onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            chatSessions.value = JSON.parse(saved);
        } catch(e) {
            console.error('Failed to parse chat sessions', e);
            chatSessions.value = [];
        }
    }
    if (chatSessions.value.length > 0) {
        loadSession(chatSessions.value[0]);
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
})

const handleSend = () => {
    const text = inputText.value.trim()
    if (!text || isStreaming.value) return

    //推入使用者訊息
    messages.value.push({ role: 'user', content: text })
    inputText.value = ''

    //建立AI回覆佔位，必須使用reactive以維持獨立響應性
    const aiMessage = reactive<ChatMessage>({ role: 'assistant', content: '', streaming: true })
    messages.value.push(aiMessage as ChatMessage)
    isStreaming.value = true
    scrollToBottom()
    saveToLocalStorage()

    abortController = streamChat(currentMemoryId.value, text, {
        onCitations(citations: CitationItem[]) {
            aiMessage.citations = citations
        },
        onToken(token: string) {
            aiMessage.content += token
            scrollToBottom()
        },
        onDone() {
            aiMessage.streaming = false
            isStreaming.value = false
            abortController = null
            scrollToBottom()
            saveToLocalStorage()
        },
        onError(err: unknown) {
            aiMessage.streaming = false
            isStreaming.value = false
            abortController = null
            if (aiMessage.content) {
                aiMessage.content += '\n\n⚠️ 回覆中斷'
            } else {
                aiMessage.content = '⚠️ 發生錯誤，請稍後再試'
            }
            ElMessage.error('AI回覆失敗，請檢查網路連線')
            console.error('SSE stream error:', err)
            scrollToBottom()
            saveToLocalStorage()
        },
    })
}

const handleNewChat = () => {
    //中止進行中的串流
    if (abortController) {
        abortController.abort()
        abortController = null
    }
    messages.value = []
    isStreaming.value = false
    inputText.value = ''
    currentMemoryId.value = crypto.randomUUID()
}

onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    if (abortController) {
        abortController.abort()
        abortController = null
    }
    if (messages.value.length > 0) {
        saveToLocalStorage();
    }
})
</script>

<style scoped>
.rag-assistant {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  background-color: #212121;
  color: #ececf1;
}

/* Sidebar History styles */
.session-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.session-list::-webkit-scrollbar {
  width: 6px;
}
.session-list::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.session-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.session-item.active {
  background-color: rgba(255, 255, 255, 0.1);
}

.session-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.session-title {
  font-size: 14px;
  color: #ececf1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.session-date {
  font-size: 11px;
  color: #8e8ea0;
}

.delete-icon {
  color: #8e8ea0;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: color 0.2s, background-color 0.2s;
  flex-shrink: 0;
}

.delete-icon:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.chat-sidebar {
  background-color: #171717;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.back-link {
  color: #c5c5d2;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
}

.back-link:hover {
  color: #ececf1;
}

.new-chat-btn {
  width: 100%;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  justify-content: flex-start;
  padding: 20px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #ececf1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10px;
}

.history-placeholder {
  color: #8e8ea0;
  font-size: 12px;
  text-align: center;
  padding: 0 10px;
}

.chat-main {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: #212121;
  overflow: hidden;
}

/* 聊天訊息列表 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 0;
  scroll-behavior: smooth;
}

.message-row {
  display: flex;
  gap: 16px;
  padding: 12px 24px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.message-row.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #2f2f2f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message-content {
  max-width: 75%;
  padding: 10px 16px;
  border-radius: 12px;
  line-height: 1.6;
  font-size: 15px;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-row.user .message-content {
  background-color: #2f2f2f;
  border-top-right-radius: 4px;
}

.message-row.assistant .message-content {
  background-color: transparent;
}

.message-text {
  margin: 0;
}

/* v-html動態插入的錨點連結(需:deep穿透scoped) */
.message-text :deep(.citation-anchor) {
  color: #60a5fa;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.15s;
}

.message-text :deep(.citation-anchor:hover) {
  color: #93c5fd;
  text-decoration: underline;
}

/* 錨點跳轉後的高亮動畫 */
.citation-item:target {
  animation: highlight-fade 1.5s ease;
}

@keyframes highlight-fade {
  0% { background-color: rgba(96, 165, 250, 0.25); }
  100% { background-color: transparent; }
}

.streaming-cursor {
  display: inline-block;
  animation: blink 0.7s infinite;
  color: #c5c5d2;
  font-size: 14px;
  vertical-align: text-bottom;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 參考文獻區塊 */
.citations-section {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.citations-label {
  font-size: 13px;
  font-weight: 600;
  color: #a1a1aa;
  margin-bottom: 8px;
}

.citations-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.citation-item {
  display: flex;
  align-items: flex-start;
}

.citation-link,
.citation-no-link {
  display: inline-flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  line-height: 1.5;
  color: #8e8ea0;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.15s, color 0.15s;
}

.citation-link:hover {
  background-color: rgba(255, 255, 255, 0.06);
  color: #ececf1;
}

.citation-badge {
  color: #60a5fa;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.citation-snippet {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 空白狀態 */
.chat-empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 25vh;
}

.greeting {
  font-size: 28px;
  font-weight: 600;
  color: #ececf1;
  margin-bottom: 24px;
}

/* 輸入區域 */
.input-container {
  width: 100%;
  max-width: 800px;
  padding: 0 20px 24px;
  margin: 0 auto;
}

.input-container.has-messages {
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.input-wrapper {
  background-color: #2f2f2f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 10px 14px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  transition: border-color 0.2s, background-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: rgba(255, 255, 255, 0.3);
  background-color: #333;
}

.input-icon {
  color: #c5c5d2;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 8px;
}

.input-icon.left {
  margin-right: 8px;
}

.input-icon.left:hover {
  background-color: #40414f;
  color: #ececf1;
}

.input-icon.right {
  margin-left: 8px;
  background-color: #ececf1;
  color: #212121;
  font-size: 18px;
  padding: 8px;
}

.input-icon.right:hover:not(.disabled) {
  background-color: #fff;
}

.input-icon.right.disabled {
  background-color: #40414f;
  color: #8e8ea0;
  cursor: not-allowed;
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #ececf1;
  font-size: 16px;
  padding: 4px 0;
  outline: none;
  min-width: 0;
  line-height: 1.5;
}

.chat-input::placeholder {
  color: #8e8ea0;
}

.chat-input:disabled {
  opacity: 0.6;
}
</style>