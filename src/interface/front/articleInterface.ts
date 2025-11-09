// export interface ArticleInter{
//     id:string
//     title:string
//     content:string
//     user:bigint
//     categoryId:bigint
//     tag_id:bigint
//     is_show:number
//     create_time:Date
//     update_time:Date
// }
// export type Articles = ArticleInter[]

/**
 * 代表標籤與文章關聯的物件介面
 */
export interface AmsArtTag {
    id: string;
    articleId: string;
    tagsId: string;
    createAt: Date; // 或 string，取決於您是否在接收後立即轉換
    updateAt: Date; // 或 string
  }
  
  /**
   * 更新後的文章物件介面，對應後端回傳的 records 陣列中的單一元素
   */
  export interface ArticleInter {
    // --- 與後端 JSON 對應的新增/修改欄位 ---
    userId: bigint;
    categoryId: bigint;
    title: string | null;
    nickName: string | null;
    avatar: string | null;
    // accountName: string | null;
    categoryName: string;
    amsArtTagVoList: AmsArtTag[];
    createTime: Date; // 原 create_time
    updateTime: Date; // 原 update_time
    viewsCount: number;
    likesCount: number;
    bookmarksCount: number;
  
    // --- 原有但新 JSON 中不存在的欄位 (設為可選) ---
    articleId?: string; // 注意：文章 ID 現在可能存在於 amsArtTagVoList[].articleId 中
    content?: string;
    tag_id?: bigint; // 已被 amsArtTagVoList 取代
    is_show?: number;
  }
  
  /**
   * 文章列表的類型別名 (保持不變，仍然有用)
   */
  export type Articles = ArticleInter[];
  
  /**
   * API 回應的完整結構，包含分頁資訊
   */
  export interface PaginatedArticleResponse {
    records: ArticleInter[];
    total: number;
    size: number;
    current: number;
    pages: number;
  }
  