<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { getBatchDataApi, getPositionDataApi } from "@/api/user-batch"
import { GetBatchData, GetPositionData } from "@/api/user-batch/types/user-batch"
import JobBatchItem from "@/components/JobBatch/JobBatchItem.vue"

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

const fetchData = async (index: number) => {
  try {
    const response = await getPositionDataApi(batches.value[index].id)
    positions[index] = response.data.list
  } catch (error) {
    console.error(error)
  }
}

const handleChange = (index: number) => {
  console.log("变化" + activeNames.value)
  if (activeNames.value.includes(index.toString()) && !isExpanded[index]) {
    fetchData(index)
    isExpanded[index] = true
  }
}

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
</script>

<template>
  <div class="app-container">
    <el-card loading="loading" shadow="never">
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
              <JobBatchItem v-for="position in positions[index]" :key="position.id" :position="position" />
            </template>
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
