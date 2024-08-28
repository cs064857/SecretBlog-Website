import {createRouter, createWebHistory} from 'vue-router'
import FlexBoxTest from '../views/FlexBoxTest.vue'
import MainGrid from '../components/MainGrid.vue'
import Home from '../views/Home.vue'
import AdminVue from "../components/AdminVue.vue";
import Article from "../components/Article.vue";
import TreeCategories from "../components/TreeCategories.vue";
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {//文章展示頁面
            name:'Article',
            path:'/Article/:article_id',
            components:{
                app:Article
            }
        },
        {//後臺系統
            name: 'AdminVueName',
            path: '/AdminVue',
            children: [
                {
                    name: 'TinyMceEdit',
                    path: '/AdminVue/TinyMceEdit',
                    components: {
                        AdminVueRouter: import('../components/TinyMceEdit.vue')
                    }
                },
                {
                    name: 'FlexBoxTest',
                    path: '/AdminVue/FlexBoxTest',
                    components: {
                        AdminVueRouter: FlexBoxTest,
                    }
                },
                {
                    name: 'MainGrid',
                    path: '/AdminVue/MainGrid',
                    components: {
                        AdminVueRouter: MainGrid,
                    }
                },
                {
                    name:'TreeCategories',
                    path:'/AdminVue/TreeCategories',
                    components:{
                        AdminVueRouter: TreeCategories
                    }
                }
            ],
            components: {
                app: AdminVue
            }

        },

        {
            name: "Home",
            path: '/',

            components: {
                app: Home
            },
            children: [
                {
                    path: '/Home/News1Test',
                    components: {
                        HomeRouter: import('../views/News1Test.vue')
                    }

                },
                {
                    path: '/Home/News2Test',
                    components: {
                        HomeRouter: FlexBoxTest
                    }
                },
            ]

        },
    ]
})
export default router
