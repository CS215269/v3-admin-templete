<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { GetTableRequestData } from "@/api/user-thing/types/user-thing"
import { exportFormApi, getUserThingDataApi, userAbandonApi } from "@/api/user-thing"
import { ElMessage } from "element-plus"

defineOptions({
  name: "UserThing"
})

const loading = ref<boolean>(false)
/** 用于控制哪些 collapse 是展开的 */
const activeNames = ref<string[]>([])
/** 用于存储用户的投递的数据 */
const positions = ref<GetTableRequestData[]>([])

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

const exportForm = (id: number) => {
  loading.value = true
  exportFormApi({ id })
    .then((res) => {
      const blob = new Blob([res])
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "安徽工商职业学院公开招聘人员报名资格审查表.docx"
      a.click()
      ElMessage.success("下载准考证成功")
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
    <el-card loading="loading" shadow="never">
      <div class="toolbar-wrapper" style="margin-bottom: 20px">
        <el-text class="mx-1" size="large">我的投递信息</el-text>
      </div>
      <el-card :loading="loading" shadow="never">
        <div class="table-wrapper">
          <el-collapse v-if="positions.length > 0" v-model="activeNames" style="margin: 0">
            <el-collapse-item v-for="(position, index) in positions" :key="position.recruitId" :name="index.toString()">
              <template #title>
                <el-text tag="b"> {{ position.type }} </el-text>
                &nbsp;
                <el-text> {{ position.jobTitle }} </el-text>
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
                <el-button @click="abandon(position.thingId)">放弃</el-button>
                <el-button v-if="position.status == 2" @click="exportForm(position.thingId)"
                  >导出报名资格审查表</el-button
                >
              </div>
            </el-collapse-item>
          </el-collapse>

          <!-- <el-collapse v-model="activeCollapse">
          <Batches v-for="batch in batches" :key="batch.id" :batch="batch" />
        </el-collapse> -->
          <div v-else><el-text tag="p">这里什么也没有~</el-text></div>
        </div>
      </el-card>
      <div class="pager-wrapper">
        <!-- Pagination code here -->
      </div>
    </el-card>
  </div>
</template>
