import { useSearch } from "./useTableInput";
import {computed, onMounted, ref, Ref} from "vue";
import {
    useActionTypeStore,
    useDialogVisibleStore,
    useInputFormDataStore,
} from "@/pinia/useFormStore";
import {deleteUserDetailRequest, getTableDataRequest} from "@/requests/userRequest";
import { genericBatchDeleteRequest } from "@/requests/useGenericRequest";
import {ElMessageBox, ElTable} from "element-plus";
import {formUserInterface} from "@/interface/admin/formUserInterface";
import { userDetailsDTO } from "@/interface/userDetailsDTOInterface";
import { R } from "@/interface/R";

/**
 * 封裝表格數據管理邏輯
 */
export function useGenericTableData() {
    const tableRawData = ref<formUserInterface[]>([]);
    const filteredData = ref<any[] | null>(null);
    const dataTotalCount = ref<number>(0);
    const loading = ref(true);
    const getTableData = async function () {
        try {

            const data: R<userDetailsDTO> = await getTableDataRequest('/ums/user/userDetails');
            console.log("表格資料請求返回 data:", data);
            if (data.code === 200) {
                tableRawData.value = data.data;
                filteredData.value = data.data;
                dataTotalCount.value = tableRawData.value.length;
                loading.value = false;  // 設置 loading 為 false
                console.log("更新後的 tableRawData:", tableRawData.value);
                console.log("更新後的 dataTotalCount:", dataTotalCount.value);
            } else {
                ElMessageBox.alert("獲取數據失敗", "錯誤", {
                    confirmButtonText: "確定",
                });
            }
        } catch (error) {
            loading.value = false;  // 設置 loading 為 false
            console.error("獲取表格數據時出錯:", error);
            ElMessageBox.alert("獲取數據時出錯", "錯誤", {
                confirmButtonText: "確定",
            });
        }
    };

    // 移動 onMounted 進來這裡
    onMounted(async () => {
        console.log("組件掛載完成，請求表格資料");
        await getTableData();
    });

    return {
        tableRawData,
        filteredData,
        dataTotalCount,
        loading
    };
}

/**
 * 封裝搜尋相關的狀態和行為
 */
export function useTableSearch(
    tableRawData: Ref<any[]>,
    filteredData: Ref<any[] | null>,
    dataTotalCount: Ref<number>
) {
    const searchKey = ref<string>(''); // 選中的選項，設置默認值為空字符串
    const searchValue = ref<string>(''); // 輸入框
    const searchDateRange = ref<[string, string] | null>(null); // 使用陣列來存儲日期範圍

    const handleSearch = () => {

        /**
         * 參數: 搜尋欄位、搜尋值或日期範圍、原始表格資料
         * 功能: 過濾原始表格資料並更新 filteredData 和 dataTotalCount
         */
        const { filteredData: tempFilteredData, dataTotalCount: tempdataTotalCount } = useSearch(
            searchKey,
            searchValue,
            searchDateRange,
            tableRawData
        );

        // 更新 dataTotalCount 和 filteredData
        dataTotalCount.value = tempdataTotalCount.value; // 搜尋後重新計算總數據
        console.log("搜尋後 dataTotalCount:", dataTotalCount.value);
        filteredData.value = tempFilteredData.value;

        // 不再直接更新 resultData，讓 useTablePaginatedHooks 的 watch 自動更新
    };

    return {
        searchKey,
        searchValue,
        searchDateRange,
        handleSearch,
    };
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



export function useHandleDelete() {
    const tableRef = ref<InstanceType<typeof ElTable>>()
    const clicked = ref(false);

    const handleDelete = (index: number, row) => {

        console.log("觸發刪除 handleDelete，index:", index, " row:", row);
        ElMessageBox.confirm("確認是否刪除此選項？", "警告", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                deleteUserDetailRequest("/ums/user/delete/userDetail",row.id);
                // 您可能想在這裡添加一些邏輯來更新成功刪除後的表格
            })
            .catch(() => {
                // 取消操作
            });
    };

    const handleBatchDelete = () => {
        const selectionRows = tableRef.value.getSelectionRows();
        console.log("選中的資料 selectionRows:", selectionRows);
        const userIdList = selectionRows.map((item: any) => item.id);
        console.log("選中的 userIdList:", userIdList);

        if (userIdList.length === 0) {
            ElMessageBox.alert("請至少選擇一項進行刪除", "提示", {
                confirmButtonText: "確定",
            });
            return;
        }

        ElMessageBox.confirm("確認是否批量刪除選中的項目？", "警告", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                genericBatchDeleteRequest("/ums/user/userDetails", userIdList);
                // 您可能想在這裡添加一些邏輯來更新成功刪除後的表格
            })
            .catch(() => {
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
        tableRef
    };
}

export function useHandleDialog() {
    const dialogVisibleStore = useDialogVisibleStore();

    // Computed property for dialog visibility
    const dialogVisible = computed(() => dialogVisibleStore.dialogVisible);

    // Function to handle the closing of the dialog with confirmation
    const handleClose = (done: () => void) => {
        ElMessageBox.confirm("確認是否關閉視窗？", "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
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
