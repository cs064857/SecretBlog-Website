<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import http from '@/utils/httpRequest'
import {ElMessage} from "element-plus";
import {ConfirmDelete} from '@/hooks/useMessageBox'
import {useTreeCategoryStore} from '@/pinia/useTreeCategoryStore'
import {R} from "@/interface/R";

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

const append = (data: Tree) => {
  formActions.value = "append"
  dialogFormVisible.value = true
  selectedData.value = data//當前選種節點的數據
}

// 對話框
let selectedData = ref<Tree | null>(null);//當前選中的節點數據
let dialogFormVisible = ref<boolean>(false)
let formActions = ref<string>('')
const formLabelWidth = '140px'

//表單中輸入的數據
const form = reactive({
  categoryName: '',
})
const handleDialogConfirm = function () {
  dialogFormVisible.value = false
  if (formActions.value == 'handleDialogAddLevelOne') {
    http({
      url: http.adornUrl('/article/category/save'),
      method: 'post',
      data: http.adornData({parentId: 0, categoryName: form.categoryName, categoryLevel: 1}, false)
    }).then(({data}) => {
      if (data.code == "200") {
        showSuccessAndRefresh("新增分類數據成功")
      } else {
        ElMessage.error("新增分類數據錯誤");
      }
    });
  } else if (formActions.value == 'append') {
    if (selectedData.value != null) {
      console.log("selectedData.value:", selectedData.value)
      console.log("form.name:", form.categoryName)
      //執行新增分類
      http({
        url: http.adornUrl('/article/category/save'),
        method: 'post',
        //參數1為當前選種節點分類的id,參數2為欲添加輸入的分類名稱
        data: http.adornData({parentId: selectedData.value.id, categoryName: form.categoryName}, false)
      }).then(({data}) => {
        if (data.code == "200") {
          showSuccessAndRefresh("新增分類數據成功")
        } else {
          //elementPlus的Message消息提示組件
          ElMessage.error("新增分類數據失敗")
        }

      });
      // form.categoryName=''//清除表單數據

    }
  }
  form.categoryName = ''//清除表單數據
  formActions.value = ''//清除表單動作
}
// 對話框/
// 從後端獲取分類數據
const getCategoryList = function () {
  http({
    url: http.adornUrl('/article/category/tree/list'),
    method: 'get',
    params: http.adornParams({})
  }).then(({data}) => {
    if (data.code == "200") {
      console.log("data", data)
      //將數據放入樹形控件數據源中展示
      dataSource.value = data.data
      //將數據放入pinia中保存,讓編輯器中的選擇器TreeSelect調用
      useTreeCategoryStore().setTreeData(data.data)
    } else {
      ElMessage.error("獲取分類數據錯誤");
    }
  })
}

// 成功訊息顯示完成後再刷新，避免訊息一閃而過
const showSuccessAndRefresh = (message: string) => {
  ElMessage({
    message,
    type: 'success',
    duration: 800,
    onClose: () => {
      getCategoryList()
    },
  })
}

onMounted(() => {
  getCategoryList()//從後端獲取分類數據

})


// 從後端獲取分類數據
// 編輯分類
// 編輯修改按鈕及功能/
const handleEdit = function (node, data) {
  console.log("node:", node)
  form.categoryName = node.label;// 將node的categoryName回顯給表單模型
  selectedData.value = node
  dialogFormVisibleEditLevelOne.value = true
}
// 編輯修改按鈕及功能
const dialogFormVisibleEditLevelOne = ref<boolean>(false)
const handleDialogEditLevelOne = function () {
  // console.log("form", form);
  http({
    url: http.adornUrl(`/article/category/${selectedData.value.data.id}`),
    method: 'put',
    data: http.adornData(form.categoryName, false)
  }).then(({data}: { data: R }) => {
    if (data.code == "200") {
      showSuccessAndRefresh("修改分類數據成功")
    } else {
      ElMessage.error("修改分類數據錯誤");
    }
    dialogFormVisibleEditLevelOne.value = false
  });
  form.categoryName = ''//清空表單輸入數據
  selectedData.value = ''//清空選中的節點數據
}
// 編輯修改按鈕及功能/


