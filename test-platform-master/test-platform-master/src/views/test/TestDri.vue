<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {Delete, Plus, RefreshRight, Search} from "@element-plus/icons-vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {EditTestCase, EditTestCaseDir, InsertTestCase, InsertTestCaseDri, ListTestCaseDir} from "@/api/Testcase";
import {getSecretData} from "@/utils/crypto";
import {jsonStringSwitch} from "@/utils/handleData";
import {setCookie} from "@/cookies";
import {loginUserMessage} from "@/api/login";
const formRef = ref<FormInstance>()
const pageSize = ref<number>(10);
const pageNum = ref<number>(1);
const drawer = ref(false)
const isEdit = ref<boolean>(false);
const index_ = ref<number>();
const dialogVisible = ref<boolean>(false);
const total = ref<number>(0);//改变当前页码
let show = ref<boolean>(false);
const defaultTime1: [Date, Date] = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
];
const searchData = reactive({
  datetime: 0,
  address: "",
  username: null,
});
let RowList = ref<any>({})
const DriType = ref<any[]>([
  {label: '序号', prop: 'testCaseDrId'},
  {label: '用例文件名', prop: 'testCaseDriName'},
  {label: '创建时间', prop: 'createTime'},
  {label: '更新时间', prop: 'updateTime'},
  {label: '备注', prop: 'remark'},
])
// 表单验证规则
const formRules =reactive<FormRules<typeof RowList>>({
  testCaseDriName: [{ required: true, trigger: "blur", message: "请输入用例文件名" }],
})
const DriList = reactive<any>([])

const search = (SHOW: boolean) => {
  if (SHOW) {
    show.value = !show.value;
  } else {
    getListTestCaseDir()
  }
}
const getListTestCaseDir = () => {
  ListTestCaseDir({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  }).then((res:any) => {
    DriList.value = res.data.list.map((item: any) => {
      return {
        ...item,
      }
    });

  })
}
const Edit = (row: any, index: any) => {
  RowList.value = JSON.parse(JSON.stringify(row));
  drawer.value = true;
  isEdit.value = false;
  index_.value = index;
}

const Add=()=>{
  isEdit.value = true;
  drawer.value = true;
  RowList.value = {}
}

const confirmChange=(formEl: FormInstance | undefined)=>{
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        InsertTestCaseDri(
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
        EditTestCaseDir(
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

/*删除*/
const DeleteDri = (row: any) => {
  console.log(row);
  row.state = -1
  EditTestCaseDir(getSecretData(jsonStringSwitch("String", row)),
  ).then((res: any) => {
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    getListTestCaseDir()
  })
}
onMounted(() => {
  getListTestCaseDir()
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
                <el-form-item prop="username" label="用户名">
                  <el-input v-model="searchData.username" size="large" placeholder="请输入"></el-input>
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

                             align="center">
              <template #default="scope" v-if="column.prop=='testCaseDriName'">
                <router-link :to="{ path: '/test/testcase', state: {testCaseDrId:scope.row.testCaseDrId,name:scope.row.testCaseDriName}}">
                  {{scope.row[column.prop]?scope.row[column.prop]:"--"}}
                </router-link>
              </template>
              <template #default="scope" v-else-if="column.prop=='createTime'||column.prop=='updateTime'">
                {{scope.row[column.prop]?new Date(scope.row[column.prop]*1000).toLocaleString():"--"}}
              </template>
              <template #default="scope" v-else>
                {{scope.row[column.prop]?scope.row[column.prop]:"--"}}
              </template>
            </el-table-column>
              <el-table-column label="操作" align="center" width="200">
                <template #default="scope">
                  <el-button type="primary" text bg size="small"
                             @click="Edit(scope.row,scope.$index)">
                    修改
                  </el-button>
                  <el-button type="danger" text bg size="small" @click="DeleteDri(scope.row)">
                    删除
                  </el-button>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pager-wrapper">
          <el-pagination
              layout="prev, pager, next"
              :total="total"
              :page-size="pageSize"
              @current-change="currentChange"/>
        </div>
      </el-card>
      <el-dialog v-model="drawer" :direction="'rtl'" size="80%" :title="isEdit ? '添加' : '修改' ">
        <template #default>
          <div class="content-wrapper">
            <el-divider content-position="left" style="height: 40px !important;width: auto !important;">用例信息</el-divider>
            <div class="footer-wrapper-divider">
              <el-form :label-position="'right'" label-width="auto" :model="RowList"
                       class="demo-form-inline" :rules="formRules" ref="formRef">
                <div v-for="(column,key) in DriType "
                     :key=key>
                  <el-form-item class="el-form-item-label"
                                v-if="column.label!='创建时间'&& column.label!='更新时间'">
                  <template #default="scope" v-if="column.label=='用例文件名' || column.label=='备注'">
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

.card-wrapper .el-form-item-label {
  width: 400px;
  margin-top: 10px;
}
.card-wrapper .el-form-item.asterisk-left.el-form-item--label-right {
  width: auto;
  padding-bottom: 20px;
}
.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
.el-pagination {
  width: 150px;
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
.footer-buttons button {
  width: 60px !important;
  height: 40px !important;
}

</style>