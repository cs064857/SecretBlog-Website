<script setup lang="ts">
import { computed, ref } from 'vue';
import http from "@/utils/httpRequest.js";
import { formUserInterface } from "@/interface/admin/formUserInterface";
import { useOnCancel } from "@/hooks/useGenericFormHooks";
import { cleanStringAndDateValue } from "@/utils/cleanStringAndDateValue";
import {
  getOptions, rules, ruleFormRef,
  useOnSubmit, useReceiveParentData, initializeRules
} from "@/hooks/useGenericFormHooks";
import { UserFilled } from '@element-plus/icons-vue'
// 初始化表單資料㊣
const form = ref<formUserInterface>({
  id:"",//用戶ID
  status: "",
  name: "",
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

  // id:"",//用戶ID
  // status: "Normal",
  // name: '測試1',
  // accountName: 'testtest1',
  // avatar: '',
  // password: 'testpassword1',
  // checkPassword: 'testpassword1',
  // birthday: new Date('1970-01-01'),
  // gender: "male",
  // roleId: '',
  // email: 'testtestemail@gmail.com',
  // address: '秘密',
  // phoneNumber: '0900000000'
});
const tempAvatar =ref<String>('')
initializeRules(form);//初始化Rules、從表格欄位中獲得資料

// 選項數據
const RoleOptions = getOptions("/ums/role");//從後端獲得選項資料

/**
 * 接收表格(父組件)點擊編輯按鈕時取得該行的數據,並回顯示表單上
 */
useReceiveParentData(form,tempAvatar)//開啟監控props.inputFormData，若props.inputFormData有新值，代表為"update"，並執行對應的函數

/**
 * 上傳頭像
 */
import { ElMessage } from 'element-plus'


import type { UploadProps ,UploadRawFile} from 'element-plus'
import { useActionTypeStore } from '@/pinia/useFormStore';


/**
 * MinIO上傳圖片
 */
//上傳之前判斷

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!rawFile || !rawFile.type) return false;//若檔案為空則禁止上傳
  console.log("beforeAvatarUpload...type:",rawFile.type);
  if (!rawFile.type.startsWith('image')) {//上傳的必須是圖片檔案
    ElMessage.error('Avatar picture must be image format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {//上傳的圖片大小不能超過2MB
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  console.log("beforeAvatarUpload...rawFile:",rawFile);
  // form.value.avatar={
  //   raw:rawFile,
  //   uid:rawFile.uid.toString()
  // }
  form.value.avatar = rawFile as File; // 直接設置為 File 對象

// 創建預覽 URL

  tempAvatar.value = URL.createObjectURL(rawFile)
  // form.value.avatar = URL.createObjectURL(rawFile)
  console.log("beforeAvatarUpload...form.value.avatar:",form.value.avatar);


  // 禁止上傳，使用其他方法在點擊確認後上傳至MinIo
  return false
}

// 送出表單
const onSubmit = useOnSubmit(ruleFormRef, form);//送出表單資料按鈕
// 取消表單
const onCancel = useOnCancel(form);//取消表單按鈕(清空表單資料並關閉視窗)

//上傳成功
// const handleAvatarSuccess: UploadProps['onSuccess'] = (
//   response,
//   uploadFile
// ) => {
//   console.log("handleAvatarSuccess...:",response);
//   // form.value.avatar = response.data
//   tempAvatar.value = URL.createObjectURL(uploadFile.raw!)
// }

/**
 * 判斷當前是否為新增模式，若為新增模式，則不顯示頭像欄位
 */
const actionTypeStore = useActionTypeStore();
// 計算屬性，判斷當前是否為新增模式
const isAddMode = computed(() => actionTypeStore.actionType === 'add');
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

    <el-form-item v-if="!isAddMode" label="頭像" prop="avatar">
      <div class="avatar-container">
        <el-upload class="avatar-uploader" action="#"
          :show-file-list="false"  :before-upload="beforeAvatarUpload"
           ref="uploadRef">
          <el-avatar :src="tempAvatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
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
