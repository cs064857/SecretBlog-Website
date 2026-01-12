import http from "@/utils/httpRequest.js";
import { R } from "@/interface/R";


export interface UmsUserInbox {
    id: string;
    toUserId: string;
    fromUserId?: string;
    fromAvatar?: string; // 新增
    fromNickName?: string; // 新增
    type: string;
    subject?: string;
    body?: string;
    articleId?: string;
    readFlag: number; // 0: 未讀, 1: 已讀
    readAt?: string;
    deleted: number;
    createAt: string;
    updateAt: string;
}

export interface Page<T> {
    records: T[];
    total: number;
    size: number;
    current: number;
    pages: number;
}

export interface InboxListParams {
    routePage?: number;
    onlyUnread?: boolean;
}

/**
 * 獲取收件匣列表
 * 路徑假設為 /ums/user/inbox/list，對應後端 GetMapping("/list")
 */
export function getInboxList(params: InboxListParams) {
    return http({
        url: http.adornUrl('/ums/user/inbox/list'),
        method: 'get',
        params: http.adornParams(params)
    }).then(({ data }: { data: R<Page<UmsUserInbox>> }) => {
        return data;
    });
}

/**
 * 標記單則訊息為已讀
 * 路徑假設為 /ums/user/inbox/read/{id}，對應後端 PutMapping("/read/{id}")
 */
export function markInboxAsRead(id: string) {
    return http({
        url: http.adornUrl(`/ums/user/inbox/read/${encodeURIComponent(String(id))}`),
        method: 'put',
    }).then(({ data }: { data: R<void> }) => {
        return data;
    });
}

/**
 * 標記所有訊息為已讀
 * 路徑假設為 /ums/user/inbox/read-all，對應後端 PutMapping("/read-all")
 */
export function markAllAsRead() {
    return http({
        url: http.adornUrl('/ums/user/inbox/read-all'),
        method: 'put',
    }).then(({ data }: { data: R<void> }) => {
        return data;
    });
}
