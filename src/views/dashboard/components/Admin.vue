<script lang="ts" setup>
import { getDashboardDataApi, getExportTotalExcelApi, setOpenRegisterApi } from "@/api/dashboard"
import { ElMessage } from "element-plus"
import { onMounted, ref } from "vue"
import { useUserStore } from "@/store/modules/user"
const userStore = useUserStore()
const isAdmin = userStore.roles.includes("superadmin")
const userTotal = ref<number>()
const openBatchTotal = ref<number>()
const unsettledThingsNum = ref<number>()
const methodOpen = ref<boolean>(true)
const getDashboardData = () => {
  getDashboardDataApi()
    .then((res) => {
      userTotal.value = res.data.userTotal
      openBatchTotal.value = res.data.openBatchTotal
      unsettledThingsNum.value = res.data.unsettledThingsNum
      methodOpen.value = res.data.methodOpen == 1 ? true : false
    })
    .catch(() => {
      ElMessage.error("首页加载异常")
    })
    .finally(() => {})
}

const switchLoading = ref(false)

const beforeChange1 = () => {
  return async () => {
    switchLoading.value = true
    try {
      await setOpenRegisterApi({ open: !methodOpen.value ? 1 : 0 })
      ElMessage.success("操作成功")
      switchLoading.value = false
      return true
    } catch (error) {
      ElMessage.error("操作失败")
      switchLoading.value = false
      return false
    }
  }
}

const getExcel = () => {
  getExportTotalExcelApi()
    .then((res) => {
      const blob = new Blob([res])
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "总表.xlsx"
      a.click()
    })
    .catch(() => {
      ElMessage.error("导出失败")
    })
    .finally(() => {})
}

onMounted(getDashboardData)
</script>
<template>
  <div class="app-container" loading>
    <el-row justify="space-around">
      <el-col :span="10">
        <div class="statistic-card">
          <el-statistic :value="userTotal">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                <el-text tag="p" size="large"> 用户总数 </el-text>
                <el-tooltip effect="dark" content="注册用户数量" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="statistic-card">
          <el-statistic :value="openBatchTotal">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                <el-text tag="p" size="large"> 开放批次数 </el-text>
                <el-tooltip effect="dark" content="批次属性为'已开启'的批次数量" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <!-- <span>month on month</span>
              <span class="red">
                12%
                <el-icon>
                  <CaretBottom />
                </el-icon>
              </span> -->
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row justify="space-around">
      <el-col :span="10">
        <div class="statistic-card">
          <el-statistic :value="unsettledThingsNum" title="New transactions today">
            <template #title>
              <div style="display: inline-flex; align-items: center">待处理投递数</div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col v-if="isAdmin" :span="10">
        <div class="statistic-card">
          <el-button @click="getExcel()"> 导出招聘情况总表 </el-button>
          &nbsp;
          <el-divider direction="vertical" />
          &nbsp;
          <el-switch
            v-model="methodOpen"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用注册"
            inactive-text="关闭注册"
            :before-change="beforeChange1()"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.center {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.el-row {
  margin-bottom: 20px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>
