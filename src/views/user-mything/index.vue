<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { GetTableRequestData } from "@/api/user-thing/types/user-thing"
import { exportBlankFormApi, exportFormApi, getUserThingDataApi, userAbandonApi } from "@/api/user-thing"
import { ElMessage } from "element-plus"
import UserReviewForm from "@/components/UserReviewForm/UserReviewForm.vue"
import UserReview from "@/components/UserReview/UserReview.vue"

defineOptions({
  name: "UserThing"
})

const loading = ref<boolean>(false)
/** 用于存储用户的投递的数据 */
const positions = ref<GetTableRequestData[]>([])
/** 用于打开指定的对话框 */
const showDialog = ref<boolean[]>([])
/** 用于打开抽屉 */
const drawerOpen = ref<boolean>()
/** 抽屉中的岗位id */
const activeThingId = ref<number>(0)
/** 抽屉中的岗位代码 */
const activeCode = ref<string>("")

const getTableData = () => {
  loading.value = true
  getUserThingDataApi()
    .then((res) => {
      positions.value = res.data
    })
    .catch((error) => {
      console.log("获取用户的投递异常,error= " + error)
      positions.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

const abandon = (id: number) => {
  loading.value = true
  userAbandonApi({ id })
    .then((res) => {
      if (res.code == 0) ElMessage.success(res.message)
    })
    .catch((e) => {
      ElMessage.error("操作失败")
      console.log(e)
    })
    .finally(() => {
      loading.value = false
      getTableData()
    })
}

const exportForm = (id: number | undefined) => {
  loading.value = true
  if (!id) {
    exportBlankFormApi()
      .then((res) => {
        const blob = new Blob([res])
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = "安徽工商职业学院公开招聘人员空白报名资格审查表.docx"
        a.click()
        ElMessage.success("下载空白资格审查表成功")
      })
      .catch((e) => {
        ElMessage.error("操作失败")
        console.log(e)
      })
      .finally(() => {
        loading.value = false
        getTableData()
      })
  } else {
    exportFormApi({ id })
      .then((res) => {
        const blob = new Blob([res])
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = "安徽工商职业学院公开招聘人员报名资格审查表.docx"
        a.click()
        ElMessage.success("下载资格审查表成功")
      })
      .catch((e) => {
        ElMessage.error("操作失败")
        console.log(e)
      })
      .finally(() => {
        loading.value = false
        getTableData()
      })
  }
}

const openHandle = (thingId: number, code: string) => {
  drawerOpen.value = true
  activeCode.value = code
  activeThingId.value = thingId
}

const closeDrawer = () => {
  drawerOpen.value = false
  getTableData()
}
const step = (status: number) => {
  switch (Math.abs(status)) {
    case 0:
      return 1
    case 1:
    case 2:
      return 2

    default:
      break
  }
}
onMounted(getTableData)
</script>

<template>
  <div class="app-container">
    <el-card :loading="loading" shadow="never">
      <div class="toolbar-wrapper" style="margin-bottom: 20px">
        <el-text class="mx-1" size="large">我的投递信息</el-text>
      </div>
      <div class="table-wrapper">
        <div v-if="positions.length > 0" style="margin: 0">
          <el-card v-for="(position, index) in positions" :key="index" :name="index.toString()" shadow="never">
            <template #header>
              <el-text tag="b"> {{ position.code }} </el-text>
              &nbsp;
              <el-text tag="b"> {{ position.type }} </el-text>
              &nbsp;
              <el-text> {{ position.jobTitle }} </el-text>
              &nbsp;
              <el-text v-if="position.status === -2" type="danger"> 已拒绝 </el-text>
            </template>
            <div>
              <el-text>进度信息</el-text>
            </div>
            <div>
              <el-steps class="mb-4" style="max-width: 600px" :space="200" :active="step(position.status)" simple>
                <el-step title="用户投递" />
                <el-step title="资格审查" />
                <el-step title="下载审查表" />
              </el-steps>
              <el-text v-if="position.status == 2" tag="b">审查通过</el-text>
              <el-text v-if="position.status == -2" style="color: red">审查不通过</el-text>
              <br />
              <el-text v-if="position.status == -2">原因: {{ position.qualificationResult }}</el-text>
              <br />
              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                title="您确定要放弃投递吗?这会删除您的报考信息"
                @confirm="abandon(position.thingId)"
              >
                <template #reference>
                  <el-button>放弃</el-button>
                </template>
              </el-popconfirm>
              <el-button v-if="position.status != -2" @click="showDialog[index] = true">查看报名信息</el-button>
              <el-button :loading="loading" v-if="position.status == 2" @click="exportForm(position.thingId)"
                >导出报名资格审查表</el-button
              >
              <el-button :loading="loading" v-if="position.status == 2" @click="exportForm(undefined)"
                >导出空白资格审查表</el-button
              >
              <el-button
                :loading="loading"
                v-if="position.status == -2"
                @click="openHandle(position.thingId, position.code)"
                >修改信息后重新提交</el-button
              >
            </div>
            <el-dialog v-model="showDialog[index]" width="70%">
              <UserReview :code="position.code" :thingId="position.thingId" />
            </el-dialog>
            <el-drawer v-model="drawerOpen" direction="rtl" size="75%" :destroy-on-close="true">
              <template #header>
                <h4>重新投递: 岗位代码 {{ activeCode }}</h4>
              </template>
              <template #default>
                <UserReviewForm :thingId="activeThingId" :code="activeCode" @close-drawer="closeDrawer" />
              </template>
            </el-drawer>
          </el-card>
        </div>

        <div v-else><el-text tag="p">这里什么也没有~</el-text></div>
      </div>
    </el-card>
    <div class="pager-wrapper">
      <!-- Pagination code here -->
    </div>
  </div>
</template>
