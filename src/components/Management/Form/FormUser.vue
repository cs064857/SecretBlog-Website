<script setup lang="ts">
import {nextTick, onBeforeMount, defineProps, onMounted, reactive, ref, watch, Ref} from 'vue';
import {ElMessage, FormInstance, FormRules} from 'element-plus';


import {
  getOptionsRequest,
  getTableDataRequest,
  saveUserDataRequest,
  updateUserDataRequest
} from "@/requests/userRequest.js";
import {R} from "@/interface/R";
import {formUserInterface} from "@/interface/ManagementInter/formUserInterface";
import {FormProps, useOnCancel} from "@/hooks/managementHooks/formHooks/useFormHooks.js";
import {cleanStringAndDateValue} from "@/utils/cleanStringAndDateValue";
import {

  dialogVisible,
  getOptions, rules, ruleFormRef,
  saveUserData,
  updateUserData,
  useOnSubmit, useReceiveParentData, initializeRules
} from "@/hooks/managementHooks/formHooks/useFormHooks";

// 初始化表單資料
const form = ref<formUserInterface>({
  status:"",
  name: '',
  accountName: '',
  password: '',
  checkPassword: '',
  birthday: new Date(''),
  gender: "",
  roleId: '',
  email: '',
  address: '',
  phoneNumber: ''

  // status:"Normal",
  // name: '測試1',
  // accountName: 'testtest1',
  // password: 'testpassword1',
  // checkPassword: 'testpassword1',
  // birthday: new Date('1970-01-01'),
  // gender: "male",
  // roleId: '',
  // email: 'testtestemail@gmail.com',
  // address: '秘密',
  // phoneNumber: '0900000000'
});
initializeRules(form);//初始化Rules

const props = defineProps<FormProps>();//修改表單資料時回顯原表單數據

// 定義事件


//表單行為(add or update)
// const actionType = ref<string>()

const onSubmit = useOnSubmit(ruleFormRef,props,form);//送出表單資料按鈕
// 取消表單
const onCancel =useOnCancel(form);//取消表單按鈕(清空表單資料並關閉視窗)
// 選項數據
const options = getOptions();//從後端獲得選項資料

useReceiveParentData(props,form)//開啟監控props.inputFormData，若props.inputFormData有新值，代表為"update"，並執行對應的函數
/**
 * 表單驗證規則
 */
import {useRules} from "@/validation/formUserVaild"
// let rules;
// rules = useRules(form.value,options);
// 定義表單驗證規則

/**
 * 表單驗證規則/
 */

/**
 * 接收表格(父組件)點擊編輯按鈕時取得該行的數據,並回顯示表單上
 */



// const actionTypeStore = useactionTypeStore();


// const handleReceiveParentData=function (){
//   console.log("執行handleReceiveParentData()")
//   if(props.inputFormData){
//     const inputFormData =<formUserInterface>props.inputFormData
//     console.log("表單接收到父組件傳遞修改行的資料:",inputFormData)
//     form.value = {...inputFormData,checkPassword:inputFormData.password}// 將確認密碼欄位回填與密碼相同值
//     rules = useRules(form.value,options);
//   }
// }
//
// watch(
//     () => props.inputFormData,
//     (newValue, oldValue, onCleanup)=>{
//       console.log("FormUser接收到UserManagement資料")
//       actionType.value=actionTypeStore.getactionType//從pinia中獲取actionType值
//       handleReceiveParentData();
//     },
//     { immediate: true,deep:true}
// );




/**
 * 接收表格(父組件)點擊編輯按鈕時取得該行的數據,並回顯示表單上/
 */

</script>

<template>
  <el-form
      :model="form"
      label-width="auto"
      style="max-width: 600px"
      :rules="rules"
      ref="ruleFormRef"
  >
    <el-form-item label="用戶名" prop="name">
      <el-input v-model="form.name"/>
    </el-form-item>

    <el-form-item label="帳號" prop="accountName">
      <el-input v-model="form.accountName"/>
    </el-form-item>

    <el-form-item label="密碼" prop="password">
      <el-input v-model="form.password"/>
    </el-form-item>

    <el-form-item label="確認密碼" prop="checkPassword">
      <el-input v-model="form.checkPassword"/>
    </el-form-item>

    <el-form-item label="出生年月日" prop="birthday">
      <div class="block">
        <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="Pick a day"
            :size="'default'"
            style="width: 100%;"
        />
      </div>
    </el-form-item>

    <el-form-item label="信箱" prop="email">
      <el-input v-model="form.email"/>
    </el-form-item>

    <el-form-item label="手機號" prop="phoneNumber">
      <el-input v-model="form.phoneNumber"/>
    </el-form-item>

    <el-form-item label="地址" prop="address">
      <el-input v-model="form.address"/>
    </el-form-item>

    <el-form-item label="權限" prop="roleId">
      <el-select
          v-model="form.roleId"
          placeholder="Select"
          style="width: 240px"
      >
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="狀態" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio :value="'Normal'">正常</el-radio>
        <el-radio :value="'Ban'">封禁</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="性別" prop="gender">
      <el-radio-group v-model="form.gender">
        <el-radio :value="'male'">男</el-radio>
        <el-radio :value="'female'">女</el-radio>
        <el-radio :value="'other'">不願透露</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit(ruleFormRef)">確定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
/* 你可以在這裡添加自定義樣式 */
</style>
