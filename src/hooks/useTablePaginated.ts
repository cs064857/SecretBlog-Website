import {Ref, ref} from "vue";

export function useTablePaginated(tableData: Ref<any[]>) {

    const currentPage = ref(1)
    const pageSize = ref(10)
    const background = ref(false)
    const disabled = ref(false)

    let dataTotalCount = ref<Number>(tableData.value.length)
// let filteredData = ref<any[]>(tableRawData.value)  // 這裡存儲的是過濾後的數據


console.log("分頁前的數據tableData.value:",tableData.value)



    // const updatePaginatedData = () => {
    //     dataTotalCount.value = filteredData.value.length  // 更新數據總量
    //
    //     //進行分頁
    //     const PageStart = (currentPage.value - 1) * pageSize.value
    //     const PageEnd = currentPage.value * pageSize.value
    //
    //     //返回分頁後的數據
    //     resultData.value = filteredData.value.slice(PageStart, PageEnd);
    //     console.log("分頁後的數據resultData.value:", resultData.value)
    // }


//設置索引
    const indexCount = (index: number) => {
        return (currentPage.value - 1) * pageSize.value + index + 1;
    }
// /設置索引
//初始化表格數據

    const SizeChange = (val: number, table:Ref<any[]>) => {
        console.log(`${val} items per page`)
        return updatePaginatedData(table, dataTotalCount, currentPage, pageSize)
    }
    const CurrentChange = (val: number,table:Ref<any[]>) => {
        // console.log(`current page: ${val}`,"resultData:")
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
    console.log("updatePaginatedData...tableData:",tableData.value,",dataTotalCount:"+dataTotalCount.value,",currentPage:"+currentPage.value,",pageSize:"+pageSize.value)
    // console.log("updatePaginatedData...tableData:"+tableData.value+
    //     ",dataTotalCount:"+dataTotalCount.value+",currentPage:"+currentPage.value+",pageSize:"+pageSize.value)
    let resultData = ref<any[]>([])
    dataTotalCount.value = tableData.value.length  // 更新數據總量
    // console.log("點擊第",currentPage,"後的數據總量:",dataTotalCount.value)
    //進行分頁
    const PageStart = (currentPage.value - 1) * pageSize.value
    const PageEnd = currentPage.value * pageSize.value

    //返回分頁後的數據
    resultData.value = tableData.value.slice(PageStart, PageEnd);
    console.log("updatePaginatedData結束...resultData.value:",resultData.value,"dataTotalCount:"+dataTotalCount.value)
    return {resultData}

}
