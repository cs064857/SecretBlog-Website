import {Ref, ref, watch} from "vue";

export function useTablePaginatedHooks(
    tableData: Ref<any[]>,
    filteredData: Ref<any[] | null>,
    resultData: Ref<any[]>,
    dataTotalCount: Ref<number>
) {
    const currentPage = ref(1);
    const pageSize = ref(10);
    const background = ref(false);
    const disabled = ref(false);

    const indexCount = (index: number) => {
        return (currentPage.value - 1) * pageSize.value + index + 1;
    };

    const updatePaginatedData = () => {
        if (!filteredData.value) return;
        dataTotalCount.value = filteredData.value.length; // 更新總數量
        const pageStart = (currentPage.value - 1) * pageSize.value;
        const pageEnd = currentPage.value * pageSize.value;
        resultData.value = filteredData.value.slice(pageStart, pageEnd);
        console.log("更新後的 resultData:", resultData.value);
    };

    const handleCurrentChange = (val: number) => {
        console.log("分頁當前頁變更 handleCurrentChange，頁數:", val);
        currentPage.value = val;
        updatePaginatedData();
    };

    const handleSizeChange = (val: number) => {
        console.log("分頁大小變更 handleSizeChange，大小:", val);
        pageSize.value = val;
        currentPage.value = 1; // 重置到第一頁
        updatePaginatedData();
    };

    // 監聽表格數據或過濾後的數據變更，重新計算分頁
    watch(
        [tableData, filteredData],
        () => {
            updatePaginatedData();
        },
        { immediate: true }
    );

    return {
        currentPage,
        pageSize,
        background,
        disabled,
        indexCount,
        handleCurrentChange,
        handleSizeChange,
    };
}
