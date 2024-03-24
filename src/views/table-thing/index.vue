<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import { ElMessage, ElTable, type FormInstance } from "element-plus"
// import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import {
  accept2ThingApi,
  accept3ThingApi,
  acceptThingApi,
  getTableDataBySearchApi,
  refuseThingDataApi
} from "@/api/table-thing"
import { type GetTableThingData } from "@/api/table-thing/types/table-thing"
import { getBatchOptionsApi } from "@/api/table-batch"
import { getPositionOptionApi } from "@/api/table-position"
import AuditReviewForm from "@/components/AuditReviewForm/AuditReviewForm.vue"
import { usePagination } from "@/hooks/usePagination"

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
  jobTitle: []
})
const getTableData = () => {
  loading.value = true
  getTableDataBySearchApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    batches: searchData.batches,
    jobTitles: searchData.jobTitle
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
const showinfoHandle = (row: GetTableThingData) => {
  code.value = row.code
  thingId.value = row.thingId
  drawerVisible.value = true
}
/** 表格引用 */
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
/** 选中行 */
const multipleSelection = ref<GetTableThingData[]>([])
const handleSelectionChange = (val: GetTableThingData[]) => {
  multipleSelection.value = val
}

const agree = (row: GetTableThingData) => {
  loading.value = true
  acceptThingApi({ thingId: row.thingId })
    .then(() => {
      ElMessage.success(row.username + "的" + row.jobTitle + "成功")
    })
    .catch()
    .finally(() => {
      getTableData()
      loading.value = false
      getTableData()
    })
}

const agree2 = (row: GetTableThingData) => {
  loading.value = true
  accept2ThingApi({ thingId: row.thingId })
    .then(() => {
      ElMessage.success(row.username + "的" + row.jobTitle + "成功")
    })
    .catch()
    .finally(() => {
      getTableData()
      loading.value = false
      getTableData()
    })
}

const agree3 = (row: GetTableThingData) => {
  loading.value = true
  accept3ThingApi({ thingId: row.thingId })
    .then(() => {
      ElMessage.success(row.username + "的" + row.jobTitle + "成功")
    })
    .catch()
    .finally(() => {
      getTableData()
      loading.value = false
      getTableData()
    })
}

const refuse = (row: GetTableThingData) => {
  loading.value = true
  refuseThingDataApi({ thingId: row.thingId })
    .then(() => {
      ElMessage.warning("拒绝" + row.username + "的" + row.jobTitle + "成功")
    })
    .catch()
    .finally(() => {
      getTableData()
      loading.value = false
      getTableData()
    })
}

const batchSort = (a: GetTableThingData, b: GetTableThingData) => {
  // 根据batchId属性进行比较并返回排序结果
  return a.batchId - b.batchId
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
          <el-table-column prop="jobTitle" sortable label="岗位名称" align="center" />
          <el-table-column prop="username" sortable label="用户姓名" align="center" />
          <el-table-column prop="school" sortable label="毕业院校" align="center" />
          <el-table-column prop="degree" sortable label="学位要求" align="center">
            <template #default="educationScope">
              {{ getDegreeLabel(educationScope.row) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="审核进度" align="center" :formatter="progressFormatter">
            <template #default="scope">
              <el-popover effect="light" trigger="hover" placement="top" width="auto">
                <template #default>
                  <div>审核流程:</div>
                  <div>用户投递>管理员初审>笔试>面试</div>
                </template>
                <template v-if="scope.row.status === -1" #reference>
                  <el-tag type="danger">已经拒绝</el-tag>
                </template>
                <template v-else-if="scope.row.status === 0" #reference>
                  <el-tag type="danger">初审未通过</el-tag>
                </template>
                <template v-else-if="scope.row.status === 1" #reference>
                  <el-tag type="warning">初审通过</el-tag>
                </template>
                <template v-else-if="scope.row.status === 2" #reference>
                  <el-tag type="success">已打印准考证</el-tag>
                </template>
                <template v-else-if="scope.row.status === 3" #reference>
                  <el-tag type="success">笔试通过</el-tag>
                </template>
                <template v-else-if="scope.row.status === 4" #reference>
                  <el-tag type="success">面试通过</el-tag>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="200px" align="left">
            <template #default="scope">
              <el-button type="info" bg size="small" @click="showinfoHandle(scope.row)">详细信息</el-button>
              <template v-if="scope.row.status === -1">
                <el-button type="primary" size="small" @click="agree(scope.row)">已拒绝</el-button>
              </template>
              <template v-else-if="scope.row.status === 0">
                <el-button type="primary" size="small" @click="agree(scope.row)">初审通过</el-button>
              </template>
              <template v-else-if="scope.row.status === 1">
                <el-tooltip class="box-item" effect="dark" content="请使用批量操作生成准考证" placement="top">
                  <el-button type="primary" size="small">打印准考证</el-button>
                </el-tooltip>
              </template>
              <template v-else-if="scope.row.status === 2">
                <el-button type="primary" size="small" @click="agree2(scope.row)">笔试通过</el-button>
              </template>
              <template v-else-if="scope.row.status === 3">
                <el-button type="primary" size="small" @click="agree3(scope.row)">面试通过</el-button>
              </template>
              <template v-else-if="scope.row.status === 4">
                <el-button type="primary" size="small">准备就职</el-button>
              </template>
              <el-button v-if="scope.row.status === 0" type="danger" size="small" @click="refuse(scope.row)"
                >拒绝</el-button
              >
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
    <el-drawer>
      <AuditReviewForm :code="code" :thingId="thingId" />
    </el-drawer>
    <!-- 详细信息
    <el-dialog v-model="dialogVisible" title="简历详情" width="80%">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-descriptions title="投递人" :column="3" border size="small">
            <el-descriptions-item label="用户名" label-align="center" align="left">
              {{ thingInfo?.name }}</el-descriptions-item
            >
            <el-descriptions-item label="年龄" label-align="center" align="left">
              {{ thingInfo?.age }}</el-descriptions-item
            >
            <el-descriptions-item label="性别" label-align="center" align="left">
              {{ thingInfo?.sex }}
            </el-descriptions-item>
            <el-descriptions-item label="学历" label-align="center" align="left">
              {{ getEducationLabel2(thingInfo?.userEducation) }}
            </el-descriptions-item>
            <el-descriptions-item label="政治面貌" label-align="center" align="left"
              >{{ thingInfo?.zzmm }}
            </el-descriptions-item>
            <el-descriptions-item label="籍贯" label-align="center" align="left"
              >{{ thingInfo?.native_place }}
            </el-descriptions-item>
            <el-descriptions-item label="出生日期" label-align="center" align="left"
              >{{ thingInfo?.birthday }}
            </el-descriptions-item>
            <el-descriptions-item label="民族" label-align="center" align="left"
              >{{ thingInfo?.nation }}
            </el-descriptions-item>
            <el-descriptions-item label="毕业院校" label-align="center" align="left"
              >{{ thingInfo?.school }}
            </el-descriptions-item>
            <el-descriptions-item label="毕业时间" label-align="center" align="left"
              >{{ thingInfo?.graduation_time }}
            </el-descriptions-item>
            <el-descriptions-item label="专业" label-align="center" align="left"
              >{{ thingInfo?.specialty }}
            </el-descriptions-item>
            <el-descriptions-item label="身份证号码" label-align="center" align="left"
              >{{ thingInfo?.idnum }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号" label-align="center" align="left"
              >{{ thingInfo?.tel }}
            </el-descriptions-item>
            <el-descriptions-item label="现居地址" :span="2" label-align="center" align="left"
              >{{ thingInfo?.address }}
            </el-descriptions-item>
          </el-descriptions>
          <el-text tag="p" size="large" style="margin-top: 20px"><strong>用户资历文件</strong></el-text>
          <template v-for="url in imgList" :key="url">
            <el-image
              style="width: 100px; height: 100px"
              :src="url"
              :zoom-rate="1.2"
              :max-scale="4"
              :min-scale="0.4"
              :preview-src-list="imgList"
              :initial-index="0"
              fit="cover"
            />
          </template>
          <template v-for="url in fileList" :key="url">
            <el-text tag="p" style="margin-bottom: 20px">
              {{ url.split("/").slice(-1) }}
              <el-button @click="showUserFile(url)" :loading="showUserFileLoading">查看</el-button>
            </el-text>
          </template>
          <div id="previewUserFile" />
        </el-col>
        <el-col :span="8">
          <el-descriptions title="意愿岗位" :column="1" border size="small">
            <el-descriptions-item
              label="Username"
              label-align="right"
              align="center"
              label-class-name="my-label"
              class-name="my-content"
              >{{ thingInfo.jobTitle }}</el-descriptions-item
            >
            <el-descriptions-item label="Telephone" label-align="right" align="center"
              >18100000000</el-descriptions-item
            >
            <el-descriptions-item label="Place" label-align="right" align="center">Suzhou</el-descriptions-item>
            <el-descriptions-item label="Remarks" label-align="right" align="center">
              <el-tag size="small">School</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Address" label-align="right" align="center"
              >No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province</el-descriptions-item
            >
          </el-descriptions>
        </el-col>
      </el-row>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="previewDialog" width="80%" title="打印预览">
      <el-card v-loading="previewLoading">
        <el-text tag="p">若要修改准考证模板文件,请前往服务端D:/*/*/**</el-text>
        <el-text>生成 {{ multipleSelection.length }} 份准考证 </el-text>
        <el-table :data="multipleSelection">
          <el-table-column prop="username" label="用户姓名" align="center" />

          <el-table-column prop="jobTitle" label="用户电话" align="center" />
          <el-table-column label="岗位代码">
            <template #default="{ $index }">
              {{ previewCode[$index] }}
            </template>
          </el-table-column>
          <el-table-column label="准考证号">
            <template #default="{ $index }">
              {{ previewCode2[$index] }}
            </template>
          </el-table-column>
        </el-table>
        <el-text>准考证模板预览: </el-text>
        <el-divider />
        <div id="container_docx" />
        <el-divider />
      </el-card>

      <template #footer>
        <el-button type="warning" @click="previewDialog = false">取消</el-button>
        <el-button type="primary" @click="printCertificates()">确定</el-button>
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
