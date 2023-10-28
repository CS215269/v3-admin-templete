<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, getTableDataApi } from "@/api/table-thing"
import { type GetTableThingData } from "@/api/table-thing/types/table-thing"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
// import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

defineOptions({
  // 命名当前组件
  name: "TableThing"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  jobTitle: "",
  department: "",
  degree: "",
  info: ""
})
// const formRules: FormRules = reactive({
//   name: [{ required: true, trigger: "blur", message: "请输入岗位名称" }],
//   account: [
//     { required: true, trigger: "blur", message: "请输入账号" },
//     {
//       pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
//       trigger: "blur",
//       message: "请输入有效的身份证号码"
//     }
//     // dsa validator: isChineseIdCard,
//   ],
//   pwd: [{ required: true, trigger: "blur", message: "请输入密码" }],
//   phone: [{ required: true, trigger: "blur", message: "请输入电话" }]
// })
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createTableDataApi(formData)
          .then(() => {
            ElMessage.success("新增成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        updateTableDataApi({
          id: currentUpdateId.value,
          jobTitle: formData.jobTitle,
          department: formData.department,
          degree: formData.degree,
          info: formData.info
        })
          .then(() => {
            ElMessage.success("修改成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.jobTitle = ""
  formData.department = ""
  formData.degree = ""
  formData.info = ""
}
//#endregion

//#region 删
const handleDelete = (row: GetTableThingData) => {
  ElMessageBox.confirm(`正在删除岗位：${row.jobTitle}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdate = (row: GetTableThingData) => {
  currentUpdateId.value = row.id
  formData.jobTitle = row.jobTitle
  formData.department = row.department
  formData.degree = row.degree
  formData.info = row.info
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<GetTableThingData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  jobTitle: "",
  department: ""
})
const getTableData = () => {
  loading.value = true
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    jobTitle: searchData.jobTitle || undefined,
    department: searchData.department || undefined
  })
    .then((res) => {
      paginationData.total = res.data.total
      tableData.value = res.data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="岗位名">
          <el-input v-model="searchData.jobTitle" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="open" label="状态">
          <el-input v-model="searchData.department" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增岗位</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="岗位名称" align="center" />
          <el-table-column prop="open" label="岗位状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.open" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="warning" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="account" label="账号" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增岗位' : '修改岗位'"
      @close="resetForm"
      width="30%"
    >
      <!-- <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <p>关于事务的一些建议</p>
        <el-form-item prop="name" label="事务名称">
          <el-input v-model="formData.jobTitle" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="open" label="岗位状态">
          <el-select v-model="formData.open" placeholder="请输入">
            <el-option label="已启用" value="1" />
            <el-option label="已禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="startime" label="开始时间">
          <el-date-picker v-model="formData.startime" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="deadline" label="结束时间">
          <el-input v-model="formData.deadline" placeholder="请输入" />
        </el-form-item>
      </el-form> -->
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
