<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {formatValue, formatValues} from "@/utils/formater";
const titleList = ref<any>({});
import {Delete, Plus, RefreshRight, Search,ArrowLeft} from "@element-plus/icons-vue";
import {ElMessage, FormInstance,FormRules} from "element-plus";
import {EditTestCase, InsertTestCase, ListTestCase} from "@/api/Testcase";
import {getSecretData} from "@/utils/crypto";
import {jsonStringSwitch} from "@/utils/handleData";
import router from "@/router";
const drawer = ref(false)
const isEdit = ref<boolean>(false);
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
  Module: '',
  CaseTitle: '',
  testCaseDriId: 0
});

// 表单验证规则
const formRules =reactive<FormRules<typeof RowList>>({
  CaseTitle: [{ required: true, trigger: "blur", message: "请输入用例名称" }],
  Module: [{ required: true, trigger: "blur", message: "请输入所属模块" }],
  Scene: [{ required: true, trigger: "blur", message: "请输入场景" }],
  Priority: [{ required: true, trigger: "blur", message: "请选择优先级" }],
  OperateStep: [{ required: true, trigger: "blur", message: "请输入操作步骤" }],
  ExpectedResult: [{ required: true, trigger: "blur", message: "请输入预期结果" }],
  ActualResult: [{ required: true, trigger: "blur", message: "请输入实际结果" }],
})
const formRef = ref<FormInstance>()
const testCaseType = ref<any[]>([
  {label: '用例名称', prop: 'CaseTitle'},
  {label: '模块', prop: 'Module'},
  {label: '场景', prop: 'Scene'},
  {label: '优先级', prop: 'Priority'},
  {label: '操作步骤', prop: 'OperateStep'},
  {label: '预期结果', prop: 'ExpectedResult'},
  {label: '实际结果', prop: 'ActualResult'},
  {label: '创建时间', prop: 'createTime'},
  {label: '更新时间', prop: 'updateTime'},
  {label: '备注', prop: 'Remarks'},

])
let RowList = ref<any>({})
const TestCaseList = ref<any>([])
const Add=()=>{
  drawer.value = true
  isEdit.value = true
  RowList.value={}
}
const confirmChange=(formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        RowList.value.testCaseDriId=searchData.testCaseDriId
        InsertTestCase(
                getSecretData(jsonStringSwitch("String", RowList.value)),
        ).then((res: any) => {
          if (res.code === 200) {
            ElMessage({
              message: '添加成功',
              type: 'success',
            })
            search(false)
          }
        })
        /*关闭新建弹窗*/
        drawer.value = false;
      } else {
        EditTestCase(
          getSecretData(jsonStringSwitch("String", RowList.value)),
      ).then((res: any) => {
          if (res.code === 200) {
            ElMessage({
              message: '修改成功',
              type: 'success',
            })
            search(false)
          }
        })
        /*关闭修改弹窗*/
        drawer.value = false;
      }
    }
  })
}

const getTestCaseList = () => {
  ListTestCase({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    testCaseDriId: searchData.testCaseDriId,
    caseTitle: searchData.CaseTitle,
    module: searchData.Module,
  }).then((res: any) => {
    TestCaseList.value = res.data.list.map((item: any) => {
      return {
        ...item
      }
    })
  })
}
const search = (SHOW: boolean) => {
  if (SHOW) {
    show.value = !show.value;
  } else {
    getTestCaseList()
  }
}
const clear = () => {
  searchData.Module='';
  searchData.CaseTitle='';
  searchData.datetime=0;
}
const Edit = (row: any, index: any) => {
  RowList.value = JSON.parse(JSON.stringify(row));
  drawer.value = true;
  isEdit.value = false;
  index_.value = index;
}

/*删除*/
const DeletCase = (row: any) => {
  console.log(row);
  row.state = -1
  EditTestCase(getSecretData(jsonStringSwitch("String", row)),
  ).then((res: any) => {
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    getTestCaseList()
  })
}
onMounted(() => {
  if (history.state.name!=undefined && history.state.testCaseDrId!=undefined) {
    titleList.value.testCaseDriName = history.state.name;
    searchData.testCaseDriId = history.state.testCaseDrId;
    if (searchData.testCaseDriId != null) {
      getTestCaseList()
    }
  }else {
    ElMessage({
      type: 'warning',
      message:"请在用例文档中打开对应的用例界面！",
    })
    router.push('/test/testDri')
  }
})
const onBack = () => {
  window.history.back();}
</script>

<template>
  <el-main>
    <div class="common-layout">
      <el-card shadow="never" class="card-wrapper">
        <el-page-header :icon="ArrowLeft" @back="onBack">
          <template #content>
            <span class="text-large font-600 mr-3"> {{titleList["testCaseDriName"]}}用例表</span>
          </template>
        </el-page-header>
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
              <el-form-item prop="createTime" label="创建时间">
                <el-date-picker
                        v-model="searchData.datetime"
                        type="datetimerange"
                        start-placeholder="Start Date"
                        end-placeholder="End Date"
                        :default-time="defaultTime1"
                        size="large"
                />
              </el-form-item>
              <el-form-item prop="Module" label="模块">
                <el-input v-model="searchData.Module" size="large" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item prop="CaseTitle" label="用例名">
                <el-input v-model="searchData.CaseTitle" size="large" placeholder="请输入"></el-input>
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
          <el-table :data="TestCaseList">
            <el-table-column v-for="(column,key) in testCaseType"
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
                <el-button type="danger" text bg size="small" @click="DeletCase(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-dialog v-model="drawer" :direction="'rtl'" size="80%" :title="isEdit ? '添加' : '修改' ">
        <template #default>
          <div class="content-wrapper">
            <el-divider content-position="left" style="height: 40px !important;width: auto !important;">用例信息</el-divider>
            <div class="footer-wrapper-divider">
              <el-form :label-position="'right'" label-width="80px" :model="RowList"
                       class="demo-form-inline" :rules="formRules" ref="formRef">
                <div v-for="(column,key) in testCaseType "
                     :key=key>
                <el-form-item class="el-form-item-label"
                              v-if="column.label!='创建时间'&& column.label!='更新时间'">
                  <template #default="scope" v-if="column.label!='创建时间'&& column.label!='更新时间'">
                    <el-form-item :label="column.label" :prop="column.prop">
                    <el-input
                              v-model="RowList[column.prop]"
                              autocomplete="off"
                              :disabled="column.isDisabled"
                    ></el-input>
                    </el-form-item>
                  </template>
                </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </template>
        <template #footer>
          <div style="flex: auto" class="footer-buttons">
            <el-button @click="drawer = false">取消</el-button>
            <el-button type="primary" @click="confirmChange(formRef)">确定</el-button>
          </div>
        </template>
      </el-dialog>
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


.search-main-container .el-form-item-label {
  width: 400px;
  margin-top: 10px;
}

.card-wrapper .el-form-item.asterisk-left.el-form-item--label-right {
  width: auto;
  padding-bottom: 20px;
}
.table-wrapper button{
  width: 60px !important;
  height: 20px !important;
}
.content-wrapper {
  width: 100% !important;
  height: auto !important;
}
.content-wrapper .el-form-item-label {
  width: auto !important;
  padding-top: 20px;
}
.content-wrapper input {
  width: auto !important;
  height: 40px !important;
}
.card-wrapper .el-form-item-label {
  width: 400px;
  margin-top: 10px;
}

.footer-buttons button {
  width: 60px !important;
  height: 40px !important;
}
</style>