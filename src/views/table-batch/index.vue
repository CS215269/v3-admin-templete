<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, getTableDataApi } from "@/api/table-batch"
import { type GetTableBatchData } from "@/api/table-batch/types/table-batch"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import moment from "moment"

defineOptions({
  // 命名当前组件
  name: "TableBatch"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  name: "x",
  open: 0,
  startime: "",
  deadline: "",
  disableAutoUpdate: 0
})
const disableAutoUpdate = ref<boolean>(true)
const validateDateRange = (rule: any, value: string, callback: Function) => {
  const today = new Date().toISOString().split("T")[0] // get today's date in yyyy-mm-dd format
  console.log(today)
  console.log(value)
  if (value == null || value == "") {
    callback(new Error("请输入开始时间"))
  } else {
    callback()
  }
}
const validateDateRange2 = (rule: any, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error("请输入截止时间"))
  } else if (value <= formData.startime) {
    callback(new Error("截止时间必须比开始时间晚"))
  } else {
    callback()
  }
}

const formRules = reactive<FormRules<typeof formData>>({
  name: [{ required: true, trigger: "blur", message: "请输入批次名" }],
  open: [{ required: true, trigger: "blur", message: "请输入状态" }],
  startime: [{ validator: validateDateRange, trigger: "blur" }],
  deadline: [{ validator: validateDateRange2, trigger: "blur" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        formData.startime = moment(formData.startime).format("YYYY-MM-DD")
        formData.deadline = moment(formData.deadline).format("YYYY-MM-DD")
        formData.open = 0
        formData.disableAutoUpdate = disableAutoUpdate.value ? 0 : 1
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
          name: formData.name,
          open: formData.open,
          startime: moment(formData.startime).format("YYYY-MM-DD"),
          deadline: moment(formData.deadline).format("YYYY-MM-DD"),
          disableAutoUpdate: disableAutoUpdate.value ? 0 : 1
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
  formData.name = ""
  formData.open = 0
  formData.startime = ""
  formData.deadline = ""
}
//#endregion

//#region 删
const handleDelete = (row: GetTableBatchData) => {
  ElMessageBox.confirm(`正在删除批次：${row.name}，确认删除？`, "提示", {
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
const handleUpdate = (row: GetTableBatchData) => {
  currentUpdateId.value = row.id
  formData.name = row.name
  formData.open = row.open
  formData.startime = moment(row.startime).format("YYYY-MM-DD")
  formData.deadline = moment(row.deadline).format("YYYY-MM-DD")
  // disableAutoUpdate.value = row.disableAutoUpdate == 1
  disableAutoUpdate.value = row.disableAutoUpdate == 1
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<GetTableBatchData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
  open: 0
})
const getTableData = () => {
  loading.value = true
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    key: searchData.name || undefined,
    state: searchData.open || undefined
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
        <el-form-item prop="username" label="批次名称">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="open" label="状态">
          <el-select v-model="searchData.open" placeholder="请输入">
            <el-option label="全部" :value="0" />
            <el-option label="已启用" :value="2" />
            <el-option label="已禁用" :value="1" />
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增批次</el-button>
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
          <el-table-column prop="name" label="批次名称" align="center" />
          <el-table-column prop="open" label="批次状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.open" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="warning" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="positionNum" label="岗位数量" align="center" />
          <el-table-column prop="startime" label="开始时间" align="center" />
          <el-table-column prop="deadline" label="截止时间" align="center" />
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
      :title="currentUpdateId === undefined ? '新增批次' : '修改批次'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-text v-if="currentUpdateId != undefined" tag="p" style="margin-bottom: 20px"
          >手动修改批次状态时系统会自动更新其开始时间与结束时间</el-text
        >
        <el-text tag="p">批次的开始时间与结束时间会使其状态自动更新</el-text>
        <el-divider />
        <el-form-item prop="name" label="批次名称">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="currentUpdateId != undefined" prop="open" label="批次状态" aria-placeholder="请选择">
          <!--  让组件在修改对话框不可见 -->
          <el-select v-model="formData.open" placeholder="请输入">
            <el-option label="已启用" value="1" />
            <el-option label="已禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="startime" label="开始时间">
          <el-date-picker
            v-model="formData.startime"
            type="date"
            placeholder="选择日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item prop="deadline" label="结束时间">
          <el-date-picker
            v-model="formData.deadline"
            type="date"
            placeholder="选择日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item prop="disableAutoUpdate" label="自动开放/关闭">
          <el-switch
            v-model="disableAutoUpdate"
            class="mt-2"
            style="margin-left: 24px"
            active-text="系统自动根据时间段自动设置'已启用'/'已禁用'"
          />
          <!--
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"<el-text tag="p" style="font-size: 0.4em"></el-text> -->
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
