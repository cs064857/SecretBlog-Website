<script setup lang="ts">
import {
  AllowedComponentProps, ComponentCustomProps,
  ComponentInternalInstance,
  ComponentOptionsBase, nextTick,
  PropType,
  reactive,
  ref,
  VNodeProps
} from 'vue';
import {FormInstance, FormRules} from 'element-plus';

// 定義表單資料接口
interface Form {
  name: string;
  accountName: string;
  password: string;
  checkPassword: string;
  birthday: Date;
  gender: number;
  role: string;
  email: string;
  address: string;
  phoneNumber: string;
}

// // 初始化表單資料
// const form = ref<Form>({
//   name: '',
//   accountName: '',
//   password: '',
//   checkPassword: '',
//   birthday: new Date(''),
//   gender: 0,
//   role: '',
//   email: '',
//   address: '',
//   phoneNumber: ''
// });
// 初始化表單資料
const form = ref<Form>({
  name: '測試1',
  accountName: 'testtest1',
  password: 'testpassword1',
  checkPassword: 'testpassword1',
  birthday: new Date('1970-01-01'),
  gender: 0,
  role: "Option5",
  email: 'testtestemail@gmail.com',
  address: '秘密',
  phoneNumber: '0900000000'
});

// 定義事件
const emit = defineEmits(['dialogVisible']);
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance | null>(null);
const isResetting = ref(false);//設置標誌，表示正在重置表單
// 提交表單
const onSubmit = async (formEl: FormInstance | null) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    console.log('表單提交資料...');
    emit('dialogVisible', dialogVisible.value);
    console.log('表單視窗關閉...');
    console.log('表單資料::', form.value);

    cleanFormValue();

  } catch (error) {
    console.log('表單驗證失敗', error);
  }
};



// 取消表單
const onCancel = () => {
  emit('dialogVisible', dialogVisible.value);
  console.log('表單視窗關閉...');
  cleanFormValue();
};

// 清空表單資料
const cleanFormValue = () => {
  isResetting.value = true; // 設置標誌，true表示正在重置表單
  form.value = {
    name: '',
    accountName: '',
    password: '',
    checkPassword: '',
    birthday: new Date(''),
    gender: 0,
    role: '',
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
const options = [
  {value: 'Option1', label: 'Option1'},
  {value: 'Option2', label: 'Option2'},
  {value: 'Option3', label: 'Option3'},
  {value: 'Option4', label: 'Option4'},
  {value: 'Option5', label: 'Option5'},
];

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
const validateGender = (rule: any, value: number, callback: any) => {
  const validGenders = [0, 1, 2]; // 假設 0: 男, 1: 女, 2: 不願透露
  if (validGenders.includes(value)) {
    callback();
  } else {
    callback(new Error('請選擇性別'));
  }
};

// 驗證角色是否被選擇
const validateRole = (rule: any, value: string, callback: any) => {
  if (isResetting.value==true) {//代表執行的是初始化表單數據,不進行校驗
    callback(); // 跳過驗證
    return;
  }
  const validRoles = options.map(option => option.value);
  console.log("value",value)
  if (validRoles.includes(value)) {
    callback();
  } else {
    callback(new Error('請選擇權限'));
  }
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
    {validator: validateGender, trigger: 'change'},
  ],
  role: [
    {validator: validateRole, trigger: 'change'},
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
      <el-input v-model="form.password" type="password"/>
    </el-form-item>

    <el-form-item label="確認密碼" prop="checkPassword">
      <el-input v-model="form.checkPassword" type="password"/>
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

    <el-form-item label="權限" prop="role">
      <el-select
          v-model="form.role"
          placeholder="Select"
          style="width: 240px"
      >
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="性別" prop="gender">
      <el-radio-group v-model="form.gender">
        <el-radio :value="0">男</el-radio>
        <el-radio :value="1">女</el-radio>
        <el-radio :value="2">不願透露</el-radio>
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
