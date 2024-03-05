<script lang="ts" setup>
import { getDashboardDataApi } from "@/api/dashboard"
import { ElMessage } from "element-plus"
import { onMounted, ref } from "vue"
const userTotal = ref<number>()
const openBatchTotal = ref<number>()
const unsettledThingsNum = ref<number>()
const num = ref<number>(0)
const getDashboardData = () => {
  getDashboardDataApi()
    .then((res) => {
      userTotal.value = res.data.unsettledThingsNum
      openBatchTotal.value = res.data.openBatchTotal
      unsettledThingsNum.value = res.data.unsettledThingsNum
      num.value = res.data.num
    })
    .catch(() => {
      ElMessage.error("首页加载异常")
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
      <el-col :span="10">
        <div class="statistic-card">
          <el-statistic :value="num" title="New transactions today">
            <template #title>
              <div style="display: inline-flex; align-items: center">New transactions today</div>
            </template>
          </el-statistic>
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
