// 定義表單資料接口
export interface formUserInterface {
    id?:string;
    name: string;             // 姓名
    avatar?:{
        raw:File;
        uid:string;
    }|string|File;          // 使用者頭像
    status: string;          // 帳號狀態 (0正常, 1封禁中)

    // 以下是 UmsUserInfo 的欄位
    accountName: string;      // 帳號名稱
    password: string;         // 密碼
    checkPassword?: string;
    email: string;            // 信箱地址
    birthday: Date | string;         // 生日 (LocalDate in Java)
    gender: number | string;           // 性別 (1 男性, 2 女性, 3 不願透露)
    address: string;          // 居住地址
    phoneNumber: string;      // 手機號碼
    createTime?: Date | string;       // 註冊時間 (LocalDateTime in Java)

    // 額外的欄位 (來自 UmsRole)
    roleId: string;         // 權限名稱
}
