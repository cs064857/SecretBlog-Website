import { UmsUserInbox } from "../api/userInbox";
type SseMessageCallback = (data: any) => void //收到消息時的回調
type SseErrorCallback = (error: Error) => void //發生錯誤時的回調

class SseService {

    private eventSource: EventSource | null = null //連接對象
    private retryCount: number = 0 //重試次數
    private maxRetries: number = 5 //最大重試次數
    private retryDelay: number = 3000 //重試間隔3秒
    private onMessageCallback: SseMessageCallback | null = null //消息回調
    private onErrorCallback: SseErrorCallback | null = null //錯誤回調

    public subscribe(onMessage: SseMessageCallback, onError: SseErrorCallback) {
        this.onMessageCallback = onMessage
        this.onErrorCallback = onError
        this.connect()
    }

    private connect(): void{
        //如果已有連接則先斷開
        if(this.eventSource){
            this.disconnect();
        }
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        //創建新的SSE連接，連接到後端的訂閱端口
        this.eventSource = new EventSource(`${apiBaseUrl}/ums/user/sse/subscribe`,{ withCredentials: true })
        this.eventSource.addEventListener('open',()=>{
            console.log('SSE連接已建立')
            this.retryCount = 0; //連接成功，重置重試次數
        })
        
        this.eventSource.addEventListener('message',()=>{
            console.log('SSE收到消息')
        })

        // this.eventSource.addEventListener('user-notify',(event: MessageEvent)=>{
        //     try {
        //         const data: commentRepliedNotifyInterface = JSON.parse(event.data)
        //         console.log('SSE收到user-notify訊息',data)
        //         //調用回調函數，把資料傳遞給組件
        //         this.onMessageCallback?.(data)
        //     } catch (error) {
        //         console.error('解析user-notify訊息失敗',error)
        //     }
        // })

        this.eventSource.addEventListener('ARTICLE_REPLIED',(event: MessageEvent)=>{
            try {
                const data: UmsUserInbox = JSON.parse(event.data)
                console.log('SSE收到ARTICLE_REPLIED訊息',data)
                //調用回調函數，把資料傳遞給組件
                this.onMessageCallback?.(data)
            } catch (error) {
                console.error('解析ARTICLE_REPLIED訊息失敗',error)
            }
        })
        
        /**
         * 錯誤處理
         */
    }





    /**
     * 取消訂閱 - 組件銷毀時調用
     */
    public unsubscribe(): void {
        this.disconnect()
        this.onMessageCallback = null
        this.onErrorCallback = null
    }

    /**
     * 斷開連接
     */
    private disconnect(): void {
        if (this.eventSource) {
        this.eventSource.close()  // 關閉連接
        this.eventSource = null
        }
    }
}

// 導出單例實例，整個應用共用同一個SSE服務
export default new SseService()

