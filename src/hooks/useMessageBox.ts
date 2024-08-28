import {ElMessage, ElMessageBox} from 'element-plus'

//確認是否刪除
export const ConfirmDelete = (msg:string):Promise<void> => {
    return new Promise<void>((resolve,reject)=>{
        ElMessageBox.confirm(
            msg,
            'Warning',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
                center: true,
            }
        )
            .then(() => {
                resolve();
                // ElMessage({
                //     type: 'success',
                //     message: 'Delete completed',
                // })
            })
            .catch(() => {
                reject(); // 取消時拒絕 Promise
                // ElMessage({
                //     type: 'info',
                //     message: 'Delete canceled',
                // })
            })
    })
}
