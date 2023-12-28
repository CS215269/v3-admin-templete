<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { getUserInfoApi, setUserInfoApi } from "@/api/user-info"
import { UserInfoData } from "@/api/user-info/types/user-info"
import { ElMessage } from "element-plus"

defineOptions({
  name: "UserInfo"
})

const loading = ref<boolean>(false)
/** 是否处于编辑模式 */
const isEditing = ref<boolean>(false)
/** 当前用户id,默认0 */
const uid = ref<number>(0)

const userinfo = ref<UserInfoData>()
const editedUserinfo = ref<UserInfoData>({
  id: uid.value,
  name: "",
  idnum: "",
  tel: "",
  /** 性别 */
  sex: "",
  /** 年龄 */
  age: "",
  /** 学历 */
  degree: 0,
  /** 政治面貌 */
  zzmm: "",
  /** 毕业学校 */
  school: "",
  /** 民族 */
  nation: "",
  /** 出生日期 */
  birthday: "",
  /** 籍贯 */
  native_place: "",
  /** 现居地址 */
  address: "",
  /** 毕业时间 */
  graduation_time: "",
  /** 专业 */
  specialty: ""
})

const getUserData = () => {
  loading.value = true
  getUserInfoApi()
    .then((res) => {
      userinfo.value = res.data
      uid.value = res.data.id
    })

    .catch(() => {
      // 如果获取失败,所有属性设为空
      userinfo.value = {
        id: uid.value,
        name: "",
        idnum: "",
        tel: "",
        sex: "",
        age: "",
        degree: 0,
        zzmm: "",
        school: "",
        nation: "",
        birthday: "",
        native_place: "",
        address: "",
        graduation_time: "",
        specialty: ""
      }
      ElMessage.error("获取信息失败,请重试")
    })
    .finally(() => {
      loading.value = false
    })
}

const startEditing = () => {
  isEditing.value = true
  if (userinfo.value) {
    editedUserinfo.value = userinfo.value
  }
}
const saveChanges = () => {
  // 处理数据并发送put请求到服务器
  // 示例代码，实际情况根据你的后端接口来实现
  userinfo.value = editedUserinfo.value
  setUserInfoApi(userinfo.value)
    .then((res) => {
      ElMessage.info(res.message)
    })
    .catch(() => {
      ElMessage.error("提交修改失败,请重试")
    })
    .finally(() => {
      isEditing.value = false
    })
}
const cancelEditing = () => {
  isEditing.value = false
  if (userinfo.value) {
    editedUserinfo.value = userinfo.value
  }
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
        <el-descriptions title="我的个人信息" :column="3" border size="large">
          <template #extra>
            <div v-if="isEditing">
              <el-button @click="saveChanges">保存</el-button>
              <el-button @click="cancelEditing">取消</el-button>
            </div>
            <div v-else>
              <el-button @click="startEditing">编辑</el-button>
            </div>
          </template>
          <el-descriptions-item
            label="用户名"
            label-align="center"
            align="left"
            label-class-name="my-label"
            width="150px"
            style="height: 150px"
          >
            <template v-if="!isEditing">{{ userinfo?.name }}</template>
            <template v-else> <el-input v-model="editedUserinfo.name" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="年龄" label-align="center" align="left" class-name="myheight60">
            <template v-if="!isEditing">{{ userinfo?.age }}</template>
            <template v-else> <el-input v-model="editedUserinfo.age" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="性别" label-align="center" align="left" class-name="myheight60">
            <template v-if="!isEditing">{{ userinfo?.sex }}</template>
            <template v-else> <el-input v-model="editedUserinfo.sex" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="学历" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.degree }}</template>
            <template v-else> <el-input v-model="editedUserinfo.degree" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="政治面貌" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.zzmm }}</template>
            <template v-else> <el-input v-model="editedUserinfo.zzmm" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="籍贯" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.native_place }}</template>
            <template v-else> <el-input v-model="editedUserinfo.native_place" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="出生日期" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.birthday }}</template>
            <template v-else> <el-input v-model="editedUserinfo.birthday" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="民族" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.nation }}</template>
            <template v-else> <el-input v-model="editedUserinfo.nation" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="学历" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.degree }}</template>
            <template v-else> <el-input v-model="editedUserinfo.degree" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="毕业院校" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.school }}</template>
            <template v-else> <el-input v-model="editedUserinfo.school" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="毕业时间" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.graduation_time }}</template>
            <template v-else> <el-input v-model="editedUserinfo.graduation_time" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="专业" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.specialty }}</template>
            <template v-else> <el-input v-model="editedUserinfo.specialty" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="身份证号码" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.idnum }}</template>
            <template v-else> <el-input v-model="editedUserinfo.idnum" /> </template>
          </el-descriptions-item>
          <el-descriptions-item label="手机号" :span="2" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.tel }}</template>
            <template v-else> <el-input v-model="editedUserinfo.tel" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="现居地址" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.address }}</template>
            <template v-else> <el-input v-model="editedUserinfo.address" /> </template
          ></el-descriptions-item>
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
