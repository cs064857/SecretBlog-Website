import {computed} from "vue";

export function handleSearch() {//執行搜尋
    // console.log("執行搜尋...")
    // console.log("搜尋總數據源:",tableData.value)
    // console.log("搜尋欄位:"+searchKey.value+",內容:"+searchValue.value+",日期:"+dateValue.value)

    if(searchValue.value && (searchKey.value||dateValue.value)) {
        console.log("存在搜尋欄位或搜尋內容")
        const getMatchCondition = computed(() => (data: any) => {
            const withinDateRange = dateValue.value ? new Date(data[searchValue.value as string]) >= new Date(dateValue.value[0]) &&
                new Date(data[searchValue.value as string]) <= new Date(dateValue.value[1]) : true;

            //可能報錯// console.log("搜尋日期數據:", new Date(data[searchKey.value as string])+",搜尋日期範圍:", new Date(dateValue.value[0]), "至", new Date(dateValue.value[1]), "之間"+"搜尋結果:"+withinDateRange)
            const matchesSearchKey = searchKey.value?(data[searchValue.value as string].toLowerCase() === (searchKey.value.toLowerCase())):true;
            // console.log("matchesSearchKey",matchesSearchKey)
            return withinDateRange && matchesSearchKey;
        })
        // console.log("getMatchCondition.value",getMatchCondition.value)
        filteredData.value = tableData.value.filter(getMatchCondition.value)
        if (filteredData.value.length === 0 && searchKey.value) {
            const matchesSearchKeyFuzzy = computed(() => (data: any) => data[searchValue.value as string].toLowerCase().includes(searchKey.value.toLowerCase()));
            filteredData.value = tableData.value.filter(matchesSearchKeyFuzzy.value);
        }
    }else {
        // console.log("沒有搜尋欄位或搜尋內容")

        filteredData.value = tableData.value;
    }

    dataTotal.value = filteredData.value.length  // 更新數據總量
    currentPage.value = 1; // 搜尋後回到第一頁
    updatePaginatedData()
}
