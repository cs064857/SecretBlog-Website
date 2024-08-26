<template>


  <div class="FlexOuterLayer"><!-- FlexOuterLayer -->

    <div class="FlexInnerLayer" id="FlexInnerInput" style="height: 10%;background: #213547"><!-- FlexInnerLayer1   -->

      <el-input v-model="SearchKey" style="margin-left: 30px;width: 240px" placeholder="Please input"/>
      <el-button type="success" round style="margin-left: 20px" v-on:click="handleSearch">搜尋</el-button>
    </div><!-- /FlexInnerLayer1   -->


    <div class="FlexInnerLayer" style="height: 80%"><!-- FlexInnerLayer2   -->
      <!--  表格   -->
      <el-table :data="resultData"
                style="width: 100%;height: 100% ; border-top: 1px solid #888888;border-bottom: 1px solid #888888">
        <el-table-column type="selection" width="40"/>
        <el-table-column label="索引" type="index" width="60px" align="center"/>
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
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[10, 20, 30, 40]"
            :size="'large'"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div><!--  /分頁    -->

    </div><!-- FlexInnerLayer3   -->

  </div><!-- /FlexOuterLayer -->

</template>

<script setup lang="ts">
// 表格
import {computed, ref, watch, watchEffect} from 'vue'
interface User {
  date: string
  name: string
  address: string
}




const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
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
    name: '66666',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
// /表格
// 分頁

const currentPage4 = ref(1)
const pageSize4 = ref(10)
const background = ref(false)
const disabled = ref(false)

let resultData=ref<User[]>(tableData)
function handleData(){
  //進行分頁
  const PageStart = (currentPage4.value - 1) * pageSize4.value
  const PageEnd = currentPage4.value * pageSize4.value
  //返回分頁後的數據
  resultData.value=tableData.slice(PageStart, PageEnd);
  console.log("handleData()")
  console.log("resultData.value:",resultData.value)
}
handleData()
watch([currentPage4, pageSize4], () => {
  handleData(); // 當頁碼或頁大小改變時更新數據
});
// resultData = computed(() => {
//       //進行分頁
//       const PageStart = (currentPage4.value - 1) * pageSize4.value
//       const PageEnd = currentPage4.value * pageSize4.value
//       //返回分頁後的數據
//       return tableData.slice(PageStart, PageEnd);
//     }
// )

// watchEffect(()=>{
//   filteredData.value=paginatedData.value
//   resultData.value=filteredData.value
//   console.log("filteredData:",filteredData)
// })

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
// /分頁
// 輸入框
const SearchKey = ref('')
//執行搜尋
function handleSearch() {
  console.log("resultData:",resultData)
  resultData.value = resultData.value.filter(
      (data) =>
          //若SearchKey不為空,則根據SearchKey值且將SearchKey與data中的value都變成小寫及為無視大小寫執行篩選
          !SearchKey.value || data.name.toLowerCase().includes(SearchKey.value.toLowerCase())
  );
  currentPage4.value = 1; // 搜尋後回到第一頁
}
// /輸入框
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
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

/*分頁*/
/*輸入框*/
#FlexInnerInput {

  justify-content: left;
}

/*輸入框*/

</style>
