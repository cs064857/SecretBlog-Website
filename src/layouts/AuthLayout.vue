import Auth from '@/components/Auth.vue'

<template>
    <!-- <h1>AuthLayout</h1> -->
    <!-- <div class="article-main"> -->
    <div class="auth-container">
        <div class="auth-container-main">
            <router-view></router-view>
        <!-- </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
@media screen and (max-height: 1024px) {
    .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    min-height: 100%;

    background-color: #373737;

    }
    .article-main {
    background-color: darkgrey;
    width: 100%;
    min-height: 92%;
    max-height: none;

    display: flex;
    justify-content: center;
    /*align-content: center;*/
    /*overflow: auto;*/

    /*position: relative;*/

    }
    .auth-container-main{
    border: 2px solid #fff;
    width: 500px;
    height: 800px;
    min-height: 800px;
    max-height: 800px;

    }
    }
</style>
