export interface AmsUserCommentVo {
    articleId: string;
    commentId: string;
    commentContent: string;
    articleTitle: string;
    avatar?: string;  // 作者頭像
    createAt: string;
    updateAt: string;
}
