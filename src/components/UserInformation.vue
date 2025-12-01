<template>
    <div class="user-information-container-header">
        <div class="user-information-header-about">
            <div class="user-information-header-about-title">

                <h2>用戶資訊about</h2>


            </div>
            <hr style="border: 0;height: 1px; background-color: #000000;margin: 20px 0px;">

            <div class="user-information-header-about-avatar">
                <div class="user-information-header-about-avatar-1"><span>頭像</span></div>

                <!-- 顯示當前頭像 -->
                <div class="user-information-header-about-avatar-1">
                    <el-avatar :size="50" :src="userInformation?.avatar" alt="avatar"></el-avatar>
                </div>
                
                <div v-if="isCurrentUser" class="edit-button">
                    <el-button type="primary" @click="handleOpenEditAvatar">修改頭像</el-button>
                </div>
            </div>
            <hr style="border: 0;height: 1px; background-color: #000000;margin: 20px 0px;">
            <div class="user-information-header-about-nickname">

                <div class="user-information-header-about-nickname-1">暱稱</div>
                <el-input v-if="editNickName" v-model="inputNickName" style="width: 240px" placeholder="Please input" />

                <div v-else-if="!editNickName" class="user-information-header-about-nickname-1">{{ userInformation?.nickName }}</div>
                
                <div v-if="isCurrentUser" class="edit-button">
                    <el-popconfirm @confirm="handleEditNickName()" title="Are you sure to Continue this?">
                        <template #reference>
                            <el-button v-if="editNickName" type="primary">確認修改</el-button>

                        </template>
                    </el-popconfirm>

                    <el-button type="primary"@click="handleOpenEditNickName">{{editNickName?"取消修改":"修改暱稱"}}</el-button>


                    
                </div>
                        
            </div>
            <hr style="border: 0;height: 1px; background-color: #000000;margin: 20px 0px;">


            <div class="user-information-header-about-gender">
                <div class="user-information-header-about-gender-1">性別</div>
                <div v-if="!editGender" class="user-information-header-about-gender-1">{{ userInformation?.gender }}</div>
                <el-input v-else v-model="inputGender" style="width: 240px" placeholder="Please input gender" />

                <div v-if="isCurrentUser" class="edit-button">
                    <el-popconfirm @confirm="handleConfirmEditGender()" title="Are you sure to Continue this?">
                        <template #reference>
                            <el-button v-if="editGender" type="primary">確認修改</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button type="primary"
                        @click="handleOpenEditGender">{{editGender?"取消修改":"修改性別"}}</el-button></div>

            </div>
            <hr style="border: 0;height: 1px; background-color: #000000;margin: 20px 0px;">
            <div class="user-information-header-about-role">
                <div class="user-information-header-about-role-1">權限</div>
                <div class="user-information-header-about-role-1">{{ userInformation?.roleId }}</div>

            </div>
            <hr style="border: 0;height: 1px; background-color: #000000;margin: 20px 0px;">



        </div>
    </div>

    <!-- 修改頭像 Dialog -->
    <el-dialog v-model="editAvatar" title="修改頭像" width="600px" :before-close="handleCloseEditAvatar">
        <div class="avatar-upload-container">
            <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleFileChange"
                accept="image/png, image/jpeg"
            >
                <template #trigger>
                    <el-button type="primary">選擇圖片</el-button>
                </template>
                <div class="el-upload__tip">只能上傳 jpg/png 文件，且不超過 2MB</div>
            </el-upload>

            <div v-if="img" class="cropper-wrapper" style="margin-top: 20px; height: 400px; width: 100%;">
                <cropper
                    ref="cropperRef"
                    class="cropper"
                    :src="img"
                    :stencil-props="{ aspectRatio: 1 }"
                ></cropper>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCloseEditAvatar">取消</el-button>
                <el-button type="primary" @click="handleConfirmEditAvatar" :loading="uploading">確認上傳</el-button>
            </span>
        </template>
    </el-dialog>

</template>
<script lang="ts" setup>
import { onMounted, ref, defineProps, computed } from 'vue';
import { useRouter, useRoute } from "vue-router";
import http from "@/utils/httpRequest.js";
import { ElMessage } from "element-plus";
import type { R } from "@/interface/R.ts";
import { getCookieValue } from "@/utils/jwtUtils";

const router = useRouter();
const route = useRoute();

const isCurrentUser = computed(() => {
    const cookieUserId = getCookieValue("userId");
    console.log("cookieUserId:", cookieUserId, "routeUserId:", route.params.userId);
    return cookieUserId === route.params.userId;
});

interface UmsUserInformationDTO {
    id: string;
    nickName?: string;
    avatar?: string;
    roleId?: string;
    createAt?: Date;
    updateAt?: Date;
    gender?: string;
}

