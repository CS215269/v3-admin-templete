<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import { ElMessage, ElTable, type FormInstance } from "element-plus"
// import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { getTableDataBySearchApi, prePrintfCertificatesApi, prePrintfCertificatesDataApi } from "@/api/table-thing"
import { type GetTableThingData } from "@/api/table-thing/types/table-thing"
import { getBatchOptionsApi } from "@/api/table-batch"
import { getPositionOptionApi } from "@/api/table-position"
import AuditReviewForm from "@/components/AuditReviewForm/AuditReviewForm.vue"
import { usePagination } from "@/hooks/usePagination"
import { renderAsync } from "docx-preview"

defineOptions({
  // 命名当前组件
  name: "TableThing"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// 计算属性
const getDegreeLabel = (row: { degree: number }) => {
  switch (row.degree) {
    case 0:
      return "无"
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
const progressFormatter = (row: { status: number }) => {
  switch (row.status) {
    case 0:
      return "未处理"
    case 1:
      return "已同意"
    case 2:
      return "已打印"
    default:
      return "未知"
  }
}

//#region 查
const tableData = ref<GetTableThingData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  batches: [],
  jobTitle: [],
  status: [],
  name: ""
})
const getTableData = () => {
  loading.value = true
  getTableDataBySearchApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    batches: searchData.batches,
    jobTitles: searchData.jobTitle,
    status: searchData.status,
    name: searchData.name
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
    .finally(() => {})
  getPositionOptionApi()
    .then((res) => {
      positionList.value = res.data.list
    })
    .catch(() => {
      positionList.value = []
    })
    .finally(() => {})
})

/** 详细信息弹框开关 */
const drawerVisible = ref<boolean>(false)
/** 详细信息:code */
const code = ref<string>("")
/** 详细信息thingId */
const thingId = ref<number>(0)
const status = ref<number>(0)
const showinfoHandle = (row: GetTableThingData) => {
  code.value = row.code
  thingId.value = row.thingId
  status.value = row.status
  drawerVisible.value = true
  console.log("打开框")
  console.log(row.username)
  console.log(code.value)
  console.log(thingId.value)
}

const handleCloseDrawer = () => {
  drawerVisible.value = false
  getTableData()
}

/** 表格引用 */
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
/** 选中行 */
const multipleSelection = ref<GetTableThingData[]>([])
const handleSelectionChange = (val: GetTableThingData[]) => {
  multipleSelection.value = val
}

const batchSort = (a: GetTableThingData, b: GetTableThingData) => {
  // 根据batchId属性进行比较并返回排序结果
  return a.batchId - b.batchId
}

const timeSort = (a: GetTableThingData, b: GetTableThingData) => {
  if (a.time == b.time) return 0
  return a.time > b.time ? 1 : -1
}

/** 打印准考证预览 */
const previewDialog = ref<boolean>(false)
/** 准考证预览正在加载 */
const previewLoading = ref<boolean>(false)
/** 准考证预览准考证号 */
const previewCode2 = ref<number>(0)
/** 准考证预览岗位号 */
const previewCode = ref<number>(0)
/** 暂存的blob对象 */
const blob = ref<Blob>()
/** 打印准考证预览 */
const prePrintCertificates = (id: number) => {
  previewLoading.value = true
  previewDialog.value = true
  prePrintfCertificatesDataApi({ id })
    .then((res) => {
      previewCode.value = res.data.code
      previewCode2.value = res.data.codeWithUser
    })
    .catch((e) => {
      console.log(e)
    })
    .finally(() => {})

  prePrintfCertificatesApi()
    .then((res) => {
      console.log(res)
      blob.value = new Blob([res])
      // 在这里使用docData渲染docx文档
      const container = document.getElementById("container_docx")
      if (container) {
        renderAsync(blob.value, container).then(() => console.log("docx: finished"))
      } else {
        console.log("Can not find container element")
      }
    })
    .catch(() => {
      ElMessage.error("预览准考证服务异常")
    })
    .finally(() => {
      previewLoading.value = false
    })
}

/** 下载缓存的blob对象 */
const downloadBlob = () => {
  if (blob.value) {
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob.value)
    a.download = `准考证_${previewCode2.value}.docx`
    a.click()
  }
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="batches" label="批次" size="large">
          <el-select
            v-model="searchData.batches"
            filterable
            collapse-tags
            collapse-tags-tooltip
            multiple
            placeholder="请输入"
          >
            <el-option v-for="item in batchList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="jobTitle" label="岗位名" size="large">
          <el-select
            v-model="searchData.jobTitle"
            filterable
            collapse-tags
            collapse-tags-tooltip
            multiple
            placeholder="请输入"
          >
            <el-option v-for="item in positionList" :key="item.id" :label="item.jobTitle" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="审核进度" size="large">
          <el-select
            v-model="searchData.status"
            filterable
            collapse-tags
            collapse-tags-tooltip
            multiple
            placeholder="请输入"
          >
            <el-option label="未处理" :value="0" />
            <el-option label="同意待审核" :value="1" />
            <el-option label="拒绝待审核" :value="-1" />
            <el-option label="同意" :value="2" />
            <el-option label="拒绝" :value="-2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="用户姓名" size="large">
          <el-input v-model="searchData.name" />
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
        <el-table ref="multipleTableRef" :data="tableData" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="batchname" sortable :sort-method="batchSort" label="批次" align="center" />
          <el-table-column prop="jobTitle" sortable label="岗位名称" align="center">
            <template #default="spoce">
              {{ spoce.row.code + "-" + spoce.row.jobTitle }}
            </template>
          </el-table-column>
          <el-table-column prop="username" sortable label="用户姓名" align="center" />
          <el-table-column prop="time" sortable :sort-method="timeSort" label="创建时间" align="center" />
          <el-table-column prop="degree" sortable label="学位要求" align="center">
            <template #default="educationScope">
              {{ getDegreeLabel(educationScope.row) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="审核进度" align="center" :formatter="progressFormatter">
            <template #default="scope">
              <template v-if="scope.row.status === -2">
                <el-tag type="warning">已拒绝</el-tag>
              </template>
              <template v-else-if="scope.row.status === -1">
                <el-tag type="warning">拒绝待确认</el-tag>
              </template>
              <template v-else-if="scope.row.status === 0">
                <el-tag type="danger">未处理</el-tag>
              </template>
              <template v-else-if="scope.row.status === 1">
                <el-tag type="success">同意待确认</el-tag>
              </template>
              <template v-else-if="scope.row.status === 2">
                <el-tag type="success">已同意</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="150" align="left">
            <template #default="scope">
              <el-button type="info" bg size="small" @click="showinfoHandle(scope.row)"> 详细信息 </el-button>
              <el-button type="primary" bg size="small" @click="prePrintCertificates(scope.row.id)">
                下载准考证
              </el-button>
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
    <el-dialog title="准考证预览" v-model:visible="previewDialog" width="80%">
      <el-card v-loading="previewLoading" shadow="never">
        <div id="container_docx" />
      </el-card>
      <template #footer>
        <el-button type="primary" @click="previewDialog = false">关闭</el-button>

        <el-popconfirm title="准考证不可撤回,你确定要导出吗？" @confirm="downloadBlob">
          <template #reference>
            <el-button type="primary">导出</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-dialog>
    <el-drawer v-model="drawerVisible" size="80%" :destroy-on-close="true">
      <AuditReviewForm :code="code" :thingId="thingId" :status="status" @close-drawer="handleCloseDrawer()" />
    </el-drawer>
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
