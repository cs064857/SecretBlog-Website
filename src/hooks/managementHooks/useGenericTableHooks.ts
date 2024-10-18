import {useSearch} from "../useTableInput";
import {updatePaginatedData} from "../useTablePaginated";
import {ref, Ref, UnwrapRef} from "vue";
import { useActionTypeStore, useDialogVisibleStore, useInputFormDataStore } from '@/pinia/managementPinia/genericFormPinia/useFormStore';
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

export function useHandleEdit(formTitle: Ref<string>) {
    const dialogVisibleStore = useDialogVisibleStore();
    const actionTypeStore = useActionTypeStore();
    const inputFormDataStore = useInputFormDataStore();

    const handleEdit = (index: number, row: any) => {
        formTitle.value = "編輯";
        console.log("觸發 handleEdit，formTitle:", formTitle.value);
        console.log("選中項 index:", index, " row:", row);

        actionTypeStore.setActionType("update");
        dialogVisibleStore.setDialogVisible(true);
        inputFormDataStore.setInputFormData(row);
        console.log("inputFormDataStore.getInputFormData...", inputFormDataStore.getInputFormData);
    };
    const handleAdd = () => {
        formTitle.value = "新增";
        console.log("觸發 handleAdd，formTitle:", formTitle.value);
        actionTypeStore.setActionType("add");
        dialogVisibleStore.setDialogVisible(true);
    };

    return {
        handleEdit,
        handleAdd,
    };
}
