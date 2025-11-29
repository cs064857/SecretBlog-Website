<template>
    <div class="user-information-container-header">
        <div class="user-information-header-about">
            <div class="user-information-header-about-title">

                <h2>用戶資訊about</h2>


            </div>
            <hr style="border: 0;height: 1px; background-color: #000000;margin: 20px 0px;">

            <div class="user-information-header-about-avatar">
                <div class="user-information-header-about-avatar-1"><span>頭像</span></div>
                <div class="user-information-header-about-avatar-1"><el-avatar :size="50" :src="userInformation?.avatar"
                        alt="avatar"></el-avatar></div>
                <div class="user-information-header-about-avatar-1"><el-button type="primary"
                        @click="handleEditAvatar">修改頭像</el-button></div>


            </div>
            <hr style="border: 0;height: 1px; background-color: #000000;margin: 20px 0px;">
            <div class="user-information-header-about-nickname">

                <div class="user-information-header-about-nickname-1">暱稱</div>
                <el-input v-if="editNickName" v-model="inputNickName" style="width: 240px" placeholder="Please input" />

                <div v-else-if="!editNickName" class="user-information-header-about-nickname-1">{{ userInformation?.nickName }}</div>
                
                <div class="user-information-header-about-nickname-1">
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
                <div class="user-information-header-about-gender-1">{{ userInformation?.gender }}</div>

                <div class="user-information-header-about-gender-1"><el-button type="primary"
                        @click="handleEditGender">修改性別</el-button></div>

            </div>
            <hr style="border: 0;height: 1px; background-color: #000000;margin: 20px 0px;">
            <div class="user-information-header-about-role">
                <div class="user-information-header-about-role-1">權限</div>
                <div class="user-information-header-about-role-1">{{ userInformation?.roleId }}</div>

            </div>
            <hr style="border: 0;height: 1px; background-color: #000000;margin: 20px 0px;">



        </div>
    </div>



</template>
<script lang="ts" setup>
import { onMounted, ref, defineProps } from 'vue';
import { useRouter, useRoute } from "vue-router";
import http from "@/utils/httpRequest.js";
import { ElMessage } from "element-plus";
import type { R } from "@/interface/R.ts";

const router = useRouter();
const route = useRoute();

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
/**
 * 開啟修改模態框
 */
const handleOpenEditNickName = function () {
    console.log("handleEditNickName")
    editNickName.value = !editNickName.value
}
const handleEditAvatar = function () {
    console.log("handleEditAvatar")
}
const handleEditGender = function () {
    console.log("handleEditGender")
}
/**
 * 修改函數
 */
const handleEditNickName = function () {
    console.log("handleEditNickName, inputNickName.value:", inputNickName.value)
    
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
</style>
