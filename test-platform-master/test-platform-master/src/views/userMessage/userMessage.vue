<script setup lang="ts">
import {formatDate, formatValue, formatValues} from "@/utils/formater";
import {Search, Delete, RefreshRight, Plus, Iphone} from "@element-plus/icons-vue";
import {FormInstance, FormRules} from "element-plus"
import {debounce} from "lodash";


const searchData = reactive({
  datetime: 0,
  address: "",
  username: null,
});
const psData = reactive({
  newPs: null,
  newPs1: null,
});
const scroll = reactive({
  pageNum: 1,
  pageSize: 10,
  TotalPage: null,
  provinceid: null,
});
const defaultTime1: [Date, Date] = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]
const formRef = ref<FormInstance>()
const index_ = ref<number>();
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
let show = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);
const total = ref<number>(0);//改变当前页码
import {onMounted, reactive, ref} from "vue";
import {PsEdit, userAdd, userEdit, userList} from "@/api/userMessage";
import {jsonStringSwitch} from "@/utils/handleData";
import {getDecryptData, getSecretData} from "@/utils/crypto";
import {ElMessage} from "element-plus";
import {zoneCity, zoneProvince} from "@/api/zone";

const drawer = ref(false)
const isEdit = ref<boolean>(false);
const loading = ref<boolean>(false);
const ListType = ref<any[]>([
  {prop: "username", label: '姓名', isDisabled: false},
  {prop: "phone", label: '电话', isDisabled: false},
  {prop: "province", label: '省份', isDisabled: false},
  {prop: "city", label: '城市', isDisabled: false},
  {prop: "address", label: '地址', isDisabled: false},
  {prop: "zip", label: '邮政编码', isDisabled: false},
  {prop: "createTime", label: '创建时间', isDisabled: true},
  {prop: "updateTime", label: '更新时间', isDisabled: true},
]);
let RowList = ref<any>({})
let UserList = reactive<any>([])
const GetUserList = () => {
  userList({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    datetime: 0,
    address: searchData.address,
    username: searchData.username,
  }).then((res: any) => {
    const data = (jsonStringSwitch("Json", getDecryptData(res.data)));
    total.value = data.total;
    UserList.value = data.list.map((item: any) => {
      return {
        ...item,
      }
    });
  })
}
const currentChange = (value: number) => {
  pageNum.value = value;
  GetUserList()
}
const search = (SHOW: boolean) => {
  if (SHOW) {
    show.value = !show.value;
  } else {
    debouncedGetUserList()
  }
}
const debouncedGetUserList =
        debounce(() => {
          GetUserList();
        }, 500);

const Add = () => {
  RowList.value = {}
  drawer.value = true;
  isEdit.value = true;
}
const Edit = (row: any, index: any) => {
  RowList.value = JSON.parse(JSON.stringify(row));
  drawer.value = true;
  isEdit.value = false;
  index_.value = index;
}
const confirmChange = () => {
  if (isEdit.value) {
    userAdd(
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
    userEdit(
            getSecretData(jsonStringSwitch("String", RowList.value)),
    ).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          message: '更新成功',
          type: 'success',
        })
        // /*同步更新列表数据*/
        // UserList.value.splice(index_.value, 1, RowList.value);
        search(false)
// 使用 splice 替换元素
      }
    });
    /*关闭修改弹窗*/
    drawer.value = false;
  }
}
const clear = () => {
  searchData.address = "";
  console.log(searchData.datetime)
  searchData.datetime = 0;

  searchData.username = null;
}
const showEditPs = () => {
  dialogVisible.value = true;

}
/*自定义校验密码是否一致*/
const validatePassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== psData.newPs) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};
/*密码弹窗校验规则*/
const rules = reactive<FormRules<typeof psData>>({
  newPs: [{required: true, trigger: "blur", message: "请输入新密码"},
    {min: 6, message: '密码长度不能少于6位', trigger: 'blur'}
  ],
  newPs1: [{required: true, trigger: "blur", message: "请输入确认密码"},
    {validator: validatePassword, trigger: 'blur'}
  ],
})

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
const formRefs = ref<FormInstance>()
/*修改密码提交*/
const editPs = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      PsEdit({
        newPs: psData.newPs1
      }).then((res: any) => {
        if (res.code === 200) {
          dialogVisible.value = false;
          console.log();
          ElMessage({
            message: '更新成功',
            type: 'success',
          })
        } else {
          ElMessage({
            message: '操作失败',
            type: 'warning',
          })
        }
      })
    }
  })
}

/*删除*/
const userDelete = (row: any) => {
  row.state = -1
  console.log(row)
  userEdit(getSecretData(jsonStringSwitch("String", row)),
  ).then((res: any) => {
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    search(false)
  })
}

interface LinkItem {
  value: string,
  state: number,
  provinceid: number,
  weight: number
}

