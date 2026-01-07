<template>
    <div class="user-information-container">
        <div class="user-information-header">
            <h2 class="page-title">個人資料詳情</h2>

        </div>

        <div class="user-information-content">
            <hr />
            <!-- 頭像 -->
            <div class="info-item">
                <div class="info-label">頭像</div>
                <div class="info-value">
                    <el-avatar :size="50" :src="userInformation?.avatar" alt="avatar"></el-avatar>
                </div>
                <div class="info-action" v-if="isCurrentUser">
                    <span class="action-link" @click="handleOpenEditAvatar">更新頭像</span>
                </div>
            </div>

            <hr />

            <!-- 全名/暱稱 -->
            <div class="info-item">
                <div class="info-label">全名</div>
                <div class="info-value">
                    <el-input v-if="editNickName" v-model="inputNickName" placeholder="Please input"
                        class="dark-input" />
                    <span v-else>{{ userInformation?.nickName || '--' }}</span>
                </div>
                <div class="info-action" v-if="isCurrentUser">
                    <template v-if="editNickName">
                        <el-popconfirm @confirm="handleEditNickName()" title="確認修改?">
                            <template #reference>
                                <span class="action-link">確認</span>
                            </template>
                        </el-popconfirm>
                        <span class="action-link text-cancel" @click="handleOpenEditNickName">取消</span>
                    </template>
                    <span v-else class="action-link" @click="handleOpenEditNickName">更新全名</span>
                </div>
            </div>

            <!-- 性別 -->
            <div class="info-item">
                <div class="info-label">性別</div>
                <div class="info-value">
                    <el-input v-if="editGender" v-model="inputGender" placeholder="Please input gender"
                        class="dark-input" />
                    <span v-else>{{ userInformation?.gender || '--' }}</span>
                </div>
                <div class="info-action" v-if="isCurrentUser">
                    <template v-if="editGender">
                        <el-popconfirm @confirm="handleConfirmEditGender()" title="確認修改?">
                            <template #reference>
                                <span class="action-link">確認</span>
                            </template>
                        </el-popconfirm>
                        <span class="action-link text-cancel" @click="handleOpenEditGender">取消</span>
                    </template>
                    <span v-else class="action-link" @click="handleOpenEditGender">更新性別</span>
                </div>
            </div>

            <!-- 權限 -->
            <div class="info-item">
                <div class="info-label">權限</div>
                <div class="info-value">{{ userInformation?.roleId }}</div>
                <div class="info-action">
                    <!-- No action for role usually -->
                </div>
            </div>

        </div>

    </div>

    <!-- 修改頭像 Dialog -->
    <el-dialog v-model="editAvatar" title="修改頭像" width="600px" :before-close="handleCloseEditAvatar"
        class="dark-dialog">
        <div class="avatar-upload-container">
            <el-upload class="avatar-uploader" action="#" :show-file-list="false" :auto-upload="false"
                :on-change="handleFileChange" accept="image/png, image/jpeg">
                <template #trigger>
                    <el-button type="primary">選擇圖片</el-button>
                </template>
                <div class="el-upload__tip text-white">只能上傳 jpg/png 文件，且不超過 2MB</div>
            </el-upload>

            <div v-if="img" class="cropper-wrapper" style="margin-top: 20px; height: 400px; width: 100%;">
                <cropper ref="cropperRef" class="cropper" :src="img" :stencil-props="{ aspectRatio: 1 }"></cropper>
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
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from "vue-router";
import http from "@/utils/httpRequest.js";
import { ElMessage } from "element-plus";
import type { R } from "@/interface/R.ts";
import { getCookieValue } from "@/utils/jwtUtils";
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const router = useRouter();
const route = useRoute();

const isCurrentUser = computed(() => {
    const cookieUserId = getCookieValue("userId");
    // console.log("cookieUserId:", cookieUserId, "routeUserId:", route.params.userId);
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
    // console.log("getUserInformation userId:", userId);

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
            // console.log("getUserInformation 用戶摘要資料:", userInformation.value);
            img.value = data.data.avatar || '';
            // ElMessage.success("獲取用戶摘要成功");
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
    // Implement actual update logic here if needed
    editNickName.value = false;
    if (userInformation.value) userInformation.value.nickName = inputNickName.value;
}
const handleConfirmEditAvatar = function () {
    if (uploading.value) return;
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
    // Implement actual update logic here if needed
    editGender.value = false;
    if (userInformation.value) userInformation.value.gender = inputGender.value;
}
</script>
<style lang="css" scoped>
.user-information-container {
    width: 100%;
    min-height: 100vh;

    background-color: var(--bg-hex-202020);

    color: #ffffff;
    padding: 0 40px;

    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

}

.user-information-header {
    width: 100%;
    max-width: 1000px;
    padding: 60px 0 40px 0;
}

.page-title {
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
}

.user-information-content {
    max-width: 1000px;

    width: 100%;
}

.info-item {
    display: flex;
    align-items: center;
    padding: 24px 0;
    border-bottom: 1px solid #222;

}


.info-label {
    width: 250px;

    font-size: 15px;
    color: #eeeeee;

    font-weight: 500;
}


.info-value {
    flex-grow: 1;
    font-size: 15px;
    color: #ffffff;
    display: flex;
    align-items: center;
}


.info-action {
    margin-left: auto;
    font-size: 14px;
}



.text-cancel {
    margin-left: 20px;
    color: #888;
}

.text-cancel:hover {
    color: #fff;
    opacity: 1;
}



.cropper {
    height: 100%;
    width: 100%;
    background: #333;
}

.text-white {
    color: #fff;
}
hr {
    margin: 0 !important;

}
</style>
