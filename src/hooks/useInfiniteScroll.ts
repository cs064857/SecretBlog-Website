import { ref, type Ref } from 'vue';
import type { ScrollbarDirection } from 'element-plus';

/**
 * 無限滾動分頁邏輯的共用 composable
 */
export interface UseInfiniteScrollOptions<T> {
    /** 獲取資料的 API 函式 */
    fetchData: (page: number) => Promise<{
        records: T[];
        current: number;
        pages: number;
    } | T[] | null>;
}

export interface UseInfiniteScrollReturn<T> {
    /** 資料列表 */
    items: Ref<T[]>;
    /** 當前頁碼 (0-indexed) */
    page: Ref<number>;
    /** 是否正在載入 */
    isLoading: Ref<boolean>;
    /** 是否已到最後一頁 */
    isLast: Ref<boolean>;
    /** 載入資料函式 */
    load: () => Promise<void>;
    /** 無限滾動觸發函式 */
    loadMore: (direction: ScrollbarDirection) => void;
    /** 重置狀態 */
    reset: () => void;
}

/**
 * 無限滾動分頁 composable
 * @param options 配置選項
 * @returns 響應式狀態與方法
 */
export function useInfiniteScroll<T>(
    options: UseInfiniteScrollOptions<T>
): UseInfiniteScrollReturn<T> {
    const items = ref<T[]>([]) as Ref<T[]>;
    const page = ref(0);
    const isLoading = ref(false);
    const isLast = ref(false);

    /**
     * 載入資料
     */
    const load = async () => {
        if (isLoading.value || isLast.value) return;

        isLoading.value = true;
        console.log(`[useInfiniteScroll] 載入資料，page: ${page.value}`);

        try {
            const result = await options.fetchData(page.value);

            if (result === null) {
                // API 調用失敗
                return;
            }

            if (Array.isArray(result)) {
                // 非分頁格式：一次性載入全部
                items.value = result;
                isLast.value = true;
            } else {
                // 分頁格式 (MyBatis-Plus IPage)
                items.value.push(...result.records);
                isLast.value = result.current >= result.pages;
                if (!isLast.value) {
                    page.value += 1;
                }
            }
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * 無限滾動觸發處理
     * @param direction 滾動方向
     */
    const loadMore = (direction: ScrollbarDirection) => {
        console.log('[useInfiniteScroll] loadMore 觸發，方向:', direction);
        if (direction === 'bottom' && !isLoading.value && !isLast.value) {
            load();
        }
    };

    /**
     * 重置狀態
     */
    const reset = () => {
        items.value = [];
        page.value = 0;
        isLoading.value = false;
        isLast.value = false;
    };

    return {
        items,
        page,
        isLoading,
        isLast,
        load,
        loadMore,
        reset
    };
}

/**
 * 格式化日期顯示
 * @param dateStr 日期字串
 * @returns 格式化後的日期字串
 */
export const formatDate = (dateStr: string): string => {
    if (!dateStr) return '未知';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};
