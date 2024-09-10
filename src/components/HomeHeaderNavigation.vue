<script setup lang="ts">
import {Management} from "@element-plus/icons-vue";
import {useRouter, useRoute} from 'vue-router'

const router = useRouter()
const route = useRoute()
const handleGoBackend = function () {//進入後台管理系統
  router.push('/AdminVue')
}



</script>

<template>
        <div class="home-header-navigation">
          <el-image class="home-header-navigation-logo" src="https://element-plus.org/images/element-plus-logo.svg">
          </el-image>
          <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoCategory" type="primary" :icon="Menu"/>-->
          <!--        <el-button style="height: 6vh;width: 6vh" @click="handleGoUser" type="primary" :icon="User"/>-->
          <el-button style="height: 6vh;width: 6vh" @click="handleGoBackend" type="primary" :icon="Management"/>

        </div>
</template>

<style scoped>
.home-header-navigation-logo{
  background-color: #DD4A68;

  height: 8vh;

  width:auto;
  position:absolute;
  right:83%;
}

.home-header-navigation {
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
    /*height:100%;*/
    height: 4.785rem;
    background-color: darkslateblue;


}
</style>
