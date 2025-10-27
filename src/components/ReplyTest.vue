<template>
    <reply-modal :replyToUser="currentReplyUser">
        <template #header>
            <!-- 評論功能：智能回覆提示區 -->
            <!-- <div v-if="props.model == 'replyComment' ? true : false" class="reply-header"> -->
            <div class="reply-header">
                <div class="reply-info">
                    <span class="reply-text">正在回覆</span>
                    <span class="reply-username">@{{ currentReplyUser.username }}</span>
                </div>
                <div class="original-comment">
                    {{ currentReplyUser.commentContent }}
                    <!-- {{ truncateText(currentReplyUser.commentContent, 50) }} -->
                </div>
                <!-- <button class="close-btn" @click="handleCancel">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </button> -->
            </div>
        </template>
    </reply-modal>


</template>

<script setup lang="ts">
import ReplyModal from './ReplyModal.vue';
import { ref } from 'vue';
const currentReplyUser = ref(null);
currentReplyUser.value = {
    title: "title",
    articleId: "123456",
    categoryId: "7891011",
    commentContent: "測試內容",
    amsArticleTagsVoList:
        [
            {
                "id": "1",
                "name": "測試標籤1"
            }

        ]
};

</script>

<style scoped></style>
