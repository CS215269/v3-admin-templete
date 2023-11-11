<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { getBatchDataApi } from "@/api/user-batch"
import { GetBatchData } from "@/api/user-batch/types/user-batch"

defineOptions({
  name: "UserThing"
})

const loading = ref<boolean>(false)

// Define the batches data
const batches = ref<GetBatchData[]>([])
// const searchFormRef = ref<FormInstance | null>(null)
// const searchData = reactive({
//   name: "",
//   degree: 0
// })
const getBatchData = () => {
  loading.value = true
  getBatchDataApi()
    .then((res) => {
      batches.value = res.data.list
    })

    .catch(() => {
      batches.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(getBatchData)

console.log("\n用户看自己的批次\n" + batches.value)
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <!-- Search form code here -->
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <!-- Toolbar buttons code here -->
      </div>
      <div class="table-wrapper">
        <el-text>我的求职</el-text>
      </div>
      <div class="pager-wrapper">
        <!-- Pagination code here -->
      </div>
    </el-card>
  </div>
</template>
