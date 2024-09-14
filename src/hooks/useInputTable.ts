import { ref } from 'vue'

export default function (tableData: any[]) {
    // 分頁
    const currentPage = ref(1)
    const pageSize = ref(10)
    const background = ref(false)
    const disabled = ref(false)
    let dataTotal = ref<Number>(tableData.length)
    let filteredData = ref<any[]>(tableData)  // 這裡存儲的是過濾後的數據
    let resultData = ref<any[]>([])
    const updatePaginatedData = () => {
        //進行分頁
        const PageStart = (currentPage.value - 1) * pageSize.value
        const PageEnd = currentPage.value * pageSize.value
        //返回分頁後的數據
        resultData.value = filteredData.value.slice(PageStart, PageEnd);
    }
    //設置索引
    const indexCount = (index: number) => {
        return (currentPage.value - 1) * pageSize.value + index + 1;
    }
    // /設置索引
    //初始化表格數據
    updatePaginatedData()
    const handleSizeChange = (val: number) => {
        console.log(`${val} items per page`)
        updatePaginatedData()
    }
    const handleCurrentChange = (val: number) => {
        console.log(`current page: ${val}`)
        updatePaginatedData()
    }
    // /分頁



    // 輸入框
    const SearchKey = ref('')


    function handleSearch() {//執行搜尋
        filteredData.value = tableData.filter((data) => {
            //若dateValue.value為空則直接回傳true,放行
            //若dateValue.value不為空,則根據條件判斷,數據中的日期大於開始日期與數據中的日期小於結束日期之間則回傳true放行
            const withinDateRange = dateValue.value ? new Date(data.date) >= new Date(dateValue.value[0]) &&
                new Date(data.date) <= new Date(dateValue.value[1]) : true;

            const matchesSearchKey = SearchKey.value ? data.name.toLowerCase().includes(SearchKey.value.toLowerCase()) : true;
            //當上述兩個條件都成立回傳true,代表該行資料會被保留並顯示於前端頁面中
            return withinDateRange && matchesSearchKey
        }
        )
        dataTotal.value = filteredData.value.length  // 更新數據總量
        currentPage.value = 1; // 搜尋後回到第一頁
        updatePaginatedData()
    }

    // /輸入框
    /*日期選擇器*/
    const dateValue = ref<[string, string] | null>(null);// 使用陣列來存儲日期範圍
    /*日期選擇器*/


    return {
        //分頁
        currentPage,
        pageSize,
        background,
        disabled,
        dataTotal,
        filteredData,
        resultData,
        updatePaginatedData,
        handleSizeChange,
        handleCurrentChange,
        //設置索引
        indexCount,
        //輸入框搜尋
        SearchKey,
        handleSearch,
        dateValue
    }
}
