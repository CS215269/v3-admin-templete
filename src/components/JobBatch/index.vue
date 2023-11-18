<script lang="ts" setup>
import { ref } from "vue"
import { getPositionDataApi } from "@/api/user-batch"
import { GetPositionData, GetBatchData } from "@/api/user-batch/types/user-batch"
import JobBatchItem from "@/components/JobBatch/JobBatchItem.vue"

const props = defineProps<{
  batch: GetBatchData
}>()

defineOptions({
  name: "Batches"
})

const positions = ref<GetPositionData[]>([])

const isExpanded = ref(false)

const fetchData = async (id: number) => {
  try {
    const response = await getPositionDataApi(id)
    positions.value = response.data.list
  } catch (error) {
    console.error(error)
  }
}

const handleChange = (status: boolean) => {
  isExpanded.value = status
  console.log("折叠面板打开的:" + isExpanded.value)
  if (status) {
    fetchData(props.batch.id)
  }
}
</script>

<template>
  <el-collapse-item :title="props.batch.name" @change="handleChange">
    <!-- Placeholder content for each batch -->
    <template v-if="isExpanded">
      <JobBatchItem v-for="position in positions" :key="position.id" :position="position" />
    </template>
  </el-collapse-item>
</template>
