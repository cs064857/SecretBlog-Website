<script setup lang="ts">
import {nextTick, onBeforeMount, defineProps, onMounted, reactive, ref, watch} from 'vue';
import {ElMessage, FormInstance, FormRules} from 'element-plus';
import http from "@/utils/httpRequest"

// 定義表單資料接口
interface Form {
  status:string
  name: string;
  accountName: string;
  password: string;
  checkPassword: string;
  birthday: Date;
  gender: string;
  roleId: string;
  email: string;
  address: string;
  phoneNumber: string;
}

// 初始化表單資料
const form = ref<Form>({
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
// const form = ref<Form>({
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
const isResetting = ref(false);//設置標誌，表示正在重置表單
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
      http({
          url: http.adornUrl(`/ums/user/userDetails/${props.inputFormData.id}/${props.inputFormData.userInfoId}`),
          method: 'put',
          data: http.adornData(modifiedFieldsJson, false)
      }).then(({data}) => {

      if(data.code==200){
              ElMessage.success("修改用戶數據成功");
              emit('dialogVisible', dialogVisible.value);
              console.log('表單視窗關閉...');
              window.location.replace(window.location.href);
          }else{
              ElMessage.error("修改用戶數據失敗");
          }
      });


    }else if(actionType.value==="add"){
      console.log("新增資料...")
      http({
        url: http.adornUrl('/ums/user'),
        method: 'post',
        data: http.adornData(form.value, false)
      }).then(({data}: { data: any }) => {
        if (data.code == 200) {
          ElMessage.success("新增使用者數據成功");
          emit('dialogVisible', dialogVisible.value);
          console.log('表單視窗關閉...');
          window.location.replace(window.location.href);
          //初始化清理表單資料
          cleanFormValue();
        } else {
          ElMessage.error("新增使用者數據失敗");
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
  http({
      url: http.adornUrl('/ums/role'),
      method: 'get',
      params: http.adornParams({})
  }).then(({data}) => {
      if(data.code==200){
        console.log("Role數據",data.data)

        options.value=data.data.map(item=>({
          value:item.id,
          label:item.roleName
        }));
        console.log("options",options)
          ElMessage.success("獲取權限數據成功");
      }else{
          ElMessage.error("獲取權限數據失敗");
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
// let searchOptions:Option[];

// const searchOptions = [
//   {value: '1', label: 'Option1'},
//   {value: '2', label: 'Option2'},
//   {value: '3', label: 'Option3'},
//   {value: '4', label: 'Option4'},
//   {value: '5', label: 'Option5'},
// ];

// 表單驗證規則

// 驗證確認密碼
const validateCheckPassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('請確認密碼'));
  } else if (value === form.value.password) {
    callback();
  } else {
    callback(new Error('兩次密碼輸入不一致！'));
  }
};

// 驗證生日是否為有效日期且不在未來
const validateBirthday = (rule: any, value: Date, callback: any) => {
  if (!value) {
    callback(new Error('生日是必填項'));
  } else {
    const today = new Date();
    if (value > today) {
      callback(new Error('生日不能是未來的日期'));
    } else {
      callback();
    }
  }
};

// 驗證性別是否被選擇
const validateGender = (rule: any, value: string, callback: any) => {
  const validGenders = ["male", "female","other"];
  console.log("選擇的性別:",value)
  const includes = validGenders.includes(value);
  console.log("性別includes:",includes)
  if (includes) {
    callback()
  } else {
    callback(new Error('請選擇性別'));
  }
};

// 驗證角色是否被選擇
const validateRole = (rule: any, value: string, callback: any) => {
  if (isResetting.value == true) {//代表執行的是初始化表單數據,不進行校驗
    callback(); // 跳過驗證
    return;
  }

  const validRoles = options.value.map(option => option.label);
  console.log("validRoles", validRoles)
  // const validRoles = searchOptions.map(option => option.value);

  // const some =validRoles.some(item => item==value)
  const includes = validRoles.includes(value);
  // console.log("some", some)
  // console.log("includes", includes)

  console.log("value", value)
  if (includes) {
    callback();
  } else {
    callback(new Error('請選擇權限'));
  }
};

const validateStatus = (rule: any, value: string, callback: any) => {
  console.log("validateStatus.value:",value)
  if (!value) {
    callback(new Error('狀態是必填項'));
  }
  callback();
  // else {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (emailRegex.test(value)) {
  //     callback();
  //   } else {
  //     callback(new Error('請輸入有效的電子郵件'));
  //   }
  // }
};


// 驗證電子郵件格式
const validateEmail = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('電子郵件是必填項'));
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      callback();
    } else {
      callback(new Error('請輸入有效的電子郵件'));
    }
  }
};

// 驗證手機號碼格式（假設為台灣手機號碼）
const validatePhoneNumber = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('手機號碼是必填項'));
  } else {
    const phoneRegex = /^09\d{8}$/;
    if (phoneRegex.test(value)) {
      callback();
    } else {
      callback(new Error('請輸入有效的手機號碼，例如 0912345678'));
    }
  }
};

// 定義表單驗證規則
const rules = reactive<FormRules<Form>>({
  name: [
    {type: 'string', required: true, message: '必填', trigger: 'blur'},
    {min: 1, max: 10, message: '用戶名長度必須介於1到10個半形字元之間', trigger: 'blur'},
  ],
  accountName: [
    {type: 'string', required: true, message: '必填', trigger: 'blur'},
    {min: 6, max: 30, message: '帳號長度必須介於6到30個半形字元之間', trigger: 'blur'},
  ],
  address: [
    {type: 'string', required: false, trigger: 'blur'},
  ],
  password: [
    {type: 'string', required: true, message: '必填', trigger: 'blur'},
    {min: 8, max: 30, message: '密碼長度至少須為8個字元', trigger: 'blur'},
    {max: 30, message: '密碼長度至多為30個字元', trigger: 'blur'},
  ],
  checkPassword: [
    {type: 'string', required: true, message: '必填', trigger: 'blur'},
    {validator: validateCheckPassword, trigger: 'blur'},
  ],
  birthday: [
    {validator: validateBirthday, trigger: 'blur'},
  ],
  gender: [
    {validator: validateGender, trigger: 'blur'},
  ],
  roleId: [
    {validator: validateRole, trigger: 'blur'},
  ],
  status:[
    {validator: validateStatus, trigger: 'blur'}
  ],
  email: [
    {type: 'string', required: true, message: '必填', trigger: 'blur'},
    {validator: validateEmail, trigger: 'blur'},
  ],
  phoneNumber: [
    {type: 'string', required: true, message: '必填', trigger: 'blur'},
    {validator: validatePhoneNumber, trigger: 'blur'},
  ],
});
/**
 * 接收表格(父組件)點擊編輯按鈕時取得該行的數據,並回顯示表單上
 */
import {useactionTypeStore} from '@/pinia/useUserManagementFormStore.ts'
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
    const ipp = {...inputFormData,isResetting:true,checkPassword:inputFormData.password}// 設置標誌，true表示正在重置表單
    console.log("ipp",ipp)
    form.value=ipp




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
