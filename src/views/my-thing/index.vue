<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { GetTableRequestData } from "@/api/user-thing/types/user-thing"
import { getUserThingDataApi } from "@/api/user-thing"

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
      console.log("res.data.list" + res.data)
    })
    .catch((error) => {
      console.log("前端异常")
      console.error(error)
      positions.value = []
    })
    .finally(() => {
      loading.value = false
    })
  console.log(positions.value)
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
            :title="position.jobTitle"
          >
            <div>
              <el-text>进度信息</el-text>
            </div>
            <div>
              <el-steps :space="200" :active="position.status + 1" finish-status="success">
                <el-step title="用户投递" />
                <el-step title="人事部初审" />
                <el-step title="下载准考证" />
                <el-step title="面试通过" />
                <el-step title="任职中" />
              </el-steps>
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
