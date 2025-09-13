import { AmsArticlePreviewVoListInterface } from "./amsArticlePreviewVoInterface"

export interface amsListRecordsInterface {

    
    AmsArticlePreviewVo: AmsArticlePreviewVoListInterface
    total: number
    size: number
    current: number
    pages: number
}

export type AmsListRecordsListInterface = amsListRecordsInterface[];