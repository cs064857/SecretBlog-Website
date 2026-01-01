import { createRouter, createWebHistory } from 'vue-router'
import UserManagement from '@/components/admin/UserManagement.vue'
// import MainGrid from '../components/MainGrid.vue'
import Home from '../layouts/FrontLayout.vue'
import AdminVue from "../layouts/AdminLayout.vue";
import Article from "../components/Article.vue";
import TreeCategories from "../components/TreeCategories.vue";
import Auth from "../components/AuthRegister.vue";
import AuthLogin from '@/components/AuthLogin.vue';
import AuthLayout from "../layouts/AuthLayout.vue";
import TinyMceEditManagement from "@/components/admin/TinyMceEditManagement.vue";
import ArticleManagement from "@/components/admin/ArticleManagement.vue";
import HomePage from "@/components/HomePage.vue";
import AuthForgotPassword from "@/components/AuthForgotPassword.vue";
import AuthResetPassword from "@/components/AuthResetPassword.vue";
import User from '@/components/User.vue';
import UserSummary from "@/components/UserSummary.vue";
import UserInformation from "@/components/UserInformation.vue";
import NotFound from "@/components/NotFound.vue";
import SearchLayout from "@/layouts/SearchLayout.vue";
import HomeArticleList from "@/components/HomeArticleList.vue";
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {//文章展示頁面
            name: 'Article',
            path: '/Article/:articleId',
            components: {
                app: Article
            }
        },
        {//後臺系統
            name: 'AdminVueName',
            path: '/AdminVue',
            children: [
                {
                    name: 'TinyMceEditManagement',
                    path: '/AdminVue/TinyMceEditManagement',
                    components: {
                        AdminVueRouter: TinyMceEditManagement,
                    }
                },
                {
                    name: 'UserManagement',
                    path: '/AdminVue/UserManagement',
                    components: {
                        AdminVueRouter: UserManagement,
                    }
                },
                // {
                //     name: 'MainGrid',
                //     path: '/AdminVue/MainGrid',
                //     components: {
                //         AdminVueRouter: MainGrid,
                //     }
                // },
                {
                    name: 'TreeCategories',
                    path: '/AdminVue/TreeCategories',
                    components: {
                        AdminVueRouter: TreeCategories
                    }
                },
                {
                    name: 'ArticleManagement',
                    path: '/AdminVue/ArticleManagement',
                    components: {
                        AdminVueRouter: ArticleManagement
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
                {
                    // 預設子路由：顯示文章列表
                    path: '',
                    name: 'HomeArticleList',
                    component: HomeArticleList
                },
                // {
                //     path: '/Home/News2Test',
                //     components: {
                //         HomeRouter: UserManagement
                //     }
                // },
                {
                    name: 'SearchResults',
                    path: '/search/:keyword',
                    component: SearchLayout,
                    meta: { hideNavSearch: true } //控制是否顯示頂部搜索框
                }
            ]

        },
        {
            name: 'Auth',
            path: '/auth',
            redirect: "/auth/login",
            components: {
                app: AuthLayout
            },
            children: [
                {
                    path: 'login',
                    name: 'Login',
                    component: AuthLogin
                },
                {
                    path: 'register',
                    name: 'Register',
                    component: Auth
                },
                {
                    path: 'forgot-password',
                    name: 'ForgotPassword',
                    component: AuthForgotPassword
                },
                {
                    path: 'reset-password',
                    name: 'ResetPassword',
                    component: AuthResetPassword,
                    alias: '/reset-password'
                }
            ]
        },
        {
            name: 'HomePage',
            path: '/Homepage',

            components: {
                app: HomePage
            },

        },
        // {
        //     name:'Home',
        //     path:'/',
        //     redirect: "/home"
        // }
        {
            path: '/user/:userId',
            name: 'User',
            redirect: { name: 'UserSummary' }, // 預設跳轉到 UserSummary 頁面
            components: {
                app: User
            },
            children: [

                {
                    path: 'likes',
                    name: 'UserSummary',
                    component: UserSummary
                },
                {
                    path: 'information',
                    name: 'UserInformation',
                    component: UserInformation
                },

            ]
        }
        // ,
        // {
        //     name: 'Search',
        //     path: '/search/:keyword',
        //     components: {
        //         app: SearchResults
        //     }
        // }
        ,
        {//處理404
            name: 'NotFound',
            path: '/:pathMatch(.*)*',
            components: {
                app: NotFound
            }
        }
    ]
})
//全局路由守衛
router.beforeEach((to, from, next) => {
    //判斷路由地址中是否包含:page
    const pageValue = to.query?.page;
    // const hasPageParam = to.matched.some(route=>route.path.includes(':page'));
    //若路由地址包含:Page、沒有Page值、categoryId有值的話
    if (!pageValue && !to.params.page && to.params.categoryId) {
        console.log("頁碼不存在")
        next({
            name: to.name,
            params: {
                ...to.params, //保留其他原本的params參數
            },
            // query: to.query//保留其他query參數
            query: {
                page: 1, //默認頁碼為1
            }
        });
    } else {
        next();//正常導航
    }
});


export default router