// 編輯分類/
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
          if (data.code == "200") {
            showSuccessAndRefresh("刪除數據成功")
          } else {
            ElMessage.error("刪除數據錯誤")
          }
        });
      })
      .catch(() => {
        ElMessage.error("已取消")
      })
}
// 移除分類/
// 拖曳節點
const handleDrag = function (before, after, inner) {
  console.log("before:", before)
  console.log("after:", after)
  console.log("inner:", inner)
  let beforeId = before.key
  let afterParentId = ref<number>()
  let afterLevel = (-1);
  //如果是拖曳至該父類下的子節點前後即為"after" or "before",則after(放置位置)的數據會是該子節點
  if (inner == "before" || inner == "after") {
    //將拖曳前的父類改成拖曳後位置的父類
    before.parent = after.parent

    before.level = after.level
    afterLevel = after?.level ?? -1
    console.log("before.level", before.level)
    console.log("after.level", after.level)
    console.log("refAfterLevel", afterLevel)


    afterParentId = after.parent.data.id ?? 0 //如果 after.data.id 存在，使用它，否則parentId為0
    console.log("after.parent.data.id:", after.parent.data.id)
  } else if (inner == "inner") {//"inner"代表是直接往該父類節點上放置,則after(放置位置)的數據會是該父節點
    before.parent = after.data
    // parentId=after.data.id
    afterParentId = after.data.id ?? 0 // 如果 after.data.id 存在，使用它，否則parentId為0
    console.log("after.data.id:", after.data.id)
  }
  console.log("beforeId:", beforeId)
  console.log("afterParentId:", afterParentId)


  http({
    url: http.adornUrl(`/article/category/update/${beforeId}/${afterParentId}/${afterLevel}`),
    method: 'post',
  }).then(({data}) => {
    if(data.code==200){//若請求成功
      ElMessage.success("拖曳文章分類成功")
    }else {
      ElMessage.error("拖曳文章分類失敗")
    }
    getCategoryList()
  });
}
// 拖曳節點/
// 判斷節點是否可被放置
const handleAllowDrop = function (draggingNode, dropNode, type) {
  // console.log("draggingNode",draggingNode)
  // console.log("dropNode",dropNode)
  // console.log("draggingNode.parent.key",draggingNode.parent.key)
  // console.log("dropNode.parent.key",dropNode.parent.key)

  if (draggingNode.parent.key === dropNode.parent.key) return false; // 若是拖曳在同個父節點下則禁止拖曳(禁止僅是換個排序)

  if (draggingNode.level === 1 && draggingNode.childNodes.length>0) return false; // 如果被拖拽節點在1級且有子節點，則不允許拖拽(禁止節點level超過2個)
  if (dropNode.level >= 2 && type === "inner") return false;//(禁止節點level超過2個)
  if (dropNode.level >= 3 && ["after", "before"].includes(type)) return false;//(禁止節點level超過2個)


  return true;


  // if(draggingNode.parent.key == dropNode.parent.key){ //拖曳前後若是同個父類的話(代表在同個父類中只是換個排序位置)禁止托跩
  //   return false;
  // }else if (dropNode.level>=2 && type=="inner"||(dropNode.level>=3 &&(type=="after"||type=="before"))){//拖曳到2級或以上的節點內禁止放置
  //   return false;
  // }
  // else if(draggingNode.level==1&&draggingNode.childNodes!=null){
  //   return false
  // }
  // else {
  //   return true;
  // }

}
// 判斷節點是否可被放置/

// 開關托拽功能
const draggable = ref<boolean>(false);
// 開關托拽功能/

// 新增一級分類
//點擊新增按鈕後開啟對話框
const handleAddLevelOneCategory = function () {
  formActions.value = "handleDialogAddLevelOne"
  dialogFormVisible.value = true

}
// 新增一級分類/

// 樹形控件數據源
const dataSource = ref<Tree[]>([]);
// 樹形控件數據源/
</script>

<template>
  <div class="AdminVue-TreeCategories">
    <el-scrollbar height="100%" always class="tree-scrollbar">
      <div class="custom-tree-container">
        <el-switch
            v-model="draggable"
            class="mb-2"
            active-text="開啟拖曳"
            inactive-text="關閉拖曳"
        />
        <br>
        <el-button style="max-width: 11vh;min-width: 11vh;height: auto" @click="handleAddLevelOneCategory" type="primary"
                   round>新增一級分類
        </el-button>
        <el-tree
            style="max-width: 600px"
            :data="dataSource"
            show-checkbox
            @node-drop="handleDrag"
            node-key="id"
            default-expand-all
            :draggable="draggable"
            :allow-drop="handleAllowDrop"
            :expand-on-click-node="false"
        >
          <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <a v-if="node.level<2" style="padding-left: 10px;color:#409eff" @click="append(data)"> Append </a>
            <a style="padding-left: 10px;color:#67C23A;" @click="handleEdit(node, data)"> Edit </a>
            <a v-if="node.childNodes.length==0" style="padding-left: 10px ;color:#f56c6c" @click="remove(node, data)"> Delete </a>
          </span>
        </span>

          </template>
        </el-tree>

      </div>
    </el-scrollbar>

  </div>
  <!-- 新增分類表單 -->
  <el-dialog v-model="dialogFormVisible" title="新增分類" width="500">
    <el-form :model="form">
      <el-form-item label="分類名稱" :label-width="formLabelWidth">
        <el-input v-model="form.categoryName" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDialogConfirm">
          送出
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 編輯修改按鈕及功能/ -->
  <el-dialog v-model="dialogFormVisibleEditLevelOne" title="編輯修改分類" width="500">
    <el-form :model="form">
      <el-form-item label="分類名稱" :label-width="formLabelWidth">
        <el-input v-model="form.categoryName" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisibleEditLevelOne = false">Cancel</el-button>
        <el-button type="primary" @click="handleDialogEditLevelOne">
          送出
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 編輯修改按鈕及功能/ -->

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
  justify-content: flex-start;
  align-items: stretch;
  background-color: var(--bg-hex-d7e6c8);
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 16px;
  box-sizing: border-box;
}

.tree-scrollbar {
  width: 100%;
  height: 100%;
}

.custom-tree-container {
  width: 100%;
}
</style>
