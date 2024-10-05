// 定義表單資料接口
export interface formDataInterface {
    id?:string,
    userInfoId?:string,
    status:string;
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
