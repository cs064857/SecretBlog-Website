import {useSearch} from "../useTableInput";
import {updatePaginatedData} from "../useTablePaginated";
import {computed, ref, Ref, UnwrapRef} from "vue";
import { useActionTypeStore, useDialogVisibleStore, useInputFormDataStore } from '@/pinia/managementPinia/genericFormPinia/useFormStore';
import {batchDeleteRequest} from "@/requests/managementRequests/userRequest";
import {ElMessageBox} from "element-plus";
import {genericBatchDeleteRequest} from "@/requests/useGenericRequest";
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
export function useHandleDelete(tableRef: Ref<any>) {
    const clicked = ref(false);

    const handleDelete = (index: number, row: any) => {
        console.log("觸發刪除 handleDelete，index:", index, " row:", row);
        ElMessageBox.confirm('確認是否刪除此選項？', '警告', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            batchDeleteRequest(row.id);
            // 你可能想在這裡添加一些邏輯來更新成功刪除後的表格
        }).catch(() => {
            // 取消操作
        });
    };

    const handleBatchDelete = () => {
        const selectionRows = tableRef.value.getSelectionRows();
        console.log("選中的資料 selectionRows:", selectionRows);
        const userIdList = selectionRows.map(item => item.id);
        console.log("選中的 userIdList:", userIdList);

        if (userIdList.length === 0) {
            ElMessageBox.alert('請至少選擇一項進行刪除', '提示', {
                confirmButtonText: '確定',
            });
            return;
        }

        ElMessageBox.confirm('確認是否批量刪除選中的項目？', '警告', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            genericBatchDeleteRequest("/ums/user/userDetails", userIdList);
            // 你可能想在這裡添加一些邏輯來更新成功刪除後的表格
        }).catch(() => {
            // 取消操作
        });
    };

    const onCancel = () => {
        console.log("取消刪除操作");
        clicked.value = true;
    };

    return {
        clicked,
        handleDelete,
        handleBatchDelete,
        onCancel,
    };
}
export function useHandleDialog() {
    const dialogVisibleStore = useDialogVisibleStore();

    // Computed property for dialog visibility
    const dialogVisible = computed(() => dialogVisibleStore.dialogVisible);

    // Function to handle the closing of the dialog with confirmation
    const handleClose = (done: () => void) => {
        ElMessageBox.confirm('確認是否關閉視窗？', '提示', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                console.log("關閉對話框");
                done();
                dialogVisibleStore.setDialogVisible(false); // Update the store to hide the dialog
            })
            .catch(() => {
                // 如果用戶取消，什麼也不做
            });
    };

    // Function to handle dialog closing from child components
    const handleCloseDialog = () => {
        console.log("關閉對話框 handleCloseDialog");
        dialogVisibleStore.setDialogVisible(false);
    };

    return {
        dialogVisible,
        handleClose,
        handleCloseDialog,
    };
}
