import { AmsArtTagListInterface } from "./amsArtTagInterface"


export interface AmsArticlePreviewVoInterface {
    title: string
    articleId: string
    username: string
    userId: string
    avatar: string
    accountName: string
    categoryName: string
    categoryId: string
    amsArtTagList: AmsArtTagListInterface
    createTime: string
    updateTime: string
    viewsCount: number
    likesCount: number
    bookmarksCount: number

}

export type AmsArticlePreviewVoListInterface = AmsArticlePreviewVoInterface[];