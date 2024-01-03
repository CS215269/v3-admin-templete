<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, getTableDataApi } from "@/api/table-result/index"
import { type GetTableResultData } from "@/api/table-result/types/table-result"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { getBatchOptionsApi } from "@/api/table-batch"
import { getPositionOptionApi } from "@/api/table-position"

defineOptions({
  // 命名当前组件
  name: "TablePosition"
})

const positionList = ref<{ id: number; jobTitle: string }[]>([])
const batchList = ref<{ id: number; name: string }[]>([])

onMounted(() => {
  getBatchOptionsApi()
    .then((res) => {
      batchList.value = res.data.list
    })
    .catch(() => {
      batchList.value = []
    })
    .finally(() => {
      loading.value = false
    })
  getPositionOptionApi()
    .then((res) => {
      positionList.value = res.data.list
    })
    .catch(() => {
      positionList.value = []
    })
    .finally(() => {
      loading.value = false
    })
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  positionId: "",
  batchId: ""
})
const formRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入岗位名称" }],
  account: [
    { required: true, trigger: "blur", message: "请输入账号" }
    // {
    //   pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
    //   trigger: "blur",
    //   message: "请输入有效的身份证号码"
    // }
    // dsa validator: isChineseIdCard,
  ],
  pwd: [{ required: true, trigger: "blur", message: "请输入密码" }],
  phone: [{ required: true, trigger: "blur", message: "请输入电话" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    const batch = batchList.value.find((item) => item.name === formData.batchId)
    const position = positionList.value.find((item) => item.jobTitle === formData.positionId)
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createTableDataApi({
          batchId: batch != undefined ? Number(batch.id) : Number(formData.batchId),
          positionId: position != undefined ? Number(position.id) : Number(formData.positionId)
        })
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
          batchId: batch != undefined ? Number(batch.id) : Number(formData.batchId),
          positionId: position != undefined ? Number(position.id) : Number(formData.positionId)
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
  formData.positionId = ""
  formData.batchId = ""
}
//#endregion

//#region 删
const handleDelete = (row: GetTableResultData) => {
  ElMessageBox.confirm(`取消招聘岗位：${row.jobTitle}，确认？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(row.recruitId).then(() => {
      ElMessage.success("取消成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdate = (row: GetTableResultData) => {
  currentUpdateId.value = row.recruitId
  formData.positionId = positionList.value.find((item) => item.id === row.positionId)?.jobTitle as string
  formData.batchId = batchList.value.find((item) => item.id === row.batchId)?.name as string
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<GetTableResultData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  jobTitle: [],
  batchName: []
})
const getTableData = () => {
  loading.value = true
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    jobTitles: searchData.jobTitle,
    batches: searchData.batchName || undefined
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

const batchSort = (a: GetTableResultData, b: GetTableResultData) => {
  // 根据batchId属性进行比较并返回排序结果
  return a.batchId - b.batchId
}
// }

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="jobTitle" label="批次" size="large">
          <el-select
            v-model="searchData.batchName"
            filterable
            collapse-tags
            collapse-tags-tooltip
            multiple
            placeholder="请输入"
          >
            <el-option v-for="item in batchList" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item prop="batchName" label="岗位名称" size="large">
          <el-select
            v-model="searchData.jobTitle"
            filterable
            collapse-tags
            collapse-tags-tooltip
            multiple
            placeholder="请输入"
          >
            <el-option v-for="item in positionList" :key="item.id" :label="item.jobTitle" :value="item.jobTitle" />
          </el-select>
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
        <el-table :data="tableData" stripe height="60vh">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="batchname" sortable :sort-method="batchSort" label="批次" align="center" />
          <el-table-column prop="jobTitle" sortable label="岗位名称" align="center" />
          <el-table-column prop="department" label="所属部门" align="center" />
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
        <p>关于岗位的一些建议</p>
        <el-form-item prop="batchId" label="所属批次">
          <el-select v-model="formData.batchId" filterable placeholder="请选择所属批次">
            <el-option v-for="item in batchList" :key="item.id" :label="item.name" :value="item.id"
          /></el-select>
        </el-form-item>
        <el-form-item prop="positionId" label="岗位名称">
          <el-select v-model="formData.positionId" filterable placeholder="岗位">
            <el-option v-for="item in positionList" :key="item.id" :label="item.jobTitle" :value="item.id" />
          </el-select>
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
