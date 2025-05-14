<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {formatValue} from "@/utils/formater";
import { useRoute } from 'vue-router';
const route = useRoute();
import {Delete, Plus, RefreshRight, Search} from "@element-plus/icons-vue";
import {FormInstance} from "element-plus";
const formRef = ref<FormInstance>()
const index_ = ref<number>();
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
let show = ref<boolean>(false);
const defaultTime1: [Date, Date] = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
];
const searchData = reactive({
  datetime: 0,
  address: "",
  name: null,
});
const DriType = ref<any[]>([
  {label: '用例名', prop: 'testCaseName'},
  {label: '用例总数', prop: 'caseTotal'},
  {label: '成功次数', prop: 'testCaseSuccess'},
  {label: '失败次数', prop: 'testCaseFail'},
  {label: '错误次数', prop: 'testCaseError'},
  {label: '错误次数', prop: 'testCaseError'},
  {label: '开始时间', prop: 'createTime'},
  {label: '结束时间', prop: 'endTime'},
])
const DriList = ref<any>([])


const search = (SHOW: boolean) => {
  if (SHOW) {
    show.value = !show.value;
  } else {
  }
}
onMounted(()=>{
  console.log(history.state); // 访问 state 中的参数
})
</script>

<template>
  <el-main>
    <div class="common-layout">
      <el-card  shadow="never" class="card-wrapper">
        <div class="toolbar-wrapper">
          <div>
          </div>
          <div class="search-wrapper">
            <el-tooltip content="搜索">
              <el-button type="primary" :icon="Search" circle @click="search(true)"/>
            </el-tooltip>
            <el-tooltip content="添加">
              <el-button type="primary" :icon="Plus" circle @click="Add"/>
            </el-tooltip>
            <el-tooltip content="刷新当前页">
              <el-button type="primary" :icon="RefreshRight" circle @click="search(false)"/>
            </el-tooltip>
          </div>
        </div>
        <div v-if="show" class="search-main" style="margin-bottom: 10px">
          <div class="search-main-container">
            <el-form :inline="true">
              <el-form-item prop="createTime" label="创建时间" >
                <el-date-picker
                        v-model="searchData.datetime"
                        type="datetimerange"
                        start-placeholder="Start Date"
                        end-placeholder="End Date"
                        :default-time="defaultTime1"
                        size="large"
                />
              </el-form-item>
              <el-form-item prop="address" label="地址">
                <el-input v-model="searchData.address" size="large" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item prop="username" label="用例名">
                <el-input v-model="searchData.name" size="large" placeholder="请输入"></el-input>
              </el-form-item>
              <el-button type="primary" :icon="Search" @click="search(false)">
                查询
              </el-button>
              <el-button type="danger" :icon="Delete" @click="clear">
                清空
              </el-button>
            </el-form>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table :data="DriList.value">
            <el-table-column v-for="(column,key) in DriType"
                             :key=key
                             :label="column.label"
                             :prop="column.prop"
                             :formatter="formatValue"
                             align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template #default="scope">
                <el-button type="primary" text bg size="small"
                           @click="Edit(scope.row,scope.$index)">
                  修改
                </el-button>
                <el-button type="danger" text bg size="small" @click="userDelete(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </el-main>
</template>

<style scoped>
.table-wrapper {
  margin-bottom: 20px;
}

.toolbar-wrapper {
  width: auto;
  display: flex;
  justify-content: right;
}

.toolbar-wrapper button {
  width: 32px !important;

}

.card-wrapper {
  margin: 20px 20px 0 20px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 0 10px grey;
  height: auto;
}

* {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

main {
  /* 隐藏滚动条 */
  overflow: auto; /* 允许滚动 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 和 Edge */
  width: 100% !important;
  height: auto !important;
}

.common-layout {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search-wrapper {
  width: 150px;
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

/*搜索输入模块浮动*/
.search-main {
  width: auto;
  display: flex;
  justify-content: left;
}

.search-main-container {
  width: auto;
  display: flex;
  justify-content: left;
  margin-left: 50px;
}

.search-main button {
  margin-bottom: 20px;
  width: 80px !important;
  height: 40px;
}
el-form-item.asterisk-left.el-form-item--label-right {
  width: auto;
  padding-bottom: 20px;
}
.el-form-item-label {
  width: 400px;
  margin-top: 10px;
}
.el-form-item.asterisk-left.el-form-item--label-right {
  width: auto;
  padding-bottom: 20px;
}
</style>