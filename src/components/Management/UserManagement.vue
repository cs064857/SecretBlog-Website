<template>


  <div class="mgmt-container"><!-- mgmt-container -->

    <div class="FlexInnerLayer" id="mgmt-header" style="height: 10%;background: #213547"><!-- mgmt-header   -->

      <el-button type="primary" round style="margin-left: 20px" @click="handleAdd">新增</el-button>


      <el-dialog
          v-model="dialogVisible"
          :title="formTitle"
          width="500"
          :before-close="handleClose"
      >
        <FormUser :inputFormData="inputFormData" @dialogVisible="handleCloseDialog"></FormUser>
      </el-dialog>


      <el-select ref="searchSelectRef" class="search-select" clearable v-model="searchKey" placeholder="搜索欄位">
        <el-option v-for="option in elTableColumnsData" :key="option.label" :label="option.label" :value="option.value" />
      </el-select>

      <el-input v-model="searchValue" clearable style="margin-left: 30px;max-width: 10vw;min-width: 10vw" placeholder="請輸入搜尋關鍵字">

<!--        <template #prepend>-->
<!--          <el-select  ref="searchSelectRef" class="search-select" v-model="searchKey" placeholder="Select">-->
<!--            <el-option v-for="option in elTableColumnsData" :key="option.label" :label="option.label" :value="option.value" />-->
<!--          </el-select>-->
<!--        </template>-->

      </el-input>
      <div class="block">
        <el-date-picker style="margin-left: 30px" v-model="searchDateRange" type="daterange" start-placeholder="開始日期"
                        end-placeholder="結束日期" format="YYYY-MM-DD" date-format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"/>
      </div>
      <el-button type="success" round style="margin-left: 20px" v-on:click="handleSearch">搜尋</el-button>
      <el-button type="danger" round style="margin-left: 20px" v-on:click="handleBatchDelete">批量刪除</el-button>
    </div><!-- /mgmt-header   -->


    <div class="FlexInnerLayer" id="mgmt-content"><!--mgmt-content   -->

      <el-table class="mgmt-content-table" :data="resultData" ref="tableRef"
      >
        <el-table-column type="selection" width="40"  />

        <el-table-column label="索引" :index="indexCount" type="index" width="60px" align="center"/>


        <el-table-column sortable  v-for="item in elTableColumnsData" :key="item.label" :label="item.label" :prop="item.value">
<!--          <template #default="scope" v-if="item.value === 'status'">-->
<!--            <span v-if="scope.row.status == 0">正常</span>-->
<!--            <span v-else>封禁</span>-->
<!--          </template>-->

        </el-table-column>




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
                title="確認是否刪除此選項？"
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
                       :total="dataTotalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        />
      </div><!--  /分頁    -->

    </div><!-- mgmt-footer   -->

  </div><!-- /mgmt-container -->


</template>

<script setup lang="ts">

const tableRef = ref()

import {computed, nextTick, onBeforeUpdate, onMounted, onUnmounted, ref, watch, watchEffect} from 'vue'
import {ElMessage, TableColumnCtx} from "element-plus";
import {ElMessageBox, ElSelect} from 'element-plus'
import {useSearch} from "@/hooks/useTableInput.ts"


/**
 * 表格欄位過濾及排序
 */
const handlerFilter = (
    value: string,
    row: User,
    column: TableColumnCtx<User>
) => {
  const property = column['property']
  return row[property] === value
}
/**
 * 表格欄位過濾及排序
 */

import {batchDeleteRequest,getTableDataRequest} from "@/hooks/useUserRequest.js"

//批量刪除
const handleBatchDelete=function (){
  const selectionRows:User[] = tableRef.value.getSelectionRows();//索引上選中的資料(數組)
  const userIdList =selectionRows.map(item=>item.id)
  console.log("selectionRows",selectionRows)
  console.log("userIdList",userIdList)
  batchDeleteRequest(userIdList);
}

/**
 * 表格欄位
 */
const elTableColumnsData:{label:String,value:String}[] =[
  // { label: "用戶ID", value: "id" },
  // { label: "使用者頭像", value: "avatar" },
  { label: "帳戶狀態", value: "status" },
  { label: "權限名稱", value: "roleId" },
  { label: "使用者名稱", value: "name" },
  { label: "帳號", value: "accountName" },
  { label: "密碼", value: "password" },
  { label: "信箱", value: "email" },
  { label: "生日", value: "birthday" },
  { label: "性別", value: "gender" },
  { label: "手機號碼", value: "phoneNumber" },
  { label: "註冊時間", value: "createTime" },
  { label: "地址", value: "address" }
]
/**
 * 表格欄位/
 */



/**
 * 設置搜尋前選項條的寬度
 */
const searchSelectRef = ref<InstanceType<typeof ElSelect> | null>(null)

onMounted(()=>{
  const values = elTableColumnsData.values()
  const arrayValues = Array.from(values)
  const maxLength = arrayValues.reduce((max, str)=>Math.max(max,str.label.length),0);

  //設置searchSelectRef寬度為選項中字的length+3,單位為rem
  searchSelectRef.value.$el.style.minWidth = `${maxLength + 3}rem`
  searchSelectRef.value.$el.style.maxWidth = `${maxLength + 3}rem`
  // console.log("keys",arrayValues)
  // console.log("values",arrayValues)
  // console.log("maxLength",maxLength)

})
/**
 * 設置搜尋前選項寬度 /
 */


