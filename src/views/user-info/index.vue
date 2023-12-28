<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { getUserInfoApi } from "@/api/user-info"
import { UserInfoData } from "@/api/user-info/types/user-info"

defineOptions({
  name: "UserInfo"
})

const loading = ref<boolean>(false)

const userinfo = ref<UserInfoData>()

const getUserData = () => {
  loading.value = true
  getUserInfoApi()
    .then((res) => {
      userinfo.value = res.data
    })

    .catch(() => {
      userinfo.value = undefined
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(getUserData)
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <!-- Toolbar buttons code here -->
      </div>
      <div class="table-wrapper">
        <el-descriptions title="Customized style list" :column="3" border>
          <el-descriptions-item
            label="Username"
            label-align="right"
            align="center"
            label-class-name="my-label"
            class-name="my-content"
            width="150px"
            >{{ userinfo?.name }}</el-descriptions-item
          >
          <el-descriptions-item label="Telephone" label-align="right" align="center">{{
            userinfo?.idnum
          }}</el-descriptions-item>
          <el-descriptions-item label="Place" label-align="right" align="center">Suzhou</el-descriptions-item>
          <el-descriptions-item label="Remarks" label-align="right" align="center">
            <el-tag size="small">School</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Address" label-align="right" align="center"
            >No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province</el-descriptions-item
          >
        </el-descriptions>
      </div>
      <div class="pager-wrapper">
        <!-- Pagination code here -->
      </div>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.my-label) {
  background: var(--el-color-success-light-9) !important;
}
:deep(.my-content) {
  background: var(--el-color-danger-light-9);
}
</style>
