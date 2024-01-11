<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { GetTableRequestData } from "@/api/user-thing/types/user-thing"
import { getUserThingDataApi, userDownload } from "@/api/user-thing"
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
const download = (batchId: number) => {
  loading.value = true
  userDownload(batchId)
    .then((res) => {
      console.log(res)
      const blob = new Blob([res])
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "准考证.docx"
      a.click()
      ElMessage.success("下载准考证成功")
    })
    .catch((error) => {
      console.log("下载准考证失败" + error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(getTableData)
</script>

<template>
  <div class="app-container">
    <el-card loading="loading" shadow="never" class="search-wrapper">
      <!-- Search form code here -->
    </el-card>
    <el-card loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <!-- Toolbar buttons code here -->
      </div>
      <div class="table-wrapper">
        <el-collapse v-model="activeNames">
          <el-collapse-item
            v-for="(position, index) in positions"
            :key="position.recruitId"
            :name="index.toString()"
            :title="position.batchname + ' ' + position.jobTitle"
          >
            <div>
              <el-text>进度信息</el-text>
            </div>
            <div>
              <el-steps :space="200" :active="position.status + 1" finish-status="success">
                <el-step title="用户投递" />
                <el-step title="人事部初审" />
                <el-step title="下载准考证" />
                <el-step title="笔试通过" />
                <el-step title="面试通过" />
              </el-steps>
              <el-button v-if="position.status == 2" @click="download(position.batchId)">下载准考证</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
        <!-- <el-collapse v-model="activeCollapse">
          <Batches v-for="batch in batches" :key="batch.id" :batch="batch" />
        </el-collapse> -->
      </div>
      <div class="pager-wrapper">
        <!-- Pagination code here -->
      </div>
    </el-card>
  </div>
</template>
