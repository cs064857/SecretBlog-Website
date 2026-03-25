import { fetchEventSource } from '@microsoft/fetch-event-source'

/**
 * 從Cookie中取得JWT Token
 */
function getJwtToken(): string | null {
    const cookieArray = String(document.cookie || '').split(';')
    for (const cookieString of cookieArray) {
        const cookie = cookieString.trim()
        if (cookie.startsWith('jwtToken=')) {
            return cookie.substring('jwtToken='.length)
        }
    }
    return null
}

/**
 * RAG引用資訊
 */
export interface CitationItem {
    index: number
    articleId: string
    textSnippet: string
}

export interface StreamChatCallbacks {
    onCitations?: (citations: CitationItem[]) => void
    onToken: (token: string) => void
    onDone: () => void
    onError: (error: unknown) => void
}

/**
 * 透過SSE串流調用advancedRAGChatStream端點，逐token回傳AI回覆。
 * 支援三種SSE事件型態：citations(引用來源)、message(文字串流)、done(完成)。
 * 回傳AbortController供取消使用。
 */
export function streamChat(
    memoryId: string,
    userMessage: string,
    callbacks: StreamChatCallbacks
): AbortController {
    const ctrl = new AbortController()

    const baseUrl = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api`
        : '/api'

    const params = new URLSearchParams({ memoryId, userMessage })

    const jwtToken = getJwtToken()
    const headers: Record<string, string> = {
        'Accept': 'text/event-stream',
    }
    if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`
    }

    fetchEventSource(`${baseUrl}/ams/ai/chat/stream?${params.toString()}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        signal: ctrl.signal,
        //避免庫在收到非200回應時自動重連
        openWhenHidden: true,
        onmessage(ev) {
            //根據SSE事件名稱分派處理
            if (ev.event === 'citations') {
                try {
                    const citations: CitationItem[] = JSON.parse(ev.data)
                    callbacks.onCitations?.(citations)
                } catch (e) {
                    console.warn('Citations JSON解析失敗:', e)
                }
                return
            }
            if (ev.event === 'done' || ev.data === '[DONE]') {
                callbacks.onDone()
                ctrl.abort()
                return
            }
            //event === 'message'或預設事件
            callbacks.onToken(ev.data)
        },
        onerror(err) {
            callbacks.onError(err)
            //不重試，直接拋出以結束連線
            throw err
        },
        onclose() {
            callbacks.onDone()
        },
    }).catch((err) => {
        //fetchEventSource的Promise在onerror拋出後或abort後會reject
        if (ctrl.signal.aborted) return
        callbacks.onError(err)
    })

    return ctrl
}
