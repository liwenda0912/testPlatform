// 全局前置守卫
import router from "@/router/index";

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.path} to ${to.path}`);
    next(); // 确保调用 next()，否则路由不会跳转
});

// 全局后置守卫
router.afterEach((to, from) => {
    console.log(`Navigated from ${from.path} to ${to.path}`);
});