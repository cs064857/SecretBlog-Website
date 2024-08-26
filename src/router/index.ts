import {createRouter, createWebHistory} from 'vue-router'
import FlexBoxTest from '../views/FlexBoxTest.vue'
import MainGrid from '../components/MainGrid.vue'
import Home from '../views/Home.vue'
import AdminVue from "../components/AdminVue.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'AdminVueName',
            path: '/AdminVue',
            children: [
                {
                    name: 'TinyMceEdit',
                    path: '/AdminVue/TinyMceEdit',
                    components: {
                        MainRouter: import('../components/TinyMceEdit.vue')
                    }
                },
                {
                    name: 'FlexBoxTest',
                    path: '/AdminVue/FlexBoxTest',
                    components: {
                        MainRouter: FlexBoxTest,
                    }
                },
                {
                    name: 'MainGrid',
                    path: '/AdminVue/MainGrid',
                    components: {
                        MainRouter: MainGrid,
                    }
                },
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
