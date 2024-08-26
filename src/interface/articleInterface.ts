export interface ArticleInter{
    id:bigint
    title:string
    content:string
    user:bigint
    category_id:bigint
    tag_id:bigint
    is_show:number
    create_time:Date
    update_time:Date
}
export type Articles = ArticleInter[]
