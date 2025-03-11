export interface ArticleInter{
    id:string
    title:string
    content:string
    user:bigint
    categoryId:bigint
    tag_id:bigint
    is_show:number
    create_time:Date
    update_time:Date
}
export type Articles = ArticleInter[]
