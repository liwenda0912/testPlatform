import { createApp } from 'vue'
import './style.css'
import '@/style/index.css'
import 'element-plus/dist/index.css';
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import {loadPlugins} from "./plugins";
import router from './router';
const app = createApp(App)
/** 加载插件 */
loadPlugins(app)
// app.mount('#app')
app.use(router)
router.isReady().then(() => {
    app.mount("#app")
})