<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import { acceptThingApi, getTableDataBySearchApi, getThingInfoApi } from "@/api/table-thing"
import { ThingInfoData, type GetTableThingData } from "@/api/table-thing/types/table-thing"
import { ElMessage, type FormInstance } from "element-plus"
// import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Download, RefreshRight, Dish } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { getBatchOptionsApi } from "@/api/table-batch"
import { getPositionOptionApi } from "@/api/table-position"
import { getDepartmentOptionApi } from "@/api/table-department"

defineOptions({
  // 命名当前组件
  name: "TableThing"
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

// 计算属性
const getDegreeLabel2 = (degree: number) => {
  switch (degree) {
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
const progressFormatter = (row: { status: number }) => {
  switch (row.status) {
    case 0:
      return "未处理"
    case 1:
      return "已同意"
    case 2:
      return "已打印"
    default:
      return "异常"
  }
}

//#region 查
const tableData = ref<GetTableThingData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  batches: [],
  jobTitle: [],
  department: []
})
const getTableData = () => {
  loading.value = true
  getTableDataBySearchApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    batches: searchData.batches,
    jobTitles: searchData.jobTitle,
    departments: searchData.department
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

const departmentList = ref<{ id: number; name: string }[]>([])
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
  getDepartmentOptionApi()
    .then((res) => {
      departmentList.value = res.data.list
    })
    .catch(() => {
      positionList.value = []
    })
    .finally(() => {
      loading.value = false
    })
})

/** 详细信息弹框开关 */
const dialogVisible = ref<boolean>(false)
/** 详细信息 */
const imgList = ref<string[]>([""])
/** 详细信息 */
const fileList = ref<string[]>([""])
/** 详细信息 */
const thingInfo = ref<ThingInfoData>({
  /** 用户id */
  userId: 0,
  /** 姓名 */
  name: "",
  /** 身份证号码 */
  idnum: 0,
  /** 电话号码 */
  tel: 0,
  /** 性别 */
  sex: "",
  /** 年龄 */
  age: "",
  /** 学历 */
  userDegree: 0,
  /** 政治面貌 */
  zzmm: "",
  /** 毕业学校 */
  school: "",
  /** 民族 */
  nation: "",
  /** 出生日期 */
  birthday: "",
  /** 籍贯 */
  native_place: "",
  /** 现居地址 */
  address: "",
  /** 毕业时间 */
  graduation_time: "",
  /** 专业 */
  specialty: "",
  /** 资历图片 */
  imgs: "",

  /** 岗位id */
  pid: 0,
  /** 岗位名称 */
  jobTitle: "",
  /** 部门 */
  department: "",
  degree: 0,
  info: "",
  departmentId: 0
})
const showinfo = (row: GetTableThingData) => {
  loading.value = true
  console.log(row)
  getThingInfoApi(row.thingId)
    .then((res) => {
      dialogVisible.value = true
      console.log(res)
      thingInfo.value = res.data.data
      imgList.value = res.data.img.reverse()
      fileList.value = res.data.file
    })
    .catch(() => {
      ElMessage.error("获取投递详情失败,请重试")
    })
    .finally(() => {
      loading.value = false
      console.log("小图1地址" + imgList.value.at(0))
    })
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
    })
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
        <el-form-item prop="department" label="部门" size="large">
          <el-select
            v-model="searchData.department"
            filterable
            collapse-tags
            collapse-tags-tooltip
            multiple
            placeholder="请输入"
          >
            <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id" />
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
          <el-table-column prop="batchname" label="批次" align="center" />
          <el-table-column prop="jobTitle" label="岗位名称" align="center" />
          <el-table-column prop="department" label="所属部门" align="center" />
          <el-table-column prop="username" label="用户姓名" align="center" />
          <el-table-column prop="school" label="毕业院校" align="center" />
          <el-table-column prop="degree" label="学历" align="center">
            <template #default="degreeScope">
              {{ getDegreeLabel(degreeScope.row) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="审核进度" align="center" :formatter="progressFormatter">
            <template #default="scope">
              <el-popover effect="light" trigger="hover" placement="top" width="auto">
                <template #default>
                  <div>审核流程:</div>
                  <div>用户投递>管理员初审>笔试>面试</div>
                </template>
                <template v-if="scope.row.status === 0" #reference>
                  <el-tag type="warning">未处理</el-tag>
                </template>
                <template v-else-if="scope.row.status === 1" #reference>
                  <el-tag>已同意</el-tag>
                </template>
                <template v-else-if="scope.row.status === 2" #reference>
                  <el-tag type="success">已打印</el-tag>
                </template>
              </el-popover>
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
    <!-- 详细信息 -->
    <el-dialog v-model="dialogVisible" title="简历详情" width="80%">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-descriptions title="投递人" :column="3" border size="small">
            <el-descriptions-item label="Username" label-align="right" align="center" label-class-name="my-label">
              {{ thingInfo.name }}
            </el-descriptions-item>

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
              {{ getDegreeLabel2(thingInfo?.degree) }}
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
          <template v-for="url in imgList" :key="url">
            <el-image
              :src="url"
              :zoom-rate="1.2"
              :max-scale="4"
              :min-scale="0.4"
              :preview-src-list="imgList"
              :initial-index="0"
              fit="cover"
              style="width: 100px; height: 100px"
            />
            <img :src="url" />
          </template>
          <!-- <el-image
            style="width: 100px; height: 100px"
            :src="imgList.at(0)"
            :zoom-rate="1.2"
            :max-scale="4"
            :min-scale="0.4"
            :preview-src-list="imgList"
            :initial-index="0"
            fit="cover"
          /> -->
        </el-col>
        <el-col :span="8">
          <el-descriptions title="意愿岗位" :column="2" border size="small">
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
        <el-button type="danger" @click="dialogVisible = false">拒绝</el-button>
        <el-button type="primary" @click="dialogVisible = false">同意</el-button>
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
