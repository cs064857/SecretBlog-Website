// 從 Vue 3 框架中引入所需的響應式 API
import { ref, onMounted, onUnmounted } from 'vue';

// 匯出一個名為 useScrollMonitor 的組合式函數（composable function）
// 參數 threshold 是滾動的閾值，預設為 100 像素
export function useScrollMonitor(threshold: number = 100) {

  console.log("監控滾動距離...")

  // 使用 ref 創建響應式變數，追蹤滾動距離
  const scrollDistance = ref(0);

  // 使用 ref 創建響應式布林值，標記是否已滾動超過閾值
  const hasScrolledPastThreshold = ref(false);

  // 定義處理滾動事件的函數
  const handleScroll = () => {
    // 取得目前的滾動距離，兼容不同瀏覽器
    const currentScrollDistance = window.scrollY || document.documentElement.scrollTop;

    // 更新響應式變數的值
    scrollDistance.value = currentScrollDistance;

    // 檢查是否超過閾值
    if (currentScrollDistance > threshold && !hasScrolledPastThreshold.value) {
      // 如果超過閾值且之前沒有標記，則更新標記
      hasScrolledPastThreshold.value = true;
      // 在控制台（console）輸出訊息
      console.log(`已滾動超過 ${threshold}px`);
      // 註解：這裡可以加入需要的額外邏輯
    } else if (currentScrollDistance <= threshold && hasScrolledPastThreshold.value) {
      // 如果回到閾值以內且之前有標記，則重置標記
      hasScrolledPastThreshold.value = false;
      // 在控制台輸出訊息
      console.log(`已滾動回到 ${threshold}px 以內`);
      // 註解：這裡可以加入需要的額外邏輯
    }
  };

  // 在組件掛載（mounted）時添加滾動事件監聽器
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  // 在組件卸載（unmounted）時移除滾動事件監聽器，避免記憶體漏洞（memory leak）
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  // 回傳包含響應式變數的物件，供組件使用
  return {
    scrollDistance,
    hasScrolledPastThreshold,
    handleScroll
  };
}

// 使用示例
// const throttledHandleScroll = advancedThrottle(() => {
//   const currentScrollDistance = scrollContainer.value?.scrollTop || 0;
//   const threshold = 200;
//   if (currentScrollDistance > threshold) {
//     alert(`超越臨界點 ${threshold}`);
//   }
//   console.log("scrollY:", currentScrollDistance);
// }, 5000);

// 使用throttledHandleScroll替代原來的handleScroll
