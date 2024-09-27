import {computed, ref, Ref} from "vue";

export function useSearch(searchKey:Ref<String | null>,searchValue:Ref<String | null>,searchDateRange:Ref<[string, string] | null>,tableRawData:Ref<any[]>
) {//執行搜尋

    let filteredData = ref<any[] |null>(tableRawData.value)  // 這裡存儲的是過濾後的數據
    console.log("初始filteredData:", filteredData.value)

    if(searchKey.value && (searchValue.value || searchDateRange.value)) {
        console.log("搜尋條件 searchKey:", searchKey.value, " searchValue:", searchValue.value, " searchDateRange:", searchDateRange.value)

        const getMatchCondition = computed(() => (data: any) => {
            const withinDateRange = searchDateRange.value ?
                (new Date(data[searchKey.value as string]) >= new Date(searchDateRange.value[0]) &&
                    new Date(data[searchKey.value as string]) <= new Date(searchDateRange.value[1])) : true;
            console.log("日期範圍判斷 withinDateRange:", withinDateRange)

            const matchesSearchKey = searchValue.value ?
                (data[searchKey.value as string].toLowerCase() === searchValue.value.toLowerCase()) : true;
            console.log("搜尋字詞 matchesSearchKey:", matchesSearchKey)

            return withinDateRange && matchesSearchKey;
        })

        filteredData.value = tableRawData.value.filter(getMatchCondition.value)
        console.log("篩選後 filteredData:", filteredData.value)

        if (filteredData.value.length === 0 && searchValue.value) {
            console.log("精確搜尋結果為空，進行模糊搜尋")
            const matchesSearchKeyFuzzy = computed(() => (data: any) =>
                data[searchKey.value as string].toLowerCase().includes(searchValue.value.toLowerCase())
            );
            filteredData.value = tableRawData.value.filter(matchesSearchKeyFuzzy.value);
            console.log("模糊搜尋後 filteredData:", filteredData.value)
        }
    } else {
        console.log("未提供搜尋條件，返回原始表格數據")
        filteredData.value = tableRawData.value;
    }

    const dataTotalCount = ref<number>(filteredData.value.length) // 更新數據總量
    console.log("更新後的 dataTotalCount:", dataTotalCount.value)

    const currentPage = ref<number>(1); // 搜尋後回到第一頁
    console.log("搜尋後 currentPage:", currentPage.value)

    return {filteredData, currentPage, dataTotalCount}
}
