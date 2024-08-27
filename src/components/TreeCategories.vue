<script setup lang="ts">
import {reactive, ref} from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}
let id = 1000

 const append = (data: Tree) => {
  dialogFormVisible.value = true
  selectedData.value=data
}

// 對話框
let selectedData = ref<Tree | null>(null);//當前選中的節點
let dialogFormVisible = ref<boolean>(false)
const formLabelWidth = '140px'

const form = reactive({
  name: '',
  region: '',
})
const handleDialogData = function (){
  if(selectedData.value!=null){
    console.log("selectedData.value:",selectedData.value)
    dialogFormVisible.value=false
    //執行新增分類
    const newChild = { id: id++, label: 'testtest', children: [] }
    if (!selectedData.value.children) {
      selectedData.value.children = []
    }
    selectedData.value.children.push(newChild)
    dataSource.value = [...dataSource.value]

  }


}
// 對話框/

const remove = (node: Node, data: Tree) => {
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  dataSource.value = [...dataSource.value]
}

const renderContent = (
    h,
    {
      node,
      data,
      store,
    }: {
      node: Node
      data: Tree
      store: Node['store']
    }
) => {
  return h(
      'span',
      {
        class: 'custom-tree-node',
      },
      h('span', null, node.label),
      h(
          'span',
          null,
          h(
              'a',
              {
                onClick: () => append(data),
              },
              'Append '
          ),
          h(
              'a',
              {
                style: 'margin-left: 8px',
                onClick: () => remove(node, data),
              },
              'Delete'
          )
      )
  )
}

const dataSource = ref<Tree[]>([
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
])
</script>

<template>
  <div class="AdminVue-TreeCategories">

    <div class="custom-tree-container">
      <p>Using render-content</p>
      <el-tree
          style="max-width: 600px"
          :data="dataSource"
          show-checkbox
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :render-content="renderContent"
      />
    </div>

    <div class="custom-tree-container">
      <p>Using scoped slot</p>
      <el-tree
          style="max-width: 600px"
          :data="dataSource"
          show-checkbox
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <a @click="append(data)"> Append </a>
            <a style="margin-left: 8px" @click="remove(node, data)"> Delete </a>
          </span>
        </span>

        </template>
      </el-tree>

    </div>

  </div>

  <el-dialog v-model="dialogFormVisible" title="Shipping address" width="500">
    <el-form :model="form">
      <el-form-item label="Promotion name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Zones" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
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
.AdminVue-TreeCategories{
  display: flex;
  justify-content: space-between;
background-color: #d7e6c8;
  width: 100%;
  height: 100%;
}
</style>
