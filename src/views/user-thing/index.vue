<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { getBatchDataApi, getPositionDataApi } from "@/api/user-batch"
import { GetBatchData, GetPositionData } from "@/api/user-batch/types/user-batch"
import JobBatchItem from "@/components/JobBatch/JobBatchItem.vue"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { setRealNameInfoApi } from "@/api/user-info"
defineOptions({
  name: "UserThing"
})

const loading = ref<boolean>(false)
/** 假设你已经有了一个批次列表 */
const batches = ref<GetBatchData[]>([])
/** 用于控制哪些 collapse 是展开的 */
const activeNames = ref<string[]>([])
/** 用于控制哪些 collapse 已经加载过数据 */
const isExpanded = reactive<boolean[]>([])
/** 用于存储每个 collapse 的数据 */
const positions = reactive<GetPositionData[][]>([])
/** 用户是否实名认证过 */
const infoIntegrity = ref<boolean>(false)
/** 实名认证表单展示 */
const showRealNameMessageBox = ref<boolean>(false)
/** 实名认证正在执行 */
const realNameLoading = ref<boolean>(false)
/** 实名认证表单引用 */
const formRef = ref<FormInstance | null>(null)
/** 实名认证表单值绑定 */
const formData = reactive({
  idnum: "",
  name: ""
})
/** 实名认证表单效验 */
const formRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入岗位名称" }],
  idnum: [
    { required: true, trigger: "blur", message: "请输入账号" },
    {
      pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
      trigger: "blur",
      message: "请输入有效的身份证号码"
    }
    // dsa validator: isChineseIdCard,
  ]
})

const sendRealName = () => {
  realNameLoading.value = true
  setRealNameInfoApi(formData)
    .then(() => {
      ElMessage.success("实名成功")
      infoIntegrity.value = true
    })
    .catch(() => {})
    .finally(() => {
      realNameLoading.value = false
      showRealNameMessageBox.value = false
    })
}

const fetchData = async (index: number) => {
  try {
    const response = await getPositionDataApi(batches.value[index].id)
    positions[index] = response.data.list
  } catch (error) {
    ElMessage.error("错误")
    console.error(error)
  }
}

/** 用户点击批次按钮后的行为 */
const handleChange = (index: number) => {
  if (!infoIntegrity.value) {
    showRealNameMessageBox.value = true
  } else if (activeNames.value.includes(index.toString()) && !isExpanded[index]) {
    fetchData(index)
    isExpanded[index] = true
  }
}

// const toRealNameMessageBox = () => {
//   ElMessageBox({
//     title: "提示",
//     message: "开始投递前,请先进行实名认证",
//     showCancelButton: true,
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     beforeClose: (action, instance, done) => {
//       if (action === "confirm") {
//         instance.confirmButtonLoading = true
//         instance.confirmButtonText = "Loading..."
//         setTimeout(() => {
//           done()
//           setTimeout(() => {
//             instance.confirmButtonLoading = false
//           }, 300)
//         }, 3000)
//       } else {
//         done()
//       }
//     }
//   })
//     .then((action) => {
//       ElMessage({
//         type: "info",
//         message: `action: ${action}`
//       })
//     })
//     .catch(() => {
//       ElMessage.error("系统异常,跳转到实名认证失败")
//     })
// }

const getBatchData = () => {
  loading.value = true
  getBatchDataApi()
    .then((res) => {
      batches.value = res.data.list
      infoIntegrity.value = res.data.infoIntegrity == 0 ? false : true
    })
    .catch(() => {
      batches.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(getBatchData)
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <!-- Toolbar buttons code here -->
      </div>
      <div class="table-wrapper">
        <el-collapse v-model="activeNames">
          <el-collapse-item
            v-for="(batch, index) in batches"
            :key="batch.id"
            :name="index.toString()"
            :title="batch.name"
            @click="handleChange(index)"
          >
            <template v-if="isExpanded[index]">
              <JobBatchItem
                v-for="position in positions[index]"
                :key="position.id"
                :position="position"
                :batchid="batch.id"
              />
            </template>
          </el-collapse-item>
        </el-collapse>
        <!-- <el-collapse v-model="activeCollapse">
          <Batches v-for="batch in batches" :key="batch.id" :batch="batch" />
        </el-collapse> -->
        <el-dialog v-model="showRealNameMessageBox" title="开始投递前,请先进行实名认证" width="30%">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
            <el-form-item prop="name" label="姓名">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable />
            </el-form-item>
            <el-form-item prop="idnum" label="身份证号码">
              <el-input v-model="formData.idnum" placeholder="请输入身份证号" clearable />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showRealNameMessageBox = false">取消</el-button>
              <el-button type="primary" @click="sendRealName()"> 确定 </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <div class="pager-wrapper">
        <!-- Pagination code here -->
      </div>
    </el-card>
  </div>
</template>
