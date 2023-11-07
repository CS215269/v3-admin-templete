<script lang="ts" setup>
import { ref, onMounted } from "vue"
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

const fetchData = async (id: number) => {
  try {
    const response = await getPositionDataApi(id)
    positions.value = response.data.list
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => fetchData(props.batch.id))
// onMounted(async () => {
//   try {
//     const response = await getPositionDataApi(props.batch.id)
//     positions.value = response.data.list
//   } catch (error) {
//     console.error(error)
//   }
// })
</script>

<template>
  <!-- batch.name应该在父组件中获取并传到该组件,待实现 -->
  <el-collapse-item :title="props.batch.name">
    <!-- Placeholder content for each batch -->
    <JobBatchItem v-for="position in positions" :key="position.id" :position="position" />
  </el-collapse-item>
</template>
