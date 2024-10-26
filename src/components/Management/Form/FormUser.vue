<script setup lang="ts">
import { ref } from 'vue';

import { formUserInterface } from "@/interface/ManagementInter/userInterface/formUserInterface";
import { useOnCancel } from "@/hooks/managementHooks/genericFormHooks/useGenericFormHooks.js";
import { cleanStringAndDateValue } from "@/utils/cleanStringAndDateValue";
import {
  getOptions, rules, ruleFormRef,
  useOnSubmit, useReceiveParentData, initializeRules
} from "@/hooks/managementHooks/genericFormHooks/useGenericFormHooks";
import { UserFilled } from '@element-plus/icons-vue'
// 初始化表單資料㊣
const form = ref<formUserInterface>({
  status: "",
  name: '',
  accountName: '',
  avatar: '',
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
// 送出表單
const onSubmit = useOnSubmit(ruleFormRef, form);//送出表單資料按鈕
// 取消表單
const onCancel = useOnCancel(form);//取消表單按鈕(清空表單資料並關閉視窗)
// 選項數據
const RoleOptions = getOptions("/ums/role");//從後端獲得選項資料

/**
 * 接收表格(父組件)點擊編輯按鈕時取得該行的數據,並回顯示表單上
 */
useReceiveParentData(form)//開啟監控props.inputFormData，若props.inputFormData有新值，代表為"update"，並執行對應的函數

/**
 * 上傳頭像
 */
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps ,UploadRawFile} from 'element-plus'

const imageUrl = ref('')
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
import axios from 'axios';
const handleAvatarChange = async (file: File) => {
  if (!beforeAvatarUpload(file as UploadRawFile)) {
    return;
  }
  console.log("handleAvatarChange...:",file);
  try {
    // 這裡替換為您的 MinIO 上傳 API
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('您的MinIO上傳API地址', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.url) {
      imageUrl.value = response.data.url;
      ElMessage.success('頭像上傳成功');
    } else {
      throw new Error('上傳失敗');
    }
  } catch (error) {
    console.error('上傳錯誤:', error);
    ElMessage.error('頭像上傳失敗，請稍後再試');
  }
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>

<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px" :rules="rules" ref="ruleFormRef">
    <el-form-item label="用戶名" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>

    <el-form-item label="帳號" prop="accountName">
      <el-input v-model="form.accountName" />
    </el-form-item>

    <el-form-item label="密碼" prop="password">
      <el-input v-model="form.password" />
    </el-form-item>

    <el-form-item label="確認密碼" prop="checkPassword">
      <el-input v-model="form.checkPassword" />
    </el-form-item>

    <el-form-item label="出生年月日" prop="birthday">
      <div class="block">
        <el-date-picker v-model="form.birthday" type="date" placeholder="Pick a day" :size="'default'"
          style="width: 100%;" />
      </div>
    </el-form-item>

    <el-form-item label="信箱" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>

    <el-form-item label="手機號" prop="phoneNumber">
      <el-input v-model="form.phoneNumber" />
    </el-form-item>

    <el-form-item label="地址" prop="address">
      <el-input v-model="form.address" />
    </el-form-item>

    <el-form-item label="權限" prop="roleId">
      <el-select v-model="form.roleId" placeholder="Select" style="width: 240px">
        <el-option v-for="item in RoleOptions" :key="item.value" :label="item.label" :value="item.label" />
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

    <el-form-item label="頭像" prop="avatar">
      <div class="avatar-container">
        <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false" :on-success="handleAvatarSuccess" :on-change="handleAvatarChange" :before-upload="beforeAvatarUpload"
          :auto-upload="true" ref="uploadRef">
          <el-avatar :src="imageUrl || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
            :size="100" />
        </el-upload>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">確定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.avatar-container {
  display: flex;
  justify-content: center;
}

.avatar-uploader {
  text-align: center;
}

.el-avatar {
  cursor: pointer;
}

/* 你可以在這裡添加自定義樣式 */
</style>
