<template>


  <div class="FlexOuterLayer"><!-- FlexOuterLayer -->

    <div class="FlexInnerLayer" id="FlexInnerInput" style="height: 10%;background: #213547"><!-- FlexInnerLayer1   -->

      <el-input v-model="SearchKey" clearable style="margin-left: 30px;width: 240px" placeholder="Please input" />
      <div class="block">
        <el-date-picker style="margin-left: 30px" v-model="dateValue" type="daterange" start-placeholder="開始日期"
          end-placeholder="結束日期" format="YYYY-MM-DD" date-format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
      </div>
      <el-button type="success" round style="margin-left: 20px" v-on:click="handleSearch">搜尋</el-button>
    </div><!-- /FlexInnerLayer1   -->


    <div class="FlexInnerLayer" style="height: 80%"><!-- FlexInnerLayer2   -->
      <!--  表格   -->
      <el-table :data="resultData"
        style="width: 100%;height: 100% ; border-top: 1px solid #888888;border-bottom: 1px solid #888888">
        <el-table-column type="selection" width="40" />
        <el-table-column label="索引" :index="indexCount" type="index" width="60px" align="center" />
        <el-table-column label="Date" prop="date" />
        <el-table-column label="Name" prop="name" />
        <el-table-column label="Address" prop="address" />

        <el-table-column align="right">
          <!--          <template #header>-->
          <!--            <el-input v-model="search" size="small" placeholder="Type to search"/>-->
          <!--          </template>-->
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
              Edit
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
              Delete
            </el-button>
          </template>
        </el-table-column>

      </el-table><!--  /表格    -->

    </div><!-- /FlexInnerLayer2   -->


    <div class="FlexInnerLayer" style="height: 10%;background: #ffffff"><!-- FlexInnerLayer3   -->

      <div class="demo-pagination-block"> <!--  分頁    -->
        <div class="demonstration"></div>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 50, 100]"
          :size="'large'" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
          :total="dataTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div><!--  /分頁    -->

    </div><!-- FlexInnerLayer3   -->

  </div><!-- /FlexOuterLayer -->

</template>

<script setup lang="ts">
// 表格
import { type User } from '../types'
import useInputTable from '../hooks/useInputTable'

const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}




const tableData: User[] = [
  {
    date: '2016-05-03',
    categoryName: '1111',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    categoryName: 'John',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    categoryName: 'Morgan',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2024-05-01',
    categoryName: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2025-05-01',
    categoryName: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: '66666',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const {
  //分頁
  currentPage,
  pageSize,
  background,
  disabled,
  dataTotal,
  resultData,
  handleSizeChange,
  handleCurrentChange,
  //設置索引
  indexCount,
  //輸入框搜尋
  SearchKey,
  handleSearch,
  dateValue } = useInputTable(tableData)

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
