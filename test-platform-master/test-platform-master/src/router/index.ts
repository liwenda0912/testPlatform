import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Login",
        meta: {showNavBar: false}, // 不显示导航栏
        component: () => import('@/views/login/login.vue'),

    },
    {
        path: "/index",
        name: "Index",
        meta: {showNavBar: true, showBarType: '1'}, // 不显示导航栏
        component: () => import('@/views/index.vue'),
    },
    {
        path: "/test",
        name: "Test",
        redirect: "/test/home",
        meta: {showNavBar: true, showBarType: '2-1'}, // 不显示导航栏
        children: [{
            path: "testcase",
            name: "TestCase",
            component: () => import('@/views/test/testCase/testCase.vue'),
        }, {
            path: "testDri",
            name: "TestDri",
            component: () => import('@/views/test/TestDri.vue'),
        },
            {
                path: "testResult",
                name: "testResult",
                component: () => import('@/views/test/testResult.vue'),
            }
        ]
    },
    {
        path: "/userMessage",
        name: "UserMessage",
        meta: {showNavBar: true, showBarType: '4'}, // 不显示导航栏
        component: () => import('@/views/userMessage/userMessage.vue'),
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;