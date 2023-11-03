<script>
import JobBatch from "@/components/JobBatch.vue"

export default {
  components: {
    JobBatch
  },
  data() {
    return {
      tableData: [] // 从接口获取的表格数据
    }
  },
  methods: {
    // 获取表格数据的方法
    getTableData() {
      // 发起AJAX请求获取表格数据
      // 将数据赋值给tableData
      this.tableData = getTableDataApi()
    }
  }
}
</script>

<template>
  <div>
    <JobBatch :batches="tableData" />
  </div>
</template>
