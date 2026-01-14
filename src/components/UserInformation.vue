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
                    <el-select v-if="editGender" v-model="inputGender" placeholder="請選擇性別" class="dark-input">
                        <el-option label="男" :value="1" />
                        <el-option label="女" :value="2" />
                    </el-select>
                    <span v-else>{{ formatGender(userInformation?.gender) }}</span>
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

            <!-- 生日 -->
            <div class="info-item">
                <div class="info-label">生日</div>
                <div class="info-value">
                    <el-date-picker v-if="editBirthday" v-model="inputBirthday" type="date" placeholder="請選擇日期"
                        format="YYYY-MM-DD" value-format="YYYY-MM-DD" class="dark-input" clearable />
                    <span v-else>{{ userInformation?.birthday || '--' }}</span>
                </div>
                <div class="info-action" v-if="isCurrentUser">
                    <template v-if="editBirthday">
                        <el-popconfirm @confirm="handleConfirmEditBirthday()" title="確認修改?">
                            <template #reference>
                                <span class="action-link">確認</span>
                            </template>
                        </el-popconfirm>
                        <span class="action-link text-cancel" @click="handleOpenEditBirthday">取消</span>
                    </template>
                    <span v-else class="action-link" @click="handleOpenEditBirthday">更新生日</span>
                </div>
            </div>

            <!-- 地址 -->
            <div class="info-item">
                <div class="info-label">地址</div>
                <div class="info-value">
                    <el-input v-if="editAddress" v-model="inputAddress" placeholder="請輸入地址" class="dark-input" clearable />
                    <span v-else>{{ userInformation?.address || '--' }}</span>
                </div>
                <div class="info-action" v-if="isCurrentUser">
                    <template v-if="editAddress">
                        <el-popconfirm @confirm="handleConfirmEditAddress()" title="確認修改?">
                            <template #reference>
                                <span class="action-link">確認</span>
                            </template>
                        </el-popconfirm>
                        <span class="action-link text-cancel" @click="handleOpenEditAddress">取消</span>
                    </template>
                    <span v-else class="action-link" @click="handleOpenEditAddress">更新地址</span>
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
import { uploadFileToMinioRequest } from "@/requests/useMinioRequest";
import { ElMessage } from "element-plus";
import type { R } from "@/interface/R.ts";
import { getCookieValue } from "@/utils/jwtUtils";
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const router = useRouter();
const route = useRoute();

const isCurrentUser = computed(() => {
    const cookieUserId = getCookieValue("userId");
    return cookieUserId === route.params.userId;
});

interface UmsUserInformationDTO {
    id: string;
    nickName?: string;
    avatar?: string;
    roleId?: string;
    createAt?: Date;
    updateAt?: Date;
    gender?: number;
    birthday?: string;
    address?: string;
}

const userInformation = ref<UmsUserInformationDTO | null>(null);

const getUserInformation = () => {
    const userId = route.params.userId;

    if (!userId) {
        return;
    }

    http({
        url: http.adornUrl(`/ums/user/summary/${userId}`),
        method: 'get',
    }).then(({ data }: { data: R<UmsUserInformationDTO> }) => {
        if (data.code === "200") {
            userInformation.value = data.data;
            img.value = data.data.avatar || '';
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

const inputGender = ref<number | null>(null)
const editGender = ref<boolean>(false)

const inputBirthday = ref<string>("")
const editBirthday = ref<boolean>(false)

const inputAddress = ref<string>("")
const editAddress = ref<boolean>(false)

/**
 * 格式化性別顯示
 */
const formatGender = (gender: number | undefined) => {
    if (gender === 1) return '男';
    if (gender === 2) return '女';
    return '--';
}

/**
 * 開啟修改模態框
 */
const handleOpenEditNickName = function () {
    if (!editNickName.value) {
        inputNickName.value = userInformation.value?.nickName || ""
    }
    editNickName.value = !editNickName.value
}
const handleOpenEditAvatar = function () {
    editAvatar.value = true;
    img.value = userInformation.value?.avatar || "";
}
const handleCloseEditAvatar = function () {
    editAvatar.value = false;
}
const handleOpenEditGender = function () {
    if (!editGender.value) {
        inputGender.value = userInformation.value?.gender || null
    }
    editGender.value = !editGender.value
}
const handleOpenEditBirthday = function () {
    if (!editBirthday.value) {
        inputBirthday.value = userInformation.value?.birthday || ""
    }
    editBirthday.value = !editBirthday.value
}
const handleOpenEditAddress = function () {
    if (!editAddress.value) {
        inputAddress.value = userInformation.value?.address || ""
    }
    editAddress.value = !editAddress.value
}

/**
 * 頭像上傳
 */
const img = ref<string>('')

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
    const userId = route.params.userId;
    http({
        url: http.adornUrl(`/ums/user/${userId}/nickname`),
        method: 'put',
        params: { nickname: inputNickName.value }
    }).then(({ data }: { data: R }) => {
        if (data.code === "200") {
            ElMessage.success("暱稱修改成功");
            if (userInformation.value) userInformation.value.nickName = inputNickName.value;
        } else {
            ElMessage.error(data.msg || "暱稱修改失敗");
        }
    }).catch(() => {
        ElMessage.error("暱稱修改失敗");
    });
    editNickName.value = false;
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

            uploadFileToMinioRequest(blob, 'avatar.png').then((data: any) => {
                if (data.code === "200") {
                    ElMessage.success("頭像修改成功");

                    if (userInformation.value) {
                        userInformation.value.avatar = data.data;
                    }
                    editAvatar.value = false;
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
    const userId = route.params.userId;
    http({
        url: http.adornUrl(`/ums/user/${userId}/gender`),
        method: 'put',
        params: { gender: inputGender.value }
    }).then(({ data }: { data: R }) => {
        if (data.code === "200") {
            ElMessage.success("性別修改成功");
            if (userInformation.value) userInformation.value.gender = inputGender.value ?? undefined;
        } else {
            ElMessage.error(data.msg || "性別修改失敗");
        }
    }).catch(() => {
        ElMessage.error("性別修改失敗");
    });
    editGender.value = false;
}

const handleConfirmEditBirthday = function () {
    const userId = route.params.userId;
    http({
        url: http.adornUrl(`/ums/user/${userId}/birthday`),
        method: 'put',
        params: { birthday: inputBirthday.value || null }
    }).then(({ data }: { data: R }) => {
        if (data.code === "200") {
            ElMessage.success("生日修改成功");
            if (userInformation.value) userInformation.value.birthday = inputBirthday.value;
        } else {
            ElMessage.error(data.msg || "生日修改失敗");
        }
    }).catch(() => {
        ElMessage.error("生日修改失敗");
    });
    editBirthday.value = false;
}

const handleConfirmEditAddress = function () {
    const userId = route.params.userId;
    http({
        url: http.adornUrl(`/ums/user/${userId}/address`),
        method: 'put',
        params: { address: inputAddress.value || null }
    }).then(({ data }: { data: R }) => {
        if (data.code === "200") {
            ElMessage.success("地址修改成功");
            if (userInformation.value) userInformation.value.address = inputAddress.value;
        } else {
            ElMessage.error(data.msg || "地址修改失敗");
        }
    }).catch(() => {
        ElMessage.error("地址修改失敗");
    });
    editAddress.value = false;
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
