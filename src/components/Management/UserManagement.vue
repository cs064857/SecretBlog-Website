<template>


  <div class="mgmt-container"><!-- mgmt-container -->

    <div class="FlexInnerLayer" id="mgmt-header" ><!-- mgmt-header   -->

      <el-button type="primary" round style="margin-left: 20px" @click="handleAdd">新增</el-button>


      <el-dialog
          :model-value="dialogVisible"
          :title="formTitle"
          width="500"
          :before-close="handleClose"
      >
        <FormUser :inputFormData="inputFormData" @dialogVisible="handleCloseDialog"></FormUser>
      </el-dialog>


      <el-select effect="dark" ref="searchSelectRef" class="search-select" clearable v-model="searchKey" placeholder="搜索欄位">
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



import {onMounted,ref} from 'vue'
import {ElTable} from "element-plus";
import {ElSelect} from 'element-plus'

/**
 * 表單
 */

import FormUser from "./Form/FormUser.vue";//㊣

/**
 * 初始化表格資料
 */
let resultData = ref<any[]>([])
console.log("初始 resultData:", resultData)

/**
 * 表格欄位
 */

const elTableColumnsData:TableColumn[] =[//㊣
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
 * 設置搜尋前選項條的寬度
 */
// const searchSelectRef = ref<InstanceType<typeof ElSelect> | null>(null)
//
// onMounted(()=>{
//   const values = elTableColumnsData.values()
//   const arrayValues = Array.from(values)
//   const maxLength = arrayValues.reduce((max, str)=>Math.max(max,str.label.length),0);
//
//   //設置searchSelectRef寬度為選項中字的length+3,單位為rem
//   console.log("設置搜尋前選項條寬度 maxLength:", maxLength)
//   searchSelectRef.value.$el.style.minWidth = `${maxLength + 3}rem`
//   searchSelectRef.value.$el.style.maxWidth = `${maxLength + 3}rem`
//   // console.log("keys",arrayValues)
//   // console.log("values",arrayValues)
//   // console.log("maxLength",maxLength)
//
// })



/**
 * 對話框
 */
const { dialogVisible, handleClose, handleCloseDialog } = useHandleDialog();
/**
 * 對話框/
 */


/**
 * 表格
 */

/**
 * 新增按鈕、修改按鈕
 */

const formTitle=ref<string>("")//根據行為(例:新增、修改)決定表單Title
console.log("初始 formTitle:", formTitle)
const inputFormData=ref({});//傳遞給表單的資料
console.log("初始 inputFormData:", inputFormData)

import {useHandleDialog, useHandleEdit, useTableSearch} from '@/hooks/managementHooks/useGenericTableHooks';
import {useConfigureSearchSelectWidthHooks} from '@/hooks/useTableInput';

//新增按鈕、修改按鈕
const { handleEdit,handleAdd } = useHandleEdit(formTitle);

/**
 * 刪除按鈕
 */

import {InfoFilled, Search} from '@element-plus/icons-vue'

import { useHandleDelete } from '@/hooks/managementHooks/useGenericTableHooks';

const { clicked, handleDelete, handleBatchDelete, onCancel,tableRef } = useHandleDelete();
/**
 * 刪除按鈕
 */

//表格資料
import {useGenericTableData} from '@/hooks/managementHooks/useGenericTableHooks'

// 使用封裝的表格數據 Hook
const {
  tableRawData,
  filteredData,
  dataTotalCount,
} = useGenericTableData();

/**
 * 表格/
 */



/**
 * 分頁
 */

import {useTablePaginatedHooks} from "@/hooks/useTablePaginatedHooks";
import {TableColumn} from "@/interface/tableColumInterFace";
// 使用封裝的分頁 hook
const {
  currentPage,
  pageSize,
  background,
  disabled,
  indexCount,
  handleCurrentChange,
  handleSizeChange,
} = useTablePaginatedHooks(tableRawData, filteredData, resultData, dataTotalCount);


/**
 * 分頁
 */


/**
 * 搜尋欄位選單
 */

// 使用封裝的搜尋 Hook
const {
  searchKey,
  searchValue,
  searchDateRange,
  handleSearch,
} = useTableSearch(tableRawData, filteredData, dataTotalCount);
const {searchSelectRef} = useConfigureSearchSelectWidthHooks(elTableColumnsData);
/**
 * 搜尋欄位選單/
 */



</script>

<style scoped>

#mgmt-footer[data-v-47a9e625]{
  /* 設置分頁背景顏色 */
  /* background: #1b1b1b; */
  
}
#mgmt-header{
  height: 10%;
  /* 設置表格標頭背景顏色(新增、修改、查詢、刪除按鈕等欄位) */
  /* background: #1b1b1b */
}

.el-table{
  /* 設置表格標頭背景顏色(索引、帳戶狀態等欄位) */
  /* --el-table-header-bg-color: #1b1b1b; */
  /* 設置表格背景背景顏色 */
  /* background: #1b1b1b; */
}


.el-sub-menu{
  --el-menu-hover-bg-color: #1F1F1F;
  --el-menu-bg-color: #373737;
}



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
  /* background: #1b1b1b; */
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

}

#mgmt-content {
  min-height: 74vh;
  max-height: 74vh;
}

</style>
