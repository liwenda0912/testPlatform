<template>
  <nav class="nav-bar">
    <div class="h-6"/>
    <el-header class="header" style="height: auto;font-size: 200px;padding: 0">
      <el-menu style="--el-menu-horizontal-height: 80px;"
               :default-active="showBarType"
               class="el-menu-demo"
               mode="horizontal"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b"
               @select="handleSelect"
      >
        <el-icon style="width: 60px;height: auto;padding: 0 20px 0 20px" color="white"><ElementPlus /></el-icon>
        <el-menu-item index="1">首页</el-menu-item>
        <el-sub-menu index="2">
          <template #title>我的工作台</template>
          <el-menu-item index="2-1">测试用例</el-menu-item>
          <el-menu-item index="2-2">测试计划</el-menu-item>
          <el-menu-item index="2-3">测试报告</el-menu-item>
          <el-sub-menu index="2-4">
            <template #title>测试脚本</template>
            <el-menu-item index="2-4-1">测试数据</el-menu-item>
            <el-menu-item index="2-4-2">测试脚本</el-menu-item>
            <el-menu-item index="2-4-3">测试结果</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="3" disabled>消息中心</el-menu-item>
        <el-menu-item index="4">用户管理</el-menu-item>
        <el-menu-item index="5"><a href="https://www.ele.me" target="_blank">饿了么</a></el-menu-item>
        <el-dropdown trigger="click" style="width: auto;margin-left: 50%;margin-top: 35px">
          <el-badge :value="0" :max="99" class="item" :offset="[-8, 0]">
            <el-icon size='20px' style="width:40px;height: auto; color: white"><Bell /></el-icon>
          </el-badge>
          <template #dropdown>
            <el-dropdown-menu>
              <ul  class="infinite-list" style="overflow: auto;width: 150px;height: auto">
                <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
              </ul>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-popconfirm
                confirm-button-text="Yes"
                cancel-button-text="No"
                title="是否退出登陆？"
                @confirm="confirmEvent()"
        >
          <template #reference>
            <el-avatar>
              {{ username }}
            </el-avatar>
          </template>
        </el-popconfirm>
      </el-menu>

    </el-header>
  </nav>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import router from "@/router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import {useRoute} from "vue-router";
export default defineComponent({
  name: 'App',
  computed: {
    zhCn() {
      return zhCn
    }
  },
  setup() {
    const count = ref([1,5,5])
    const route = useRoute();
    const showBarType = computed(() => {
      return route.meta?.showBarType ?? true; // 默认显示导航栏
    });
    return {
      showBarType, handleSelect, username, confirmEvent,count
    };
  },
});
const confirmEvent = () => {
  router.push('/');
}

function loginOut() {
}


const handleSelect = (key: string, keyPath: string[]) => {
  switch (key) {
          //首页
    case "1":
      router.push('/index')
      break
          //测试用例
    case "2-1":
      router.push('/test/testDri')
      break
          //测试计划
    case "2-2":
      router.push('/test/testcase')
      break
          //测试报告
    case "2-3":
      break
          //测试脚本-测试数据
    case "2-4-1":
      break
          //测试脚本-测试脚本
    case "2-4-2":
      break
          //测试脚本-测试结果
    case "2-4-3":
      router.push('/test/testResult')
      break
          //消息管理
    case "3":
      break
          //用户管理
    case "4":
      router.push('/userMessage')
      break
  }
}
const visible_ = ref(true);
const username = "user"
// 全局页面加载中。。

</script>