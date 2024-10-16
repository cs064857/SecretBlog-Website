import {useSearch} from "../useTableInput";
import {updatePaginatedData} from "../useTablePaginated";
import {ref, Ref, UnwrapRef} from "vue";

export const handleSearchHook=function ( searchKey: Ref<string>,
                                     searchValue: Ref<string>,
                                     searchDateRange: Ref<[string | null, string | null]>,
                                     tableRawData: Ref<any[]>,
                                     filteredData: Ref<any[] | null>,
                                     dataTotalCount,
                                     pageSize: Ref<number>,
                                     ){
    // console.log("觸發搜尋 handleSearch，搜尋欄位:", searchKey.value, " 搜尋值:", searchValue.value, " 日期範圍:", searchDateRange.value)

    console.log("觸發搜尋 handleSearch");
    console.log("搜尋值:", searchValue.value);
    console.log("搜尋欄位:", searchKey.value);
    console.log("日期範圍:", searchDateRange.value);

    /**
     * 參數:搜尋欄位、搜尋值OR日期範圍、原始表格資料
     * return:過濾後的資料
     */
    const { filteredData:tempFilteredData,currentPage:currentPage,dataTotalCount:tempdataTotalCount} = useSearch(
        searchKey,
        searchValue,
        searchDateRange,
        tableRawData
    );
    currentPage.value=1//搜尋後回到第一頁
    dataTotalCount.value=tempdataTotalCount.value//搜尋後重新計算總數據
    console.log("搜尋後 dataTotalCount:", dataTotalCount.value)
    filteredData.value=tempFilteredData.value
    // resultData.value = updatePaginatedData(tempFilteredData, dataTotalCount, currentPage, pageSize).resultData.value;
    const resultData:Ref<any[]> =updatePaginatedData(tempFilteredData,dataTotalCount,currentPage,pageSize);
    console.log("搜尋後的 resultData:", resultData.value)

    return resultData

}
