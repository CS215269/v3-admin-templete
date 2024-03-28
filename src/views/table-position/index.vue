<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, getTableDataApi } from "@/api/table-position/index"
import { type GetTablePositionData } from "@/api/table-position/types/table-position"
import {
  type FormInstance,
  type FormRules,
  ElMessage,
  ElMessageBox,
  ElTooltip,
  ElTooltipProps,
  ElTable
} from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

defineOptions({
  // 命名当前组件
  name: "TablePosition"
})

// 计算属性
const getEducationLabel = (education: number) => {
  switch (education) {
    case 1:
      return "高职"
    case 2:
      return "大专"
    case 3:
      return "本科"
    case 4:
      return "硕士"
    case 5:
      return "博士"
    default:
      return "未知"
  }
}
// 计算属性
const getDegreeLabel = (degree: number) => {
  switch (degree) {
    case 1:
      return "学士"
    case 2:
      return "硕士"
    case 3:
      return "博士"
    default:
      return "未知"
  }
}
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  jobTitle: "",
  education: "",
  degree: "",
  salary: [0, 0],
  info: "",
  require: ""
})
const formDataSubmit = reactive({
  jobTitle: "",
  education: 0,
  degree: 0,
  info: "",
  require: ""
})
const formRules: FormRules = reactive({
  jobTitle: [{ required: true, trigger: "blur", message: "请输入岗位名称" }],
  education: [{ required: true, trigger: "blur", message: "请选择学历要求" }],
  degree: [{ required: true, trigger: "blur", message: "请选择学位要求" }],
  info: [{ required: true, trigger: "blur", message: "请输入详细介绍" }],
  require: [{ required: true, trigger: "blur", message: "请输入额外要求" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        formDataSubmit.jobTitle = formData.jobTitle
        formDataSubmit.education = Number(formData.education)
        formDataSubmit.info = formData.info
        formDataSubmit.require = formData.require
        createTableDataApi(formDataSubmit)
          .then(() => {
            ElMessage.success("新增成功")
            getTableData()
          })
          .catch((e) => {
            console.log(e)
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        updateTableDataApi({
          id: currentUpdateId.value,
          jobTitle: formData.jobTitle,
          education: Number(formData.education),
          degree: Number(formData.degree),
          require: formData.require,
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
  formData.education = ""
  formData.salary = [1000, 9000]
  formData.require = ""
  formData.info = ""
}
//#endregion

//#region 删
const handleDelete = (row: GetTablePositionData) => {
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
const handleUpdate = (row: GetTablePositionData) => {
  currentUpdateId.value = row.id
  formData.jobTitle = row.jobTitle
  formData.education = String(row.education)
  formData.degree = String(row.degree)
  formData.require = row.require
  formData.info = row.info
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<GetTablePositionData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  jobTitle: ""
})
const getTableData = () => {
  loading.value = true
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize
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

/** 配置气泡提示 */
const tableTooltipOption: Partial<ElTooltipProps> = {
  placement: "left-start",
  effect: "light"
}

const multipleSelection = ref<GetTablePositionData[]>([])
const handleSelectionChange = (val: GetTablePositionData[]) => {
  multipleSelection.value = val
}

/** 添加删除选中行的方法 */
const deleteLoading = ref<boolean>(false)
/** 添加删除选中行的方法 */
const deleteSelection = () => {
  deleteLoading.value = true
  if (!multipleSelection.value || multipleSelection.value.length === 0) {
    deleteLoading.value = false
    return ElMessage.warning("请选择要删除的行")
  }
  const ids = multipleSelection.value.map((item: { id: any }) => item.id)
  ElMessageBox.confirm(`确定删除选中的${ids.length}条数据?`, "删除数据", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(ids)
      .then(() => {
        ElMessage.success("删除成功")
        getTableData()
      })
      .catch(() => {
        ElMessage.error("删除失败")
      })
      .finally(() => {
        deleteLoading.value = false
      })
  })
}
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="名称">
          <el-input v-model="searchData.jobTitle" placeholder="请输入" />
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
          <el-button type="danger" :icon="Delete" @click="deleteSelection" :loading="deleteLoading">批量删除</el-button>
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
        <el-table
          :data="tableData"
          :tooltip-options="tableTooltipOption"
          @selection-change="handleSelectionChange"
          tooltip-effect="light"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="jobTitle" label="岗位名称" align="center">
            <template #default="scope">
              {{ scope.row.code + "-" + scope.row.jobTitle }}
            </template>
          </el-table-column>
          <el-table-column prop="education" label="所需学历" align="center">
            <template #default="scope">
              {{ getEducationLabel(scope.row.education) }}
            </template>
          </el-table-column>
          <el-table-column prop="degree" label="所需学位" align="center">
            <template #default="scope">
              {{ getDegreeLabel(scope.row.degree) }}
            </template>
          </el-table-column>
          <el-table-column prop="require" label="要求" align="center" />
          <el-table-column prop="minSalary" label="最低薪资" align="center" />
          <el-table-column prop="maxSalary" label="最高薪资" align="center" />
          <el-table-column prop="info" label="介绍信息" align="center" show-overflow-tooltip />
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
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <p>添加岗位,所属批次关闭时次岗位对用户不可见</p>
        <el-form-item prop="jobTitle" label="岗位名称">
          <el-input v-model="formData.jobTitle" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="education" label="学历要求">
          <el-select v-model="formData.education" placeholder="请选择">
            <!-- <el-option v-for="item in positionList" :key="item.id" :label="item.jobTitle" :value="item.id" /> -->
            <el-option label="大专" value="0" />
            <el-option label="本科" value="1" />
            <el-option label="研究生" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="degree" label="学位要求">
          <el-select v-model="formData.degree" placeholder="请选择">
            <!-- <el-option v-for="item in positionList" :key="item.id" :label="item.jobTitle" :value="item.id" /> -->
            <el-option label="无" value="0" />
            <el-option label="学士" value="1" />
            <el-option label="硕士" value="2" />
            <el-option label="博士" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item prop="require" label="入职要求">
          <el-input v-model="formData.require" placeholder="请输入" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item prop="info" label="介绍信息">
          <el-input
            v-model="formData.info"
            :rows="2"
            type="textarea"
            placeholder="请输入"
            maxlength="80"
            show-word-limit
          />
        </el-form-item>
      </el-form>
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
