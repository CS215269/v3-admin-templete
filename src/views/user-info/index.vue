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

// 计算用户学历属性
const getDegreeLabel = (degree: number | undefined) => {
  switch (degree) {
    case 1:
      return "中专"
    case 2:
      return "大专"
    case 3:
      return "本科"
    case 4:
      return "硕士"
    case 5:
      return "博士"
    case undefined:
      return ""
    default:
      return "异常"
  }
}
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
      ElMessage.error("获取个人信息失败,请重试")
    })
    .finally(() => {
      loading.value = false
    })
}

const startEditing = () => {
  isEditing.value = true
  if (userinfo.value) {
    console.log("备份成编辑模式")
    /* 深拷贝赋值,否则是将对象的引用赋值给左值 */
    const obj = JSON.parse(JSON.stringify(userinfo.value))
    editedUserinfo.value = obj
  } else {
    ElMessage.error("出现异常,请联系管理员")
  }
}
const saveChanges = () => {
  // 处理数据并发送put请求到服务器
  // 示例代码，实际情况根据你的后端接口来实现
  editedUserinfo.value.degree = Number(editedUserinfo.value.degree)
  setUserInfoApi(editedUserinfo.value)
    .then((res) => {
      ElMessage.info(res.message)
      /* 深拷贝赋值,否则是将对象的引用赋值给左值 */
      const obj = JSON.parse(JSON.stringify(editedUserinfo.value))
      userinfo.value = obj
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
    /* 深拷贝赋值,否则是将对象的引用赋值给左值 */
    const obj = JSON.parse(JSON.stringify(userinfo.value))
    editedUserinfo.value = obj
  }
}
onMounted(getUserData)
const isAgeInputInvalid = ref<boolean>(false)
/** 年龄输入校验 */
const validateInput = () => {
  console.log("年龄" + Number(editedUserinfo.value.age))
  const patrn = /^[0-9]{1,20}$/
  if (editedUserinfo.value.age === "") {
    isAgeInputInvalid.value = true
    ElMessage.error("内容不能为空")
  } else if (!patrn.exec(editedUserinfo.value.age)) {
    isAgeInputInvalid.value = true
    ElMessage.error("只能输入数字")
    editedUserinfo.value.age = ""
  } else if (Number(editedUserinfo.value.age) < 15 || Number(editedUserinfo.value.age) > 90) {
    isAgeInputInvalid.value = true
    console.log("年龄2" + Number(editedUserinfo.value.age))
    ElMessage.error("年龄应在 15 到 90 之间")
    editedUserinfo.value.age = ""
  } else {
    isAgeInputInvalid.value = false
  }
}
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

          <el-descriptions-item label="用户名" label-align="center" align="left">
            <!-- label-class-name="my-label" 自定義樣式 -->
            <template v-if="!isEditing">{{ userinfo?.name }}</template>
            <template v-else> <el-input v-model="editedUserinfo.name" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="年龄" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.age }}</template>
            <template v-else> <el-input id="userage" v-model="editedUserinfo.age" @blur="validateInput" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="性别" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.sex }}</template>
            <template v-else>
              <el-select id="usersex" v-model="editedUserinfo.sex">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select> </template
          ></el-descriptions-item>
          <el-descriptions-item label="学历" label-align="center" align="left">
            <template v-if="!isEditing">{{ getDegreeLabel(userinfo?.degree) }}</template>
            <template v-else>
              <el-select id="userdegree" v-model="editedUserinfo.degree">
                <el-option label="中专" value="1" />
                <el-option label="大专" value="2" />
                <el-option label="本科" value="3" />
                <el-option label="硕士" value="4" />
                <el-option label="博士" value="5" />
              </el-select> </template
          ></el-descriptions-item>
          <el-descriptions-item label="政治面貌" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.zzmm }}<span>啊啊啊</span></template>
            <template v-else
              ><el-select id="userzzmm" v-model="editedUserinfo.zzmm">
                <el-option label="群众" value="群众" />
                <el-option label="团员" value="团员" />
                <el-option label="党员" value="党员" />
              </el-select> </template
          ></el-descriptions-item>
          <el-descriptions-item label="籍贯" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.native_place }}</template>
            <template v-else> <el-input v-model="editedUserinfo.native_place" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="出生日期" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.birthday }}</template>
            <template v-else>
              <el-date-picker
                v-model="editedUserinfo.birthday"
                type="date"
                placeholder="选择日期"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
              /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="民族" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.nation }}</template>
            <template v-else> <el-input v-model="editedUserinfo.nation" /> </template
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
            <template v-else
              ><el-tooltip class="box-item" content="身份证号不可修改" placement="top">
                {{ userinfo?.idnum }}
              </el-tooltip></template
            >
          </el-descriptions-item>
          <el-descriptions-item label="手机号" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.tel }}</template>
            <template v-else> <el-input v-model="editedUserinfo.tel" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="现居地址" :span="2" label-align="center" align="left">
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