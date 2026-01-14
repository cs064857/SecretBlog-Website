// API 通用回應結構
export interface R<T = any> {
    code: string | number;
    msg?: string;
    data?: T;
}