const links = ref<LinkItem[]>([])
let timeout: ReturnType<typeof setTimeout>
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString ? links.value.filter(createFilter(queryString)) : links.value
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    cb(results)
  }, 5000 * Math.random())
}
const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
////////*自动补全输入框*///////
/*点击选中建议项时触发*/
const getOptionData = (item: any, name: string) => {
  switch (name) {
    case 'province':
      scroll.provinceid = item.provinceid
      break
  }
}

// 定义一个变量来存储 debounce 后的函数
const handleScroll = (name: any) => {
  if (name === 'city') {
    /*判断省是否存在数据*/
    if (RowList.value.province === null) {
      scroll.provinceid = null
    }
    zoneCity({
      pageNum: scroll.pageNum,
      pageSize: scroll.pageSize,
      provinceid: scroll.provinceid,
    }).then((res: any) => {
      const data = (jsonStringSwitch("Json", getDecryptData(res.data)));
      scroll.TotalPage = data.total
      links.value = data.map((item: any) => {
        return {
          ...item
        }
      })
    })
  } else {
    zoneProvince({
      pageNum: scroll.pageNum,
      pageSize: scroll.pageSize,
      name: null
    }).then((res: any) => {
      const data = (jsonStringSwitch("Json", getDecryptData(res.data)));
      links.value = data.map((item: any) => {
        return {
          ...item
        }
      })
    })
  }
}

onMounted(() => {
  GetUserList()
})
</script>
<template>
  <el-main>
    <div class="common-layout">
      <el-card v-loading="loading" shadow="never" class="card-wrapper">
        <div class="toolbar-wrapper">
          <div>
          </div>
          <div class="search-wrapper">
            <el-tooltip content="搜索">
              <el-button type="primary" :icon="Search" circle @click="search(true)"/>
            </el-tooltip>
            <el-tooltip content="添加商品">
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
          <el-table :data="UserList.value" stripe style="width: 100%">
            <el-table-column
                    v-for="(column,key) in ListType"
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
                <el-button type="primary" text bg size="small" @click="showEditPs">
                  修改密码
                </el-button>
                <el-button type="danger" text bg size="small" @click="userDelete(scope.row)">
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
      <el-drawer v-model="drawer" :direction="'btt'" size="50%" :title="isEdit ? '添加' : '修改' ">
        <template #default>
          <div class="content-wrapper">
            <el-divider content-position="left">用户信息</el-divider>
            <div class="footer-wrapper-divider">
              <el-form :label-position="'right'" label-width="150px" :inline="true" :model="RowList"
                       class="demo-form-inline">

                <el-form-item v-for="(column,key) in ListType"
                              :key=key
                              :label="column.label"
                              class="el-form-item-label" :icon="Iphone">

                  <el-input v-if="column.label!='省份'&& column.label!='城市'"
                            v-model="RowList[column.prop]"
                            autocomplete="off"
                            :disabled="column.isDisabled"
                            :formatter="(row:any)=>formatValues(row,column.prop)"

                  ></el-input>
                  <el-autocomplete v-if="column.label=='省份'||column.label=='城市'"
                                   v-model="RowList[column.prop]"
                                   :fetch-suggestions="querySearchAsync"
                                   clearable
                                   class="inline-input w-50"
                                   placeholder="Please Input"
                                   @focus="handleScroll(column.prop)"
                                   @select="(item)=>getOptionData(item,column.prop)"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </template>
        <template #footer>
          <div style="flex: auto" class="footer-buttons">
            <el-button @click="drawer = false">取消</el-button>
            <el-button type="primary" @click="confirmChange()">确定</el-button>
          </div>
        </template>
      </el-drawer>
    </div>
    <div class="dialog-wrapper">
      <el-dialog title="修改用户密码" v-model="dialogVisible" :close-on-click-modal="false" width="500">
        <el-form :model="psData" ref="formRef" :rules="rules" class="form-ps" :label-position="'right'"
                 label-width="100px">
          <el-form-item label="新密码:" prop="newPs">
            <el-input v-model="psData.newPs" autocomplete="off" show-password
                      ref="newPs"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="newPs1">
            <el-input v-model="psData.newPs1" autocomplete="off" show-password
                      ref="newPs1"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editPs(formRef)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-main>
</template>
<style scoped>
* {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}

.el-pagination {
  width: 150px;
}

.common-layout {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

main {
  /* 隐藏滚动条 */
  overflow: auto; /* 允许滚动 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 和 Edge */
  width: 100% !important;
  height: auto !important;
}

.card-wrapper {
  margin: 20px 20px 0 20px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 0 10px grey;
  height: auto;
}

button {
  width: 30px !important;
}

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


.content-wrapper {
  height: 30px;
}

.dialog-footer button {
  width: 80px !important;
  height: 40px;
}


.footer-buttons button {
  width: 80px !important;
  height: 40px;
}

.el-form-item.asterisk-left.el-form-item--label-right {
  width: auto;
  padding-bottom: 20px;
}


</style>