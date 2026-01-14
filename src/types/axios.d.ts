import 'axios'

declare module 'axios' {
    export interface AxiosRequestConfig {
        /**
         * 若為 true，遇到 401 時不自動導回登入頁（例如登入狀態檢查）。
         */
        skipAuthRedirect?: boolean

        /**
         * 若為 true，不顯示全域的未授權/權限不足提示。
         */
        skipAuthErrorMessage?: boolean
    }

    export interface AxiosInstance {
        /**
         * 統一處理 API 路徑（前端一律走同源 /api，避免瀏覽器 CORS）。
         */
        adornUrl(actionName: string): string

        /**
         * 統一處理 GET 參數，預設會附帶時間戳避免快取。
         */
        adornParams(params?: Record<string, any>, openDefaultParams?: boolean): Record<string, any>

        /**
         * 統一處理 POST/PUT 資料，支援 json / form 兩種格式。
         */
        adornData(data?: Record<string, any>, openDefaultData?: boolean, contentType?: 'json' | 'form'): string
    }
}

