import {reactive, ref, Ref} from "vue";
import {FormRules} from "element-plus";

/**
 * 校驗
 */
//驗證電子郵件格式
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

//驗證手機號碼格式(可選欄位)
const validatePhoneNumber = (rule: any, value: string, callback: any) => {
    if (!value || value.trim() === '') {
        //手機號碼為可選欄位，允許為空
        callback();
    } else if (value === '*') {
        //\"*\"代表不修改手機號，跳過驗證
        callback();
    } else {
        const phoneRegex = /^09\d{8}$/;
        if (phoneRegex.test(value)) {
            callback();
        } else {
            callback(new Error('請輸入有效的手機號碼，例如 0912345678'));
        }
    }
};
//驗證確認密碼
const validateCheckPassword = (rule: any, value: any, callback: any,form:any) => {
    console.log("validateCheckPassword...value:",value,"form:",form)

    if (!value) {
        callback(new Error('請確認密碼'));
    } else if (value === form.password) {
        callback();
    } else {
        callback(new Error('兩次密碼輸入不一致！'));
    }
};

//驗證生日是否為有效日期且不在未來(可選欄位)
 const validateBirthday = (rule: any, value: Date, callback: any) => {
    if (!value) {
        //生日為可選欄位，允許為空
        callback();
    } else {
        const today = new Date();
        if (value > today) {
            callback(new Error('生日不能是未來的日期'));
        } else {
            callback();
        }
    }
};

//驗證性別是否被選擇(可選欄位)
const validateGender = (rule: any, value: string, callback: any) => {
    if (!value || value.trim() === '') {
        //性別為可選欄位，允許為空
        callback();
        return;
    }
    const validGenders = ["male", "female","other"];
    console.log("選擇的性別:",value)
    const includes = validGenders.includes(value);
    console.log("性別includes:",includes)
    if (includes) {
        callback()
    } else {
        callback(new Error('請選擇有效的性別'));
    }
};



//驗證角色是否被選擇
const validateRole = (rule: any, value: string, callback: any,options:Ref<Option[]>) => {
    // if (isResetting.value == true) {//代表執行的是初始化表單數據,不進行校驗
    //     callback(); // 跳過驗證
    //     return;
    // }
    console.log("validateRole...options:",options.value)
    const validRoles = options.value.map(option => option.label);
    console.log("validRoles", validRoles)
    // const validRoles = searchOptions.map(option => option.value);

    // const some =validRoles.some(item =>item==value)
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

import {formUserInterface} from "@/interface/admin/formUserInterface";
import {Option} from "@/interface/admin/formOption";

export const useRules =(form:any,options:Ref<Option[]>): FormRules<formUserInterface>=>{
    console.log("useRules...form:",form)
    console.log("useRules...options:",options)
    return reactive<FormRules<formUserInterface>>({

        accountName: [
            {type: 'string', required: true, message: '帳號為必填', trigger: 'blur'},
            {min: 6, max: 30, message: '帳號長度必須介於6到30個半形字元之間', trigger: 'blur'},
        ],
        nickName: [
            {type: 'string', required: false, trigger: 'blur'},
            {min: 1, max: 10, message: '使用者名稱長度必須介於1到10個半形字元之間', trigger: 'blur'},
        ],
        email: [
            {type: 'string', required: true, message: '信箱為必填', trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'},
        ],
        password: [
            {type: 'string', required: true, message: '密碼為必填', trigger: 'blur'},
            {min: 8, max: 30, message: '密碼長度至少須為8個字元', trigger: 'blur'},
            {max: 30, message: '密碼長度至多為30個字元', trigger: 'blur'},
        ],
        checkPassword: [
            {type: 'string', required: true, message: '確認密碼為必填', trigger: 'blur'},
            {validator: (rule: any, value: any, callback: any) =>
                    validateCheckPassword(rule, value, callback, form), trigger: 'blur'},
        ],
        birthday: [
            {validator: validateBirthday, trigger: 'blur'},
        ],
        gender: [
            {validator: validateGender, trigger: 'blur'},
        ],
        address: [
            {type: 'string', required: false, trigger: 'blur'},
        ],
        phoneNumber: [
            {type: 'string', required: false, trigger: 'blur'},
            {validator: validatePhoneNumber, trigger: 'blur'},
        ],
        //以下為舊版欄位驗證規則，保留以供編輯功能使用
        roleId: [
            {validator: (rule: any, value: string, callback: any)=>
                    validateRole(rule, value, callback,options), trigger: 'blur'},
        ],
        status:[
            {validator: validateStatus, trigger: 'blur'}
        ],
    })

};
