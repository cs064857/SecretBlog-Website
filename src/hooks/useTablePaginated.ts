import {onMounted, Ref, ref, watch} from "vue";

export function useTablePaginated(tableRawData: Ref<any[]> | null, filteredData: Ref<any[]> | null) {
    const currentPage = ref(1)
    const pageSize = ref(10)
    const background = ref(false)
    const disabled = ref(false)


    let dataTotalCount = ref<Number>(tableRawData.value.length)
// let filteredData = ref<any[]>(tableRawData.value)  // 這裡存儲的是過濾後的數據


// console.log("分頁前的數據filteredData.value:",filteredData.value)
    let resultData = ref<any[]>([])


    const updatePaginatedData = () => {
        dataTotalCount.value = filteredData.value.length  // 更新數據總量

        //進行分頁
        const PageStart = (currentPage.value - 1) * pageSize.value
        const PageEnd = currentPage.value * pageSize.value

        //返回分頁後的數據
        resultData.value = filteredData.value.slice(PageStart, PageEnd);
        console.log("分頁後的數據resultData.value:", resultData.value)
    }


//設置索引
    const indexCount = (index: number) => {
        return (currentPage.value - 1) * pageSize.value + index + 1;
    }
// /設置索引
//初始化表格數據

    const handleSizeChange = (val: number) => {
        console.log(`${val} items per page`)
        updatePaginatedData()
    }
    const handleCurrentChange = (val: number) => {
        console.log(`current page: ${val}`)
        updatePaginatedData()
    }

    return {
        currentPage,
        pageSize,
        background,
        disabled,
        dataTotalCount,
        resultData,
        updatePaginatedData,
        indexCount,
        handleSizeChange,
        handleCurrentChange
    }
}

// export function updatePaginatedData (tableRawData:Ref<any[]> | null,filteredData:Ref<any[]> | null,dataTotalCount:Ref<number>,currentPage:Ref<number>,pageSize:Ref<number>){
//     let resultData = ref<any[]>([])
//     dataTotalCount.value = filteredData.value.length  // 更新數據總量
//
//     //進行分頁
//     const PageStart = (currentPage.value - 1) * pageSize.value
//     const PageEnd = currentPage.value * pageSize.value
//
//     //返回分頁後的數據
//     resultData.value = filteredData.value.slice(PageStart, PageEnd);
//     console.log("分頁後的數據resultData.value:",resultData.value)
// }
