<template>
  <div>
    <div v-for="batch in batches" :key="batch.batchid">
      <button @click="fetchJobs(batch.batchid)">{{ batch.batchname }}</button>
      <div v-if="openBatchId === batch.batchid">
        <!-- 抽屉内容 -->
        <div v-for="job in batch.jobs" :key="job.id">
          <!-- 展示岗位信息 -->
          <div>{{ job.jobTitle }}</div>
          <div>{{ job.department }}</div>
          <!-- 其他岗位信息... -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      batches: [], // 批次数据
      openBatchId: null // 当前展开的批次ID
    }
  },
  methods: {
    fetchJobs(batchId) {
      // 发起AJAX请求获取批次ID对应的招聘岗位信息
      // 将数据赋值给对应的batch.jobs
      console.log("发送获取批次" + batchId + "号对应招聘岗位")
    },
    toggleDrawer(batchId) {
      if (this.openBatchId === batchId) {
        this.openBatchId = null // 关闭抽屉
      } else {
        this.openBatchId = batchId // 展开抽屉
      }
    }
  }
}
</script>
