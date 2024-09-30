<script setup lang="ts">
import {nextTick, onBeforeMount, defineProps, onMounted, reactive, ref, watch, Ref} from 'vue';
import {ElMessage, FormInstance, FormRules} from 'element-plus';



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
});

const props =defineProps({
  inputFormData:{
    type: Object,
  }
})
// 初始化表單資料
// const form = ref<formUserInterface>({
//   status:"Normal",
//   name: '測試1',
//   accountName: 'testtest1',
//   password: 'testpassword1',
//   checkPassword: 'testpassword1',
//   birthday: new Date('1970-01-01'),
//   gender: "male",
//   roleId: '',
//   email: 'testtestemail@gmail.com',
//   address: '秘密',
//   phoneNumber: '0900000000'
// });

// 定義事件
const emit = defineEmits(['dialogVisible']);
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance | null>(null);

const actionType = ref<string>()
// const modifiedFields = new Map<string,any>();//使用Set代表唯一性,key即為數據內容本身
const modifiedFields = new Map<string,any>();//使用Set代表唯一性,key即為數據內容本身


// const onSubmit = async (formEl: FormInstance | null,actionType:Ref<string>,form:Ref<Object>,props:Ref<Object>) => {
// // const onSubmit = async (formEl: FormInstance | null) => {
//   if (!formEl) return;
//   try {
//     await formEl.validate();
//     console.log("actionType表單行為:",actionType.value)
//     console.log('表單提交資料...');
//     console.log('表單資料::', form.value);
//
//     if(actionType.value==="update"){
//       updateUserData(props,form)
//     }else if(actionType.value==="add"){
//       saveUserData(form)
//     }
//
//   } catch (error) {
//     console.log('表單驗證失敗', error);
//   }
//
// }


const onSubmit = useOnSubmit(ruleFormRef,actionType,props,form,dialogVisible,emit);

// 取消表單
const onCancel =useOnCancel(emit,form,ruleFormRef,dialogVisible);


// 清空表單資料


// 選項數據

const getOptions=function (){

  getOptionsRequest().then((data:R) => {
    console.log("getOptions",data)
      if(data.code==200){
        options.value=data.data.map(item=>({
          value:item.id,
          label:item.roleName
        }));
        console.log("options",options)
      }
  })

}

onBeforeMount(()=>{
  getOptions()
})

// 定義選項的介面
import {Option} from "@/interface/formOption";
const options= ref<Option[] |null>(null);


/**
 * 表單驗證規則
 */
import {useRules} from "@/validation/formUserVaild"
let rules;
rules = useRules(form.value,options);
// 定義表單驗證規則

/**
 * 表單驗證規則/
 */

/**
 * 接收表格(父組件)點擊編輯按鈕時取得該行的數據,並回顯示表單上
 */
import {useactionTypeStore} from '@/pinia/useUserManagementFormStore'
import {
  getOptionsRequest,
  getTableDataRequest,
  saveUserDataRequest,
  updateUserDataRequest
} from "@/requests/userRequest.js";
import {R} from "@/interface/R";
import {formUserInterface} from "@/interface/ManagementInter/formUserInterface";
import {cleanStringAndDateValue} from "@/utils/cleanStringAndDateValue";
import {
  cleanFormValue,
  onSubmit,
  saveUserData,
  updateUserData,
  useOnSubmit
} from "@/hooks/managementHooks/formHooks/useFormHooks";
import {useOnCancel} from "@/hooks/managementHooks/formHooks/useFormHooks.js";

const actionTypeStore = useactionTypeStore();


const handleReceiveParentData=function (){
  console.log("執行handleReceiveParentData()")
  if(props.inputFormData){
    const inputFormData =<formUserInterface>props.inputFormData
    console.log("表單接收到父組件傳遞修改行的資料:",inputFormData)
    form.value = {...inputFormData,checkPassword:inputFormData.password}// 設置標誌，true表示正在重置表單
    rules = useRules(form.value,options);
    // console.log("ipp",ipp)
    // form.value=ipp




  }
}

watch(
    () => props.inputFormData,
    (newValue, oldValue, onCleanup)=>{
      console.log("FormUser接收到UserManagement資料")
      actionType.value=actionTypeStore.getactionType
      handleReceiveParentData();
    },
    { immediate: true,deep:true}
);




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