/**
 * 對話框
 */
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
/**
 * 對話框/
 */


/**
 * 表格
 */

/**
 * 新增按鈕、修改按鈕
 */
import {useactionTypeStore} from '@/pinia/useUserManagementFormStore.ts'
const formTitle=ref<string>("")//根據行為(例:新增、修改)決定表單Title
const inputFormData=ref('');//傳遞給表單的資料
const actionTypeStore = useactionTypeStore();
const handleAdd = () => {
  formTitle.value="新增"
  //告訴表單點擊的是新增，並使用新增相關的程式碼
  actionTypeStore.setactionType("add")
  dialogVisible.value=true
}

const handleEdit = (index: number, row: any) => {
  formTitle.value="編輯"
  //給表單組件傳遞並回顯選中項資料
  inputFormData.value= {...row,foo:Date.now()}//foo是無意義的數據,只是為了觸發FormUser的watch監聽

  console.log("給表單組件傳遞並回顯選中項資料:",inputFormData)

  //打開表單視窗
  actionTypeStore.setactionType("update")
  dialogVisible.value=true
  console.log(index, row)
}
/**
 * 新增按鈕、修改按鈕/
 */

//表格中項目刪除按鈕

import {InfoFilled, Search} from '@element-plus/icons-vue'

import FormUser from "./Form/FormUser.vue";

const handleDelete = (index: number, row: any) => {

  batchDeleteRequest(row.id);

  console.log(index, row)
}

const clicked = ref(false)

function onCancel() {
  console.log("取消")
  clicked.value = true
}

//表格中項目刪除按鈕/



//表格資料

const getTableData= async function (){
    await getTableDataRequest().then((data:any) => {
      console.log("data:",data)
      if(data.code==200){
        // console.log("後端原始數據:",data.data)
        tableRawData.value=data.data
        // console.log("轉換前使用者表格數據:",tableRawData.value)
        console.log("tableRawData.value:",tableRawData.value)
      }
    })
}


interface User {
  id:string;
  name: string;             // 姓名
  avatar: string;           // 使用者頭像
  status: string;          // 帳號狀態 (0正常, 1封禁中)

  // 以下是 UmsUserInfo 的欄位
  accountName: string;      // 帳號名稱
  password: string;         // 密碼
  email: string;            // 信箱地址
  birthday: Date | string;         // 生日 (LocalDate in Java)
  gender: number | string;           // 性別 (1 男性, 2 女性, 3 不願透露)
  address: string;          // 居住地址
  phoneNumber: string;      // 手機號碼
  createTime: Date | string;       // 註冊時間 (LocalDateTime in Java)

  // 額外的欄位 (來自 UmsRole)
  roleId: string;         // 權限名稱
}

const tableRawData=ref<User[]>([]);
/**
 * 表格/
 */



/**
 * 分頁全程式碼
 */

// 分頁
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
  console.log("分頁後的數據resultData.value:",resultData.value)
}

//設置索引
const indexCount = (index: number) => {
  return (currentPage.value - 1) * pageSize.value + index + 1;
}
// /設置索引
//初始化表格數據
onMounted(async ()=>{
  await getTableData();
  updatePaginatedData();
})





watch(() => tableRawData.value,
    (newData) => {
      filteredData.value = newData;
      dataTotalCount.value = newData.length;
      updatePaginatedData();
    },
    { immediate: false, deep: true }
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


/**
 * 搜尋欄位選單
 */



// const searchKey = ref<String>('name')//選中的選項,默認為name(使用者名稱)
const searchKey = ref<String>()//選中的選項

watchEffect(()=>{
  console.log("搜索選項searchValue:",searchKey.value)
})
/**
 * 搜尋欄位選單/
 */


// 輸入框
const searchValue = ref('')


// /輸入框
/*日期選擇器*/
const searchDateRange = ref<[string, string] | null>(null);// 使用陣列來存儲日期範圍
/*日期選擇器*/

// const filteredData=handleSearch(searchKey,searchValue,searchDateRange,tableRawData,dataTotalCount,currentPage)
let filteredData=ref<any[] |null>();
const handleSearch=function (){
  // const {filteredDat}= handleSearch(searchKey,searchValue,searchDateRange,tableRawData,dataTotalCount,currentPage)
  /**
   * 參數:搜尋欄位、搜尋值OR日期範圍、原始表格資料
   * return:過濾後的資料
   */
  const { filteredData:tempFilteredData,currentPage:currentPage,dataTotalCount:dataTotalCount} = useSearch(
      searchKey,
      searchValue,
      searchDateRange,
      tableRawData
  );
  // console.log("handleSearch,filteredData.value",filteredData.value)
  filteredData = tempFilteredData;
  updatePaginatedData()
}




/**
 * 分頁全程式碼
 */


</script>

<style scoped>
/* 調整 el-table 欄位之間的間距 */
:deep(.el-table .el-table__cell) {
  padding: 5px; /* 根據需求調整間距大小 */
}

/* 確保選中的選項也是居中的 */
:deep(.search-select .el-select__wrapper) {
  text-align: center;
}
.search-select{
  position: relative;
  margin-left: 1vw;
}


.mgmt-content-table {
  width: 100%;
  height: 100%;
  border-top: 1px solid #888888;
  border-bottom: 1px solid #888888;

  word-wrap: break-word; /* 遇到長單詞自動換行 */
  word-break: break-all; /* 對於所有內容進行換行，防止超出容器 */
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
