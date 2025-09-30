<template>
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
</template>
<script setup lang="ts">

// Props
interface ReplyToUserInterface {
  username: string
  commentContent: string
  commentId: string
  articleId: string
}

interface Props {
  replyToUser: ReplyToUserInterface
}

import {ref} from "vue"


const props = withDefaults(defineProps<Props>(), {
  replyToUser: () => ({
    username: '',
    commentContent: '',
    commentId: '',
    articleId: ''
  })
})

const replyToUser = ref(props.replyToUser)

// Methods
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

</script>

<style lang="scss" scoped>

</style>