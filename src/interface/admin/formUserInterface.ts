// 定義表單資料接口
export interface formUserInterface {
    id?: string;
    userInfoId?: string;      // 用戶資訊ID
    nickName?: string;         // 使用者名稱(對應後端nickName欄位)
    avatar?: {
        raw: File;
        uid: string;
    } | string | File;          //使用者頭像
    status?: string;          //帳號狀態(0正常,1封禁中)

    //以下是UmsUserInfo的欄位
    accountName: string;      //帳號名稱
    password?: string;        //密碼(可選，編輯模式不需要)
    checkPassword?: string;
    email: string;            //信箱地址
    birthday?: Date | string;         //生日(LocalDate)
    gender?: number | string;           //性別(1男性,2女性,3不愿透露)
    address?: string;          //居住地址
    phoneNumber?: string;      //手機號碼
    createAt?: Date | string;       //註冊時間(LocalDateTime)

    //額外的欄位(來自UmsRole)
    roleId?: string;         //權限名稱
}
