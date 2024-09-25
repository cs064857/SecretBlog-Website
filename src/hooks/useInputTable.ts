import {ref, watch} from 'vue'

export default function (tableData: any[]) {
    // 分頁
    const currentPage = ref(1)
    const pageSize = ref(10)
    const background = ref(false)
    const disabled = ref(false)
    let dataTotal = ref<Number>(tableData.length)
    let filteredData = ref<any[]>(tableData)  // 這裡存儲的是過濾後的數據
    console.log("分頁前的數據filteredData.value:",filteredData.value)
    let resultData = ref<any[]>([])
    const updatePaginatedData = () => {
        if (filteredData.value.length === 0) {
            console.warn("無分頁數據，finalData.value 為空");
            return;
        }
        //進行分頁
        const PageStart = (currentPage.value - 1) * pageSize.value
        const PageEnd = currentPage.value * pageSize.value

        //返回分頁後的數據
        resultData.value = filteredData.value.slice(PageStart, PageEnd);
        console.log("分頁後的數據resultData.value:",resultData.value)
    }
    //設置索引
    const indexCount = (index: number) => {
        return (currentPage.value - 1) * pageSize.value + index + 1;
    }
    // /設置索引
    //初始化表格數據
    updatePaginatedData()

    watch(() => tableData,
        (newData) => {
            filteredData.value = newData;
            dataTotal.value = newData.length;
            updatePaginatedData();
        },
        { immediate: true } // 確保立即執行一次監聽器
    );

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
            let withinDateRange:boolean = true
            if(dateValue.value){
                withinDateRange = dateValue.value ? new Date(data.date) >= new Date(dateValue.value[0]) &&
                    new Date(data.date) <= new Date(dateValue.value[1]) : true;
            }


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
