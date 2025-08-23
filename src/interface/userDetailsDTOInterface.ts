export interface userDetailsDTO {

    id:String,// 用戶ID
    userInfoId:String,// 用戶資訊ID
    nickName:String,// 用戶名(原 name -> nickName)
    avatar:String,// 使用者頭像
    status:Number,//帳號狀態(0正常,1封禁中)
    accountName:String,    // 帳號名稱
    email:String,          // 信箱地址
    birthday:String,    // 生日 (LocalDate in Java)
    gender:Number,            // 性別 (1 男性, 2 女性, 3 不願透露)
    address:String,        // 居住地址
    phoneNumber:String,    // 手機號碼
    createAt:String,  // 註冊時間 (LocalDateTime in Java)
    roleId:String; // 來自 UmsRole 的欄位
}