const userInformation = ref<UmsUserInformationDTO | null>(null);

const getUserInformation = () => {
    const userId = route.params.userId;
    console.log("getUserInformation userId:", userId);

    if (!userId) {
        // ElMessage.error("無法獲取用戶 ID");
        return;
    }

    http({
        // url: http.adornUrl(`/ums/user/information/${userId}`),
        url: http.adornUrl(`/ums/user/summary/${userId}`),
        method: 'get',
    }).then(({ data }: { data: R<UmsUserInformationDTO> }) => {
        if (data.code === "200") {
            userInformation.value = data.data;
            console.log("getUserInformation 用戶摘要資料:", userInformation.value);
            img.value = data.data.avatar;
            ElMessage.success("獲取用戶摘要成功");
        } else {
            ElMessage.error(data.msg || "獲取用戶摘要失敗");
        }
    }).catch((error: any) => {
        console.error("獲取用戶摘要失敗:", error);
        ElMessage.error("獲取用戶摘要失敗，請稍後再試");
    });
};

onMounted(() => {
    getUserInformation();
});

/**
 * 修改按鈕相關
 */

const inputNickName = ref<string>("")
const editNickName = ref<boolean>(false)

const editAvatar = ref<boolean>(false)
const uploading = ref<boolean>(false)
const cropperRef = ref<any>(null)

const inputGender = ref<string>("")
const editGender = ref<boolean>(false)

/**
 * 開啟修改模態框
 */
const handleOpenEditNickName = function () {
    if (!editNickName.value) {
        inputNickName.value = userInformation.value?.nickName || ""
    }
    console.log("handleEditNickName")
    editNickName.value = !editNickName.value
}
const handleOpenEditAvatar = function () {
    editAvatar.value = true;
    img.value = userInformation.value?.avatar || "";
}
const handleCloseEditAvatar = function () {
    editAvatar.value = false;
    // img.value = ""; // Optional: clear image on close
}
const handleOpenEditGender = function () {
    if (!editGender.value) {
        inputGender.value = userInformation.value?.gender || ""
    }
    console.log("handleOpenEditGender")
    editGender.value = !editGender.value
}

const handleEditAvatar = function () {
    console.log("handleEditAvatar")
}
const handleEditGender = function () {
    console.log("handleEditGender")
}

/**
 * 頭像上傳
 */
const img = ref<string>('')
// 用於存儲裁剪後的結果，而不是覆蓋源圖片

const handleFileChange = (uploadFile: any) => {
    const file = uploadFile.raw;
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

/**
 * 修改函數
 */
const handleEditNickName = function () {
    console.log("handleEditNickName, inputNickName.value:", inputNickName.value)
    
}
const handleConfirmEditAvatar = function () {
    if (!cropperRef.value) return;
    
    const { canvas } = cropperRef.value.getResult();
    if (canvas) {
        
        uploading.value = true;
        canvas.toBlob((blob: Blob) => {
            if (!blob) {
                uploading.value = false;
                return;
            }
            const formData = new FormData();
            formData.append('file', blob, 'file');
            
            http({
                url: http.adornUrl('/sms/minio'),
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(({ data }: { data: any }) => {
                 if (data.code === "200") {
                    ElMessage.success("頭像修改成功");

                    if (userInformation.value) {
                        userInformation.value.avatar = data.data; 
                    }
                    editAvatar.value = false;

                    //更新cookie中頭像的URL值
                    document.cookie = "avatar=" + data.data + "; path=/;";

                 } else {
                    ElMessage.error(data.msg || "頭像修改失敗");
                 }
            }).catch((err: any) => {
                console.error(err);
                ElMessage.error("上傳失敗");
            }).finally(() => {
                uploading.value = false;
            });
        }, 'image/png');
    }
}

const handleConfirmEditGender = function () {
    console.log("handleConfirmEditGender, inputGender.value:", inputGender.value)
}
</script>
<style lang="css" scoped>
.user-information-container-header {
    width: 100%;
    min-height: 500px;
    /* height: 100%; */
    background-color: #4a6b52;
}

.user-information-header-about {
    width: 100%;
    height: 100%;
    background-color: #0d9393;
    display: flex;
    flex-direction: column;
}

.user-information-header-statistics {
    width: 100%;
    height: 100px;
    background-color: #427c7c;
}

.user-information-header-about-avatar {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 3rem;
}

.user-information-header-about-nickname {

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 3rem;

}

.user-information-header-about-role {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 3rem;
}

.user-information-header-about-gender {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 3rem;
}


/* 修改相關按鈕 */
.edit-button{
    /* 靠右對齊 */
    margin-left: auto; 
    margin-right: 2rem; 

}
/** 頭像上傳 */
.cropper {
  height: 100%;
  width: 100%;
  background: #DDD;
}
</style>
