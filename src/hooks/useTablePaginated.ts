import {Ref, ref} from "vue";

export function useTablePaginated(tableData: Ref<any[]>) {

    const currentPage = ref(1)
    const pageSize = ref(10)
    const background = ref(false)
    const disabled = ref(false)
    let dataTotalCount = ref<Number>(tableData.value.length)
//設置索引
    const indexCount = (index: number) => {
        const calculatedIndex = (currentPage.value - 1) * pageSize.value + index + 1;
        // console.log("計算索引 indexCount:", calculatedIndex)
        return calculatedIndex;
    }
// /設置索引
//初始化表格數據

    const SizeChange = (val: number, table:Ref<any[]>) => {
        console.log("分頁大小變更 SizeChange，大小:", val)
        return updatePaginatedData(table, dataTotalCount, currentPage, pageSize)
    }
    const CurrentChange = (val: number,table:Ref<any[]>) => {
        console.log("分頁當前頁變更 CurrentChange，頁數:", val)
        return updatePaginatedData(table, dataTotalCount, currentPage, pageSize)
    }

    return {
        currentPage,
        pageSize,
        background,
        disabled,
        dataTotalCount,
        indexCount,
        SizeChange,
        CurrentChange
    }
}

export function updatePaginatedData (tableData: Ref<any[]>,dataTotalCount:Ref<Number>,currentPage:Ref<number>,pageSize:Ref<number>){
    console.log("分頁前的 tableData:", tableData.value)
    let resultData = ref<any[]>([])
    dataTotalCount.value = tableData.value.length  // 更新數據總量
    console.log("更新後的 dataTotalCount:", dataTotalCount.value)

    //進行分頁
    const PageStart = (currentPage.value - 1) * pageSize.value
    console.log("分頁開始位置 PageStart:", PageStart)
    const PageEnd = currentPage.value * pageSize.value
    console.log("分頁結束位置 PageEnd:", PageEnd)

    //返回分頁後的數據
    resultData.value = tableData.value.slice(PageStart, PageEnd);
    console.log("分頁後的 tableData:", resultData.value)

    return resultData
}
