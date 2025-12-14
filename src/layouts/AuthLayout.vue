

<template>
    <home-header-navigation></home-header-navigation>
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
import Auth from '@/components/AuthRegister.vue'
import HomeHeaderNavigation from '@/components/HomeHeaderNavigation.vue';
</script>

<style scoped>
@media screen and (max-height: 2000px) {
    .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    
	    min-height: 100%;

	    background-color: var(--bg-hex-181a1b);

	    }
	    .article-main {
	    background-color: var(--bg-name-darkgrey);
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
	    background-color: var(--bg-hex-282b2d);
	    border: 2px solid #fff;
	    width: 500px;
	    height: 800px;
    min-height: 800px;
    max-height: 800px;

    }
    }
</style>
