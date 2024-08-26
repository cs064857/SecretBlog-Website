<template>


  <div class="FlexOuterLayer"><!-- FlexOuterLayer -->

    <div class="FlexInnerLayer" id="FlexInnerInput" style="height: 10%;background: #213547"><!-- FlexInnerLayer1   -->

      <el-input v-model="SearchKey" clearable style="margin-left: 30px;width: 240px" placeholder="Please input"/>
      <div class="block">
        <el-date-picker
            style="margin-left: 30px"
            v-model="dateValue"
            type="daterange"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            format="YYYY-MM-DD"
            date-format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"

        />
      </div>
      <el-button type="success" round style="margin-left: 20px" v-on:click="handleSearch">搜尋</el-button>
    </div><!-- /FlexInnerLayer1   -->


    <div class="FlexInnerLayer" style="height: 80%"><!-- FlexInnerLayer2   -->
      <!--  表格   -->
      <el-table :data="resultData"
                style="width: 100%;height: 100% ; border-top: 1px solid #888888;border-bottom: 1px solid #888888">
        <el-table-column type="selection" width="40"/>
        <el-table-column label="索引" :index="indexCount" type="index" width="60px" align="center"/>
        <el-table-column label="Date" prop="date"/>
        <el-table-column label="Name" prop="name"/>
        <el-table-column label="Address" prop="address"/>

        <el-table-column align="right">
          <!--          <template #header>-->
          <!--            <el-input v-model="search" size="small" placeholder="Type to search"/>-->
          <!--          </template>-->
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
              Edit
            </el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>

      </el-table><!--  /表格    -->

    </div><!-- /FlexInnerLayer2   -->


    <div class="FlexInnerLayer" style="height: 10%;background: #ffffff"><!-- FlexInnerLayer3   -->

      <div class="demo-pagination-block"> <!--  分頁    -->
        <div class="demonstration"></div>
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 50, 100]"
            :size="'large'"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div><!--  /分頁    -->

    </div><!-- FlexInnerLayer3   -->

  </div><!-- /FlexOuterLayer -->

</template>

<script setup lang="ts">
// 表格
import {computed, ref, watchEffect} from 'vue'
import{type User} from '../types'

const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}
//設置索引
const indexCount =(index:number)=>{
  return (currentPage.value-1)*pageSize.value+index+1;
}



const tableData: User[] = [
  {
    date: '2016-05-03',
    name: '1111',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2024-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2025-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: '66666',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

// /表格
// 分頁

const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(false)
const disabled = ref(false)
let dataTotal = ref<Number>(tableData.length)
let filteredData = ref<User[]>(tableData)  // 這裡存儲的是過濾後的數據
let resultData = ref<User[]>([])
const updatePaginatedData = () => {
  //進行分頁
  const PageStart = (currentPage.value - 1) * pageSize.value
  const PageEnd = currentPage.value * pageSize.value


  //返回分頁後的數據
  resultData.value = filteredData.value.slice(PageStart, PageEnd);
}
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
watchEffect(() => {
  console.log("dateValue:", dateValue.value)
})
/*日期選擇器*/
</script>

<style scoped>
.FlexOuterLayer {
  background: #646cff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 0;
}

.FlexInnerLayer {
  display: flex;
  justify-content: center;
  align-items: center;
  /*align-items: flex-start;*/
  background: #ffffff;
  width: 100%;
  /*transform: translateY(-10px); /* 向上移動表格 */
}

/*分頁*/
.demo-pagination-block .demonstration {
  margin-bottom: 10px;
}

/*分頁*/

/*輸入框*/
#FlexInnerInput {
  justify-content: left;
}
/*輸入框*/

</style>
