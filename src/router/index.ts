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
            path:'/Article/:articleId',
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
            path: '/Home/:categoryId?',
            components: {
                app: Home
            },
            children: [

                // {
                //     path: '/Home/News2Test',
                //     components: {
                //         HomeRouter: FlexBoxTest
                //     }
                // },
            ]

        },
        {
            //重定向,將/轉為/Home並訪問到首頁
            path:'/',
            redirect:'/Home'
        }
    ]
})
//全局路由守衛
router.beforeEach((to, from, next) => {
    //判斷路由地址中是否包含:page
    const pageValue = to.query?.page;
    // const hasPageParam = to.matched.some(route=>route.path.includes(':page'));
    //若路由地址包含:Page、沒有Page值、categoryId有值的話
    if(!pageValue && !to.params.page && to.params.categoryId){
        console.log("頁碼不存在")
        next({
            name:to.name,
            params:{
                ...to.params, //保留其他原本的params參數
            },
            // query: to.query//保留其他query參數
            query: {
                page: 1, //默認頁碼為1
            }
        });
    }else {
        next();//正常導航
    }
});
export default router
