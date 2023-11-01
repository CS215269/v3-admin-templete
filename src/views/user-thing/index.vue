<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getTableDataApi } from "@/api/table-thing"
import { type GetTableThingData } from "@/api/table-thing/types/table-thing"
import { type FormInstance } from "element-plus"
// import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Download, RefreshRight, Dish } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

defineOptions({
  // 命名当前组件
  name: "UserThing"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// 计算属性
const getDegreeLabel = (row: { degree: number }) => {
  switch (row.degree) {
    case 1:
      return "中专"
    case 2:
      return "大专"
    case 3:
      return "本科"
    case 4:
      return "硕士"
    case 5:
      return "博士"
    default:
      return "异常"
  }
}

//#region 查
const tableData = ref<GetTableThingData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  batch: "",
  jobTitle: "",
  department: ""
})
const getTableData = () => {
  loading.value = true
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    batch: searchData.batch || undefined,
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

const showinfo = (row: GetTableThingData) => {
  console.log(row)
}

const agree = (row: GetTableThingData) => {
  console.log(row)
}
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="batch" label="批次">
          <el-input v-model="searchData.jobTitle" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="username" label="岗位名">
          <el-input v-model="searchData.jobTitle" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="department" label="部门">
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
          <el-button type="primary" :icon="CirclePlus" @click="null">批量同意</el-button>
          <el-button type="danger" :icon="Dish">打印准考证</el-button>
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
          <el-table-column prop="jobTitle" label="岗位名称" align="center" />
          <el-table-column prop="department" label="所属部门" align="center" />
          <el-table-column prop="username" label="用户姓名" align="center" />
          <el-table-column prop="school" label="毕业院校" align="center" />
          <el-table-column prop="degree" label="学历" align="center">
            <template #default="degreeScope">
              {{ getDegreeLabel(degreeScope.row) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="250" align="center">
            <template #default="scope">
              <el-button type="info" text bg size="small" @click="showinfo(scope.row)">详细信息</el-button>
              <el-button type="primary" text bg size="small" @click="agree(scope.row)">同意</el-button>
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
    <!-- <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增岗位' : '修改岗位'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <p>关于事务的一些建议</p>
        <el-form-item prop="name" label="事务名称">
          <el-input v-model="formData.jobTitle" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog> -->
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
