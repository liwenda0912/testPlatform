<script lang="ts">
// 将 Element Plus 的语言设置为中文
import {defineComponent} from 'vue';
import zhCn from "element-plus/es/locale/lang/zh-cn"
import NavBar from '@/layout/Navigation/menu.vue';
import navBum from '@/layout/footer/index.vue';

import { computed } from 'vue';
import { useRoute } from 'vue-router';
export default defineComponent({
  name: 'App',
  computed: {
    zhCn() {
      return zhCn
    }
  },
  components: {
    NavBar,
    navBum
  },
  setup() {
    const route = useRoute();
    const showNavBar = computed(() => {
      return route.meta?.showNavBar ?? true; // 默认显示导航栏
    });
    return {
      showNavBar
    };
  },
});
</script>
<template>
  <el-config-provider :locale="zhCn">
    <el-affix>
      <nav-bar v-if="showNavBar"></nav-bar>
    </el-affix>
    <router-view/>
  <nav-bum v-if="showNavBar"></nav-bum>
  </el-config-provider>
</template>

<style>
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
}
/* 隐藏滚动条 */


</style>
