<template>


  <div class="mgmt-container"><!-- mgmt-container -->

    <div class="FlexInnerLayer" id="mgmt-header" style="height: 10%;background: #213547"><!-- mgmt-header   -->

      <el-button type="primary" round style="margin-left: 20px" @click="dialogVisible=true">新增</el-button>


      <el-dialog
          v-model="dialogVisible"
          title="Tips"
          width="500"
          :before-close="handleClose"
      >
        <FormUser @dialogVisible="handleCloseDialog"></FormUser>
      </el-dialog>


      <el-input v-model="SearchKey" clearable style="margin-left: 30px;width: 240px" placeholder="Please input"/>
      <div class="block">
        <el-date-picker style="margin-left: 30px" v-model="dateValue" type="daterange" start-placeholder="開始日期"
                        end-placeholder="結束日期" format="YYYY-MM-DD" date-format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"/>
      </div>
      <el-button type="success" round style="margin-left: 20px" v-on:click="handleSearch">搜尋</el-button>
    </div><!-- /mgmt-header   -->


    <div class="FlexInnerLayer" id="mgmt-content"><!--mgmt-content   -->

      <el-table class="mgmt-content-table" :data="resultData"
      >
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

            <el-popconfirm
                width="220"
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="Are you sure to delete this?"
                @cancel="onCancel"
                @confirm="handleDelete(scope.$index, scope.row)"
            >
              <template #reference>
                <el-button size="small" type="danger">
                  Delete
                </el-button>
              </template>
              <template #actions="{ confirm, cancel }">
                <el-button size="small" @click="cancel">No!</el-button>
                <el-button
                    type="danger"
                    size="small"
                    :disabled="!clicked"
                    @click="confirm"
                >
                  Yes?
                </el-button>
              </template>
            </el-popconfirm>


          </template>
        </el-table-column>

      </el-table>


    </div><!--mgmt-content   -->


    <div class="FlexInnerLayer" id="mgmt-footer"><!-- mgmt-footer   -->

      <div class="mgmt-footer-pagination"> <!--  分頁    -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 50, 100]"
                       :size="'large'" :disabled="disabled" :background="background"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="dataTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        />
      </div><!--  /分頁    -->

    </div><!-- mgmt-footer   -->

  </div><!-- /mgmt-container -->


</template>

<script setup lang="ts">
//對話框

import {ElMessageBox} from 'element-plus'

const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('確認是否關閉視窗？')
      .then(() => {
        done()
      })
      .catch(() => {
        // catch error
      })
}

const handleCloseDialog = function () {
  dialogVisible.value = false
}
//對話框/


// 表格
// import {User,Users} from '../interface/userInterface.ts'
import useInputTable from '@/hooks/useInputTable.ts'

const handleEdit = (index: number, row: any) => {
  console.log(index, row)
}

//表格中項目刪除按鈕
import {ref} from 'vue'
import {InfoFilled} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import http from "../../utils/httpRequest"
import FormUser from "./Form/FormUser.vue";

const handleDelete = (index: number, row: any) => {

  // http({
  //     url: http.adornUrl('/article/articles'),
  //     method: 'post',
  //     data: http.adornData(row, false)
  // }).then(({data}) => {
  //
  // if(data.code==200){
  //         ElMessage.success("");
  //     }else{
  //         ElMessage.error("");
  //     }
  // });

  console.log(index, row)
}

const clicked = ref(false)

function onCancel() {
  console.log("取消")
  clicked.value = true
}

//表格中項目刪除按鈕/

const getTableData=function (){
  http({
      url: http.adornUrl(''),
      method: 'get',
      params: http.adornParams({})
  }).then(({data}) => {
      if(data.code==200){
          ElMessage.success("獲得使用者表格數據成功");
      }else{
          ElMessage.error("獲得使用者表格數據失敗");
      }
  })
}

//表格資料
const tableData: any = [
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
  {
    date: '2016-05-01',
    categoryName: '66666',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: '66666',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: '66666',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: '66666',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: '66666',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: '66666',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: '66666',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: '66666',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    categoryName: '66666',
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
  dateValue
} = useInputTable(tableData)

</script>

<style scoped>
.mgmt-content-table {
  width: 100%;
  height: 100%;
  border-top: 1px solid #888888;
  border-bottom: 1px solid #888888
}

.mgmt-container {
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
#mgmt-header {
  min-height: 9vh;
  max-height: 9vh;
  justify-content: left;
}

/*輸入框*/

#mgmt-footer {
  min-height: 10%;
  max-height: 10%;
  background: #ffffff
}

#mgmt-content {
  min-height: 74vh;
  max-height: 74vh;
}
</style>
