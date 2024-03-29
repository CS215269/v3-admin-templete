<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, getTableDataApi } from "@/api/table-user"
import { type GetTableUserData } from "@/api/table-user/types/table-user"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, ElTooltipProps } from "element-plus"
import { Search, Refresh, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

defineOptions({
  // 命名当前组件
  name: "TableUser"
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
// 学生添加暂停维护
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  name: "",
  sex: "",
  age: "",
  education: 0,
  degree: 0,
  zzmm: "",
  school: "",
  native_place: ""
})
const formRules: FormRules = reactive({})
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
          name: formData.name,
          sex: formData.sex,
          age: formData.age,
          education: formData.education,
          degree: formData.degree,
          zzmm: formData.zzmm,
          school: formData.school,
          native_place: formData.native_place
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
  formData.sex = ""
  formData.age = ""
  formData.education = 0
  formData.degree = 0
  formData.zzmm = ""
  formData.school = ""
  formData.native_place = ""
}
//#endregion

//#region 删
const handleDelete = (row: GetTableUserData) => {
  ElMessageBox.confirm(`正在删除用户：${row.name}，确认删除？`, "提示", {
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
const handleUpdate = (row: GetTableUserData) => {
  currentUpdateId.value = row.id
  formData.name = row.name
  formData.sex = row.sex
  formData.education = row.education
  formData.degree = row.degree
  formData.age = row.age
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<GetTableUserData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
  phone: "",
  education: "",
  idnum: ""
})
const getTableData = () => {
  loading.value = true
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    name: searchData.name || undefined,
    education: searchData.education || undefined,
    idnum: searchData.idnum || undefined,
    phone: searchData.phone || undefined
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

const tableTooltipOption: Partial<ElTooltipProps> = {
  placement: "left-start",
  effect: "light"
}

const showUserInfo = (id: number) => {
  console.log("用户信息" + id)
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="idnum" label="身份证号码">
          <el-input v-model="searchData.idnum" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="education" label="学历">
          <el-select v-model="searchData.education" placeholder="请输入">
            <el-option value="" label="不限" />
            <el-option value="1" label="高职" />
            <el-option value="2" label="大专" />
            <el-option value="3" label="本科" />
            <el-option value="4" label="硕士" />
            <el-option value="5" label="博士" />
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
        <el-table :data="tableData" :tooltip-options="tableTooltipOption">
          <!-- id: number
          name: string
          idnum: number
          tel: number
          sex: string
          age: string
          education: number
          zzmm: string
          school: string
          nation: string
          birthday: string
          native_place: string
          address: string
          graduation_time: string
          specialty: string -->
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="sex" label="性别" align="center" />
          <el-table-column prop="idnum" label="身份证" align="center" />
          <el-table-column prop="education" label="学历" align="center">
            <template #default="scope">
              {{ getEducationLabel(scope.row.education) }}
            </template>
          </el-table-column>
          <el-table-column prop="degree" label="学位" align="center">
            <template #default="scope">
              {{ getDegreeLabel(scope.row.degree) }}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" align="center" show-overflow-tooltip />
          <el-table-column prop="school" label="毕业院校" align="center" />
          <el-table-column prop="graduation_time" label="毕业时间" align="center" />
          <el-table-column fixed="right" label="操作" width="250" align="center">
            <template #default="scope">
              <el-button type="info" text bg size="small" @click="showUserInfo(scope.row)">详细</el-button>
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
      :title="currentUpdateId === undefined ? '新增用户信息' : '修改用户信息'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <p>用户数据建议由用户自行修改</p>
        <el-form-item prop="name" label="用户姓名">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="sex" label="用户性别">
          <!--  v-if="currentUpdateId === undefined" 让组件在修改对话框不可见 -->
          <el-select v-model="formData.sex" placeholder="请输入">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item prop="age" label="年龄">
          <el-date-picker v-model="formData.age" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="zzmm" label="政治面貌">
          <el-input v-model="formData.zzmm" placeholder="请输入" />
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
