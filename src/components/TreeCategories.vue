<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import http from '../utils/httpRequest'
import {ElMessage} from "element-plus";
import {ConfirmDelete} from '../hooks/useMessageBox.ts'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

let id = 1000

const append = (data: Tree) => {
  dialogFormVisible.value = true
  selectedData.value = data//當前選種節點的數據
}

// 對話框
let selectedData = ref<Tree | null>(null);//當前選中的節點數據
let dialogFormVisible = ref<boolean>(false)
const formLabelWidth = '140px'

//表單中輸入的數據
const form = reactive({
  categoryName: '',
})
const handleDialogData = function () {
  if (selectedData.value != null) {
    console.log("selectedData.value:", selectedData.value)
    dialogFormVisible.value = false
    console.log("form.name:", form.categoryName)
    //執行新增分類
    http({
      url: http.adornUrl('/article/category/save'),
      method: 'post',
      //參數1為當前選種節點分類的id,參數2為欲添加輸入的分類名稱
      data: http.adornData({parentId: selectedData.value.id, categoryName: form.categoryName}, false)
    }).then(({data}) => {
      if (data.code == 200) {
        ElMessage.success("添加分類數據成功")
        getCategoryList()

      } else {
        //elementPlus的Message消息提示組件
        ElMessage.error("獲取分類數據失敗")
      }

    });

    // const newChild = { id: id++, label: 'testtest', children: [] }
    // if (!selectedData.value.children) {
    //   selectedData.value.children = []
    // }
    // selectedData.value.children.push(newChild)
    // dataSource.value = [...dataSource.value]
  }
}
// 對話框/
// 從後端獲取分類數據
const getCategoryList = function () {
  http({
    url: http.adornUrl('/article/category/list'),
    method: 'get',
    params: http.adornParams({})
  }).then(({data}) => {
    if (data.code == 200) {
      console.log("data", data)
      dataSource.value = data.data
    } else {
      ElMessage.error("獲取分類數據錯誤");
    }
  })
}

onMounted(() => {
  getCategoryList()//從後端獲取分類數據

})
// 從後端獲取分類數據
// 移除分類
const remove = (node: Node, data: Tree) => {
  console.log("node:", node)
  console.log("data:", data)
  ConfirmDelete("是否刪除該分類數據")
      .then(() => {
        http({
          //將該分類的id發送給後端執行刪除
          url: http.adornUrl(`/article/category/delete/${data.id}`),
          method: 'post',
          // data: http.adornData(data.id, false)
        }).then(({data}) => {
          if(data.code==200){
            ElMessage.success("刪除數據成功")
            getCategoryList()
          }else {
            ElMessage.error("刪除數據錯誤")
          }
        });
      })
      .catch(()=>{
        ElMessage.error("已取消")
      })
}
// 移除分類/
// 拖曳節點
const handleDrag=function (before,after,inner){
  console.log("before:",before)
  console.log("after:",after)
  console.log("inner:",inner)
}
// 拖曳節點/
const dataSource = ref<Tree[]>([]);
</script>

<template>
  <div class="AdminVue-TreeCategories">
    <div class="custom-tree-container">
      <p>Using scoped slot</p>
      <el-tree
          style="max-width: 600px"
          :data="dataSource"
          show-checkbox
          @node-drop="handleDrag"
          node-key="id"
          default-expand-all
          draggable
          :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <a style="padding-left: 10px" @click="append(data)"> Append </a>
            <a v-if="node.childNodes.length==0" style="padding-left: 10px" @click="remove(node, data)"> Delete </a>
          </span>
        </span>

        </template>
      </el-tree>

    </div>

  </div>

  <el-dialog v-model="dialogFormVisible" title="新增分類" width="500">
    <el-form :model="form">
      <el-form-item label="分類名稱" :label-width="formLabelWidth">
        <el-input v-model="form.categoryName" autocomplete="off"/>
      </el-form-item>
      <!--      <el-form-item label="Zones" :label-width="formLabelWidth">-->
      <!--        <el-select v-model="form.region" placeholder="Please select a zone">-->
      <!--          <el-option label="Zone No.1" value="shanghai" />-->
      <!--          <el-option label="Zone No.2" value="beijing" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDialogData">
          送出
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  height: 100%;
  width: auto;
}

.AdminVue-TreeCategories {
  display: flex;
  justify-content: space-between;
  background-color: #d7e6c8;
  width: 100%;
  height: 100%;
}
</style>
