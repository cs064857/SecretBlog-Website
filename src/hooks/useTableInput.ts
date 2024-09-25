import {computed, ref, Ref} from "vue";

export function useSearch(searchKey:Ref<String | null>,searchValue:Ref<String | null>,searchDateRange:Ref<[string, string] | null>,tableRawData:Ref<any[]>
                            ) {//執行搜尋
    console.log("執行搜尋...")
    // console.log("搜尋總數據源:",tableRawData.value)
    // console.log("搜尋欄位:"+searchKey.value+",內容:"+searchValue.value+",日期:"+searchDateRange.value)

    let filteredData = ref<any[] |null>(tableRawData.value)  // 這裡存儲的是過濾後的數據

    if(searchKey.value && (searchValue.value||searchDateRange.value)) {
        console.log("存在搜尋欄位或搜尋內容")
        const getMatchCondition = computed(() => (data: any) => {
            const withinDateRange = searchDateRange.value ? new Date(data[searchKey.value as string]) >= new Date(searchDateRange.value[0]) &&
                new Date(data[searchKey.value as string]) <= new Date(searchDateRange.value[1]) : true;

            //可能報錯// console.log("搜尋日期數據:", new Date(data[searchKey.value as string])+",搜尋日期範圍:", new Date(searchDateRange.value[0]), "至", new Date(searchDateRange.value[1]), "之間"+"搜尋結果:"+withinDateRange)
            const matchesSearchKey = searchValue.value?(data[searchKey.value as string].toLowerCase() === (searchValue.value.toLowerCase())):true;
            // console.log("matchesSearchKey",matchesSearchKey)
            return withinDateRange && matchesSearchKey;
        })
        // console.log("getMatchCondition.value",getMatchCondition.value)
        filteredData.value = tableRawData.value.filter(getMatchCondition.value)
        if (filteredData.value.length === 0 && searchValue.value) {
            const matchesSearchKeyFuzzy = computed(() => (data: any) => data[searchKey.value as string].toLowerCase().includes(searchValue.value.toLowerCase()));
            filteredData.value = tableRawData.value.filter(matchesSearchKeyFuzzy.value);
        }
    }else {
        console.log("沒有搜尋欄位或搜尋內容")

        filteredData.value = tableRawData.value;
    }

    // dataTotalCount.value = filteredData.value.length  // 更新數據總量
    const dataTotalCount=ref<number>(filteredData.value.length)// 更新數據總量
    // currentPage.value = 1; // 搜尋後回到第一頁

    // currentPage:Ref<number>
    const currentPage=ref<number> (1); // 搜尋後回到第一頁
    console.log("回傳...",filteredData)
    return {filteredData,currentPage,dataTotalCount}

    // const updatePaginatedData = () => {
    //     //進行分頁
    //     const PageStart = (currentPage.value - 1) * pageSize.value
    //     const PageEnd = currentPage.value * pageSize.value
    //
    //     //返回分頁後的數據
    //     resultData.value = filteredData.value.slice(PageStart, PageEnd);
    //     console.log("分頁後的數據resultData.value:",resultData.value)
    // }
    //
    // return {updatePaginatedData}



}
