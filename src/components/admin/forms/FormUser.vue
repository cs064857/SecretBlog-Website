<script setup lang="ts">
import { ref } from 'vue';
import http from "@/utils/httpRequest.js";
import { formUserInterface } from "@/interface/admin/formUserInterface";
import { useOnCancel } from "@/hooks/useGenericFormHooks";
import { cleanStringAndDateValue } from "@/utils/cleanStringAndDateValue";
import {
  rules, ruleFormRef,
  useOnSubmit, useReceiveParentData, initializeRules
} from "@/hooks/useGenericFormHooks";

//初始化表單資料
const form = ref<formUserInterface>({
  id: "",//用戶ID
  accountName: '',
  nickName: "",
  email: '',
  password: '',
  checkPassword: '',
  birthday: new Date(''),
  gender: "",
  address: '',
  phoneNumber: ''
});

initializeRules(form);//初始化Rules、從表格欄位中獲得資料

/**
 * 接收表格(父組件)點擊編輯按鈕時取得該行的數據,並回顯示表單上
 */
useReceiveParentData(form)//開啟監控props.inputFormData，若props.inputFormData有新值，代表為"update"，並執行對應的函數

// 送出表單
const onSubmit = useOnSubmit(ruleFormRef, form);//送出表單資料按鈕
// 取消表單
const onCancel = useOnCancel(form);//取消表單按鈕(清空表單資料並關閉視窗)
</script>

<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px" :rules="rules" ref="ruleFormRef">
    <el-form-item label="帳號" prop="accountName">
      <el-input v-model="form.accountName" placeholder="請輸入帳號(必填)" />
    </el-form-item>

    <el-form-item label="使用者名稱" prop="nickName">
      <el-input v-model="form.nickName" placeholder="可選，若未填寫將自動產生" />
    </el-form-item>

    <el-form-item label="信箱" prop="email">
      <el-input v-model="form.email" placeholder="請輸入信箱(必填)" />
    </el-form-item>

    <el-form-item label="密碼" prop="password">
      <el-input v-model="form.password" type="password" show-password placeholder="請輸入密碼(必填)" />
    </el-form-item>

    <el-form-item label="確認密碼" prop="checkPassword">
      <el-input v-model="form.checkPassword" type="password" show-password placeholder="請再次輸入密碼(必填)" />
    </el-form-item>

    <el-form-item label="出生年月日" prop="birthday">
      <div class="block">
        <el-date-picker v-model="form.birthday" type="date" placeholder="選擇日期(可選)" :size="'default'"
          style="width: 100%;" />
      </div>
    </el-form-item>

    <el-form-item label="性別" prop="gender">
      <el-radio-group v-model="form.gender">
        <el-radio :value="'male'">男</el-radio>
        <el-radio :value="'female'">女</el-radio>
        <el-radio :value="'other'">不願透露</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="地址" prop="address">
      <el-input v-model="form.address" placeholder="可選" />
    </el-form-item>

    <el-form-item label="手機號碼" prop="phoneNumber">
      <el-input v-model="form.phoneNumber" placeholder="可選，格式：0912345678" />
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
