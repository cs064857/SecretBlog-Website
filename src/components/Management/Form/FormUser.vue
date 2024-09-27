<script setup lang="ts">
import {nextTick, onBeforeMount, defineProps, onMounted, reactive, ref, watch} from 'vue';
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

// // 初始化表單資料
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
const isResetting = ref<boolean>(false);//設置標誌，表示正在重置表單
const actionType = ref<string>()
// const modifiedFields = new Map<string,any>();//使用Set代表唯一性,key即為數據內容本身
const modifiedFields = new Map<string,any>();//使用Set代表唯一性,key即為數據內容本身
// 提交表單
const onSubmit = async (formEl: FormInstance | null) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    console.log("actionType表單行為:",actionType.value)
    console.log('表單提交資料...');
    console.log('表單資料::', form.value);
    if(actionType.value==="update"){

      // //判斷修改了哪些內容
      // for (const field in props.inputFormData) {
      //   console.log("field",field)
      //   if(props.inputFormData[field]!=form.value[field]){
      //     const value = form.value[field]
      //     modifiedFields.set(field,value);
      //   }
      // }
      // // 在處理完所有字段後，將 Map 轉換為 JSON 對象
      // const modifiedFieldsJson = Object.fromEntries(modifiedFields);

      // 將 props.inputFormData 轉換為 Object.entries 陣列
      const modifiedFieldsJson = Object.entries(props.inputFormData as Record<string, any>)
          .reduce((acc, [field, originalValue]) => {
            // 從 form.value 中取得當前字段的值
            const newValue = (form.value as Record<string, any>)[field];
            // 如果新舊值不同，則將該字段及其新值加入累加器 acc
            if (newValue !== originalValue) {
              acc[field] = newValue;
            }
            return acc; // 返回累加器 acc
          }, {} as Record<string, any>); // 初始值為空物件

      console.log("修改資料...")
      // console.log("需修改資料內容:",modifiedFields)
      console.log("需修改資料內容:",modifiedFieldsJson)

      // const lastMmodifiedFieldsJson = {...modifiedFieldsJson,id:props.inputFormData.id,userInfoId:props.inputFormData.userInfoId}//加上用戶ID與用戶資訊ID
      // console.log("需修改資料內容:",lastMmodifiedFieldsJson)

      updateUserDataRequest(props,modifiedFieldsJson).then((data:R)=>{
        if(data.code==200){
          emit('dialogVisible', dialogVisible.value);
          console.log('表單視窗關閉...');
        }

      })

    }else if(actionType.value==="add"){
      console.log("新增資料...")
      // console.log("form.value",form.value)
      saveUserDataRequest(form.value).then(({data}:{data:R}) => {
        if (data.code == 200) {
          emit('dialogVisible', dialogVisible.value);
          // console.log('表單視窗關閉...');
          window.location.replace(window.location.href);
          //初始化清理表單資料
          cleanFormValue();
        }
      });

    }

  } catch (error) {
    console.log('表單驗證失敗', error);
  }

};


// 取消表單
const onCancel = () => {
  emit('dialogVisible', dialogVisible.value);
  console.log('表單視窗關閉...');
  nextTick(()=>{
    cleanFormValue();
  })

};

// 清空表單資料
const cleanFormValue = () => {
  isResetting.value = true; // 設置標誌，true表示正在重置表單
  form.value = {
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
  };
  // 等待下一個 tick 以確保表單數據已更新
  nextTick(() => {
    isResetting.value = false; // 取消標誌
    // 可選：清除驗證狀態
    ruleFormRef.value?.clearValidate();
  });
};

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
interface Option {
  value: string;
  label: string;
}



const options= ref<Option[] |null>(null);


/**
 * 表單驗證規則
 */
import {useRules} from "@/validation/formUserVaild.ts"

const rules = useRules(form.value,isResetting.value,options.value);
// 定義表單驗證規則

/**
 * 表單驗證規則/
 */

/**
 * 接收表格(父組件)點擊編輯按鈕時取得該行的數據,並回顯示表單上
 */
import {useactionTypeStore} from '@/pinia/useUserManagementFormStore.ts'
import {
  getOptionsRequest,
  getTableDataRequest,
  saveUserDataRequest,
  updateUserDataRequest
} from "@/requests/userRequest.js";
import {R} from "@/interface/R.ts";
import {formUserInterface} from "@/interface/formUserInterface.ts";
const actionTypeStore = useactionTypeStore();
const props =defineProps({
  inputFormData:{
        type: Object,
  }
})

const handleReceiveParentData=function (){
  console.log("執行handleReceiveParentData()")
  if(props.inputFormData){
    const inputFormData =props.inputFormData
    console.log("表單接收到父組件傳遞修改行的資料:",inputFormData)
    form.value = {...inputFormData,isResetting:true,checkPassword:inputFormData.password}// 設置標誌，true表示正在重置表單
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
