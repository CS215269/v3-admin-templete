<script lang="ts" setup>
import { defineComponent, onMounted, reactive, ref } from "vue"
import { Delete } from "@element-plus/icons-vue"
import { ElMessage, FormRules, UploadInstance, UploadProps, UploadRawFile, genFileId } from "element-plus"
import { setDegree, setEducation } from "@/utils/degree"
import type * as Type from "./data"
import { submitJobApplicationPartA, submitJobApplicationPartB, submitJobApplicationPartC } from "@/api/user-batch"
import { useUserStore } from "@/store/modules/user"
import { getUserInfoApi } from "@/api/user-info"

defineComponent({
  name: "ReviewForm"
})

// 使用 defineEmits 声明事件
const emit = defineEmits(["close-drawer"])

const closeDrawer = () => {
  // 发射事件
  emit("close-drawer")
}

const props = defineProps<{
  recruitId: number
  code: string
}>()

const token = useUserStore().token
const myHeaders = new Headers()
myHeaders.append("ngrok-skip-browser-warning", "true")
if (token) {
  myHeaders.append("Authorization", `Bearer ${token}`)
}
const isPhoneNumber = (rule: any, value: string, callback: Function) => {
  const reg = /^(?:(?:\+|00)86)?1\d{10}$/
  if (value === "") {
    callback(new Error("手机号为空"))
  } else if (reg.test(value)) {
    callback(new Error("手机号不合法"))
  } else {
    callback()
  }
}

const inspectIdnum = (rule: any, value: string, callback: Function) => {
  const reg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
  if (value === "") {
    callback(new Error("身份证号码为空"))
  } else if (reg.test(value)) {
    callback(new Error("身份证号码不合法"))
  } else {
    callback()
  }
}
const rules: FormRules = {
  phone: [{ validator: isPhoneNumber, trigger: "blur" }],
  idnum: [{ validator: inspectIdnum, trigger: "blur" }]
}

const formDataUserInfo = ref<Type.UserInfo>({
  name: "",
  sex: 1,
  phone: "",
  birthPlace: "",
  nation: "",
  zzmm: "",
  email: "",
  birthday: "",
  idnum: "",
  married: "",
  nativePlace: "",
  address: "",
  specialtiesCertificates: ""
})

const sex = ref("")

// 自定义类型FormDataEducation
type formDataTypeEducation = {
  id: number
  school: string
  graduationTime: string
  degree: string
  education: string
  specialty: string
}
const formDataEducation = ref<formDataTypeEducation[]>([
  {
    id: 0,
    school: "",
    graduationTime: "",
    degree: "",
    education: "",
    specialty: ""
  }
])

const addFormItemEducation = () => {
  formDataEducation.value.push({
    id: 0,
    school: "",
    graduationTime: "",
    degree: "",
    education: "",
    specialty: ""
  })
  // nextTick(() => {
  // 可选: 自动聚焦到新添加的表单项
  // })
}
const delFormItemEducation = (item: formDataTypeEducation) => {
  let currentId = item.id
  const index = formDataEducation.value.indexOf(item)
  if (index !== -1) {
    formDataEducation.value.splice(index, 1)
  }
  if (formDataEducation.value.at(index) != undefined) {
    for (let i = index; i < formDataEducation.value.length; i++) {
      formDataEducation.value[i].id = currentId++
    }
  }
}

const formDataWorkExperience = ref<Type.WorkExperience[]>([
  {
    id: 0,
    company: "",
    work_time_start: "",
    work_time_end: "",
    position: ""
  }
])
const work_time = ref<string[]>([""])

const addFormItemWorkExperience = () => {
  work_time.value.push("")
  formDataWorkExperience.value = [
    ...formDataWorkExperience.value,
    { id: 0, company: "", work_time_start: "", work_time_end: "", position: "" }
  ]

  // nextTick(() => {
  // 可选: 自动聚焦到新添加的表单项
  // })
}
const delFormItemWorkExperience = (item: Type.WorkExperience) => {
  let currentId = item.id
  const index = formDataWorkExperience.value.indexOf(item)
  if (index !== -1) {
    formDataWorkExperience.value.splice(index, 1)
    work_time.value.splice(index, 1)
  }
  if (formDataWorkExperience.value.at(index) != undefined) {
    for (let i = index; i < formDataWorkExperience.value.length; i++) {
      formDataWorkExperience.value[i].id = currentId++
    }
  }
}

const formDataPaper = ref<Type.Paper[]>([
  {
    id: 0,
    journal: "",
    title: "",
    time: "",
    journal_num: ""
  }
])
const addFormItemPaper = () => {
  formDataPaper.value.push({ id: formDataPaper.value.length, journal: "", title: "", time: "", journal_num: "" })
  // nextTick(() => {
  // 可选: 自动聚焦到新添加的表单项
  // })
}
const delFormItemPaper = (item: Type.Paper) => {
  let currentId = item.id
  const index = formDataPaper.value.indexOf(item)
  if (index !== -1) {
    formDataPaper.value.splice(index, 1)
  }
  if (formDataPaper.value.at(index) != undefined) {
    for (let i = index; i < formDataPaper.value.length; i++) {
      formDataPaper.value[i].id = currentId++
    }
  }
}

const formDataProject0 = ref<Type.Project[]>([
  {
    type: 0,
    id: 0,
    time: "",
    title: "",
    level: "",
    rank: ""
  }
])
const addFormItemProject0 = () => {
  formDataProject0.value.push({ type: 0, id: formDataProject0.value.length, time: "", title: "", level: "", rank: "" })
  // nextTick(() => {
  // 可选: 自动聚焦到新添加的表单项
  // })
}
const delFormItemProject0 = (item: Type.Project) => {
  let currentId = item.id
  const index = formDataProject0.value.indexOf(item)
  if (index !== -1) {
    formDataProject0.value.splice(index, 1)
  }
  if (formDataProject0.value.at(index) != undefined) {
    for (let i = index; i < formDataProject0.value.length; i++) {
      formDataProject0.value[i].id = currentId++
    }
  }
}

const formDataProject1 = ref<Type.Project[]>([
  {
    type: 1,
    id: 0,
    time: "",
    title: "",
    level: "",
    rank: ""
  }
])
const addFormItemProject1 = () => {
  formDataProject1.value.push({ type: 0, id: formDataProject1.value.length, time: "", title: "", level: "", rank: "" })
  // nextTick(() => {
  // 可选: 自动聚焦到新添加的表单项
  // })
}
const delFormItemProject1 = (item: Type.Project) => {
  let currentId = item.id
  const index = formDataProject1.value.indexOf(item)
  if (index !== -1) {
    formDataProject1.value.splice(index, 1)
  }
  if (formDataProject1.value.at(index) != undefined) {
    for (let i = index; i < formDataProject1.value.length; i++) {
      formDataProject1.value[i].id = currentId++
    }
  }
}

const formDataProject2 = ref<Type.Project[]>([
  {
    type: 2,
    id: 0,
    time: "",
    title: "",
    level: "",
    rank: ""
  }
])
const addFormItemProject2 = () => {
  formDataProject2.value.push({ type: 2, id: formDataProject2.value.length, time: "", title: "", level: "", rank: "" })
  // nextTick(() => {
  // 可选: 自动聚焦到新添加的表单项
  // })
}
const delFormItemProject2 = (item: Type.Project) => {
  let currentId = item.id
  const index = formDataProject2.value.indexOf(item)
  if (index !== -1) {
    formDataProject2.value.splice(index, 1)
  }
  if (formDataProject2.value.at(index) != undefined) {
    for (let i = index; i < formDataProject2.value.length; i++) {
      formDataProject2.value[i].id = currentId++
    }
  }
}

const formDataResearch = ref<Type.Research[]>([
  {
    id: 0,
    name: ""
  }
])

const addFormItemResearch = () => {
  formDataResearch.value.push({ id: formDataResearch.value.length, name: "" })
  // nextTick(() => {
  // 可选: 自动聚焦到新添加的表单项
  // })
}

const delFormItemResearch = (item: Type.Research) => {
  let currentId = item.id
  const index = formDataResearch.value.indexOf(item)
  if (index !== -1) {
    formDataResearch.value.splice(index, 1)
  }
  if (formDataResearch.value.at(index) != undefined) {
    for (let i = index; i < formDataResearch.value.length; i++) {
      formDataResearch.value[i].id = currentId++
    }
  }
}

const awardsAndPunishments = ref<string>("")

const formDataFamilyConnections = ref<Type.FamilyConnections[]>([
  {
    name: "",
    connection: "",
    work: ""
  }
])

const addFormItemFamilyConnections = () => {
  formDataFamilyConnections.value.push({ name: "", connection: "", work: "" })
  // nextTick(() => {
  // 可选: 自动聚焦到新添加的表单项
  // })
}

const delFormItemFamilyConnections = (item: Type.FamilyConnections) => {
  const index = formDataFamilyConnections.value.indexOf(item)
  if (index !== -1) {
    formDataFamilyConnections.value.splice(index, 1)
  }
}

const note = ref<string>("")

const formDataPartA = reactive<Type.FormDataPartA>({
  recruitId: props.recruitId,
  code: props.code,
  info: formDataUserInfo.value,
  education: [],
  workExperience: []
})
const formDataPartB = ref<Type.FormDataPartB>()
const formDataPartC = reactive<Type.FormDataPartC>({
  research: formDataResearch.value,
  awardsAndPunishments: awardsAndPunishments.value,
  family: formDataFamilyConnections.value,
  note: note.value
})
const percentage = ref(0)
const uploading = ref(false)
const fileUploading = ref(false)
const canSubmit = ref(true)

const submit = () => {
  uploading.value = true
  // 过滤空数据
  if (formDataWorkExperience.value.length == 1 && formDataWorkExperience.value.at(0)?.company === "")
    // 清空 formDataWorkExperience
    formDataWorkExperience.value = []
  const adapter: Type.Education[] = []
  for (let i = 0; i < formDataEducation.value.length; i++) {
    if (
      formDataEducation.value[i].graduationTime == null ||
      formDataEducation.value[i].graduationTime == undefined ||
      formDataEducation.value[i].graduationTime === ""
    ) {
      formDataEducation.value[i].graduationTime = "2000-01-01"
      canSubmit.value = false
    }
    adapter.push({
      id: formDataEducation.value[i].id,
      school: formDataEducation.value[i].school,
      graduationTime: formDataEducation.value[i].graduationTime,
      degree: setDegree(formDataEducation.value[i].degree),
      education: setEducation(formDataEducation.value[i].education),
      specialty: formDataEducation.value[i].specialty
    })
  }
  for (let i = 0; i < work_time.value.length; i++) {
    if (work_time.value[i] == null || work_time.value[i] == undefined || work_time.value[i] === "") {
      work_time.value[i] = "2000-01"
      console.log()

      // work_time.value[i][1] = "2000-01"
      canSubmit.value = false
    }
    const element = work_time.value[i]
    formDataWorkExperience.value[i].work_time_start = element[0]
    formDataWorkExperience.value[i].work_time_end = element[1]
  }
  formDataPartA.info = formDataUserInfo.value
  formDataPartA.info.sex = sex.value === "男" ? 1 : 2
  formDataPartA.education = adapter
  formDataPartA.workExperience = formDataWorkExperience.value
  formDataPartC.note = note.value
  formDataPartC.awardsAndPunishments = awardsAndPunishments.value

  submitJobApplicationPartA(formDataPartA)
    .then((res) => {
      if (res.code == 0) {
        percentage.value += 10
        return true
      }
    })
    .catch(() => {
      // submitStatus.value = false
    })
    .finally(() => {})
  formDataPartB.value = {
    paper: formDataPaper.value,
    project: formDataProject0.value.concat(formDataProject1.value, formDataProject2.value)
  }
  submitJobApplicationPartB(formDataPartB.value)
    .then(() => {
      percentage.value += 10
    })
    .catch(() => {
      // submitStatus.value = false
    })
    .finally(() => {})
  submitJobApplicationPartC(formDataPartC)
    .then(() => {
      percentage.value += 10
    })
    .catch(() => {
      // submitStatus.value = false
    })
    .finally(() => {
      uploading.value = false
      closeDrawer()
      submitUpload()
    })
}
// const uploadPath = "https://supposedly-credible-cougar.ngrok-free.app/Recruit/api/userResume"
const uploadPath = "api/userResume"
const uploadPath2 = uploadPath + "/idnum"

const uploadRef0 = ref<UploadInstance>()
const uploadRef1 = ref<UploadInstance>()
const uploadRef2 = ref<UploadInstance>()
const uploadRef3 = ref<UploadInstance>()
const uploadRef4 = ref<UploadInstance>()
const uploadRef5 = ref<UploadInstance>()
const uploadRef6 = ref<UploadInstance>()

const submitUpload = async () => {
  fileUploading.value = true
  if (uploadRef0.value && uploadRef0.value) {
    uploadRef0.value.submit()
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (uploadRef0.value && uploadRef0.value) {
    uploadRef0.value!.submit()
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (uploadRef1.value && uploadRef0.value) {
    uploadRef1.value!.submit()
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (uploadRef2.value && uploadRef0.value) {
    uploadRef2.value!.submit()
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (uploadRef3.value && uploadRef0.value) {
    uploadRef3.value!.submit()
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (uploadRef4.value && uploadRef0.value) {
    uploadRef4.value!.submit()
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (uploadRef5.value && uploadRef0.value) {
    uploadRef5.value!.submit()
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (uploadRef6.value && uploadRef0.value) {
    uploadRef6.value!.submit()
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (upload.value && uploadRef0.value) {
    upload.value!.submit()
  }
  fileUploading.value = false

  ElMessage.success("提交成功")
  closeDrawer()
}
/** 上传完成处理函数 */
const handleUploadComplete = () => {}

const upload = ref<UploadInstance>()

const beforeFileUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "application/pdf") {
    ElMessage.error("只能上传 doc,docx 或 pdf 格式的文件!")
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("文件大小必须小于5MB!")
    return false
  }
  return true
}

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

onMounted(() => {
  getUserInfoApi()
    .then((res) => {
      formDataUserInfo.value = res.data.user
      sex.value = res.data.user.sex == 1 ? "男" : "女"
    })
    .catch(() => {})
    .finally(() => {
      uploading.value = false
      percentage.value = 0
    })
})
</script>

<template>
  <el-row justify="center">
    <el-col :span="23">
      <el-row justify="center">
        <el-text tag="p" size="large"><b>基础信息</b></el-text>
      </el-row>
      <el-form ref="ruleFormRef" :rules="rules" status-icon>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-text>{{ formDataUserInfo.name }}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别">
              <el-select v-model="sex" clearable placeholder="Select" style="width: 240px">
                <el-option label="男" :value="1" />
                <el-option label="女" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生日期">
              <el-date-picker
                v-model="formDataUserInfo.birthday"
                type="date"
                placeholder="选择日期"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="出生地">
              <el-input v-model="formDataUserInfo.birthPlace" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="民族">
              <el-input v-model="formDataUserInfo.nation" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="政治面貌">
              <el-input v-model="formDataUserInfo.zzmm" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="电话" prop="phone">
              <el-text> {{ formDataUserInfo.phone }}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电子邮箱">
              <el-input v-model="formDataUserInfo.email" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="婚否">
              <el-select v-model="formDataPartA.info.married" clearable placeholder="Select" style="width: 240px">
                <el-option label="未婚" value="未婚" />
                <el-option label="已婚" value="已婚" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号码" prop="idnum">
              <el-row>
                <el-col :span="24">
                  <el-text> {{ formDataUserInfo.idnum }} </el-text>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-upload
              ref="upload"
              :action="uploadPath2"
              accept="application/pdf"
              :limit="1"
              :on-exceed="handleExceed"
              :auto-upload="false"
              :headers="myHeaders"
            >
              <template #trigger>
                <el-button type="primary">select file</el-button>
              </template>
              <template #tip>
                <div class="el-upload__tip">上传一个PDF文件,包含身份证正反面照片</div>
              </template>
            </el-upload>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="户口所在地（应届毕业生填入学前的）">
              <el-input
                v-model="formDataUserInfo.nativePlace"
                placeholder="** 省（市、自治区）** 市（州）** 县（市、区）"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="家庭详细地址">
              <el-input v-model="formDataUserInfo.address" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="曾获何种专业证书，有何特长">
              <el-input type="textarea" v-model="formDataUserInfo.specialtiesCertificates" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-text tag="p" size="large"><b>教育经历（从专、本科学历填起）</b></el-text>
        </el-row>
        <el-row>
          <el-col :span="4"><el-text tag="p">学历</el-text></el-col>
          <el-col :span="4"><el-text tag="p">学位</el-text></el-col>
          <el-col :span="6"><el-text tag="p">毕业学校</el-text></el-col>
          <el-col :span="5"><el-text tag="p">所学专业</el-text></el-col>
          <el-col :span="4"><el-text tag="p">毕业时间</el-text></el-col>
        </el-row>
        <el-row v-for="item in formDataEducation" :key="item.id">
          <el-col :span="4">
            <el-select v-model="item.education">
              <el-option label="专科" value="专科" />
              <el-option label="本科" value="本科" />
              <el-option label="研究生" value="研究生" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="item.degree">
              <el-option label="无" value="无" />
              <el-option label="学士" value="学士" />
              <el-option label="硕士" value="硕士" />
              <el-option label="博士" value="博士" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-form-item><el-input v-model="item.school" /> </el-form-item>
          </el-col>
          <el-col :span="5"><el-input v-model="item.specialty" /></el-col>
          <el-col :span="4">
            <el-form-item>
              <el-date-picker
                v-model="item.graduationTime"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD "
              />
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="danger" size="small" plain :icon="Delete" @click="delFormItemEducation(item)"
            /></el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col :span="12" v-if="formDataEducation.length != 0">
            <el-upload
              :action="uploadPath"
              ref="uploadRef0"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :before-upload="beforeFileUpload"
              :headers="myHeaders"
              :data="{
                code: props.code,
                part: 0
              }"
            >
              <el-button type="primary" size="small" plain>上传佐证文件</el-button>
              <template #tip> <div class="el-upload__tip">只能上传PDF</div> </template>
            </el-upload>
          </el-col>
          <el-col :span="12" v-if="formDataEducation.length == 0"><el-text> 暂无记录 </el-text></el-col>
          <el-col :span="4"><el-button @click="addFormItemEducation()">增加一条记录</el-button> </el-col>
        </el-row>
        <el-row>
          <el-divider border-style="double" />
          <el-text tag="p" size="large">
            <strong>符合“安徽工商职业学院周转池编制人才标准”（专业技术岗位必填，任填一项）</strong>
          </el-text>
        </el-row>
        <el-row justify="center">
          <el-divider border-style="dashed" />
          <el-text tag="p" size="large"> 1.工作经历 </el-text>
        </el-row>
        <el-row>
          <el-col :span="6"><el-text tag="p">工作时间（段）</el-text></el-col>
          <el-col :span="9"><el-text tag="p">所在单位</el-text></el-col>
          <el-col :span="8"><el-text tag="p">岗位（职务）</el-text></el-col>
        </el-row>
        <el-row v-for="(item, index) in formDataWorkExperience" :key="item.id">
          <el-col :span="6">
            <el-form-item>
              <el-date-picker
                v-model="work_time[index]"
                type="monthrange"
                unlink-panels
                range-separator="到"
                start-placeholder="起始月"
                end-placeholder="结束月"
                format="YYYY/MM"
                value-format="YYYY-MM"
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item> <el-input v-model="item.company" /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item> <el-input v-model="item.position" /> </el-form-item
          ></el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="danger" size="small" plain :icon="Delete" @click="delFormItemWorkExperience(item)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col :span="12" v-if="formDataWorkExperience.length != 0">
            <!-- ref="setUploadRef" -->
            <el-upload
              ref="uploadRef1"
              :action="uploadPath"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :before-upload="beforeFileUpload"
              :headers="myHeaders"
              :data="{
                code: props.code,
                part: 1
              }"
            >
              <el-button type="primary" size="small" plain>上传佐证文件</el-button>
              <template #tip> <div class="el-upload__tip">只能上传PDF</div> </template>
            </el-upload>
          </el-col>
          <el-col :span="12" v-if="formDataWorkExperience.length == 0"><el-text> 暂无记录 </el-text></el-col>
          <el-col :span="4"><el-button @click="addFormItemWorkExperience()">增加一条记录</el-button> </el-col>
        </el-row>
        <el-row justify="center">
          <el-divider border-style="dashed" />
          <el-text tag="p" size="large"> 2.论文 </el-text>
        </el-row>
        <el-row>
          <el-col :span="5"><el-text> 期刊 </el-text></el-col>
          <el-col :span="10"><el-text> 论文名称 </el-text></el-col>
          <el-col :span="4"><el-text> 发刊时间 </el-text></el-col>
          <el-col :span="4"><el-text> 刊号 </el-text></el-col>
        </el-row>
        <el-row v-for="item in formDataPaper" :key="item.id">
          <el-col :span="5">
            <el-form-item><el-input v-model="item.journal" /> </el-form-item
          ></el-col>
          <el-col :span="10">
            <el-form-item><el-input v-model="item.title" /> </el-form-item
          ></el-col>
          <el-col :span="4">
            <el-form-item>
              <el-date-picker
                v-model="item.time"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD "
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item><el-input v-model="item.journal_num" /> </el-form-item>
          </el-col>

          <el-col :span="1">
            <el-form-item>
              <el-button type="danger" size="small" plain :icon="Delete" @click="delFormItemPaper(item)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col :span="12" v-if="formDataPaper.length != 0">
            <el-upload
              :action="uploadPath"
              ref="uploadRef2"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :before-upload="beforeFileUpload"
              :headers="myHeaders"
              :data="{
                code: props.code,
                part: 2
              }"
            >
              <el-button type="primary" size="small" plain>上传佐证文件</el-button>
              <template #tip> <div class="el-upload__tip">只能上传PDF</div> </template>
            </el-upload>
          </el-col>
          <el-col :span="12" v-if="formDataPaper.length == 0"><el-text> 暂无记录 </el-text></el-col>
          <el-col :span="4"><el-button @click="addFormItemPaper()">增加一条记录</el-button> </el-col>
        </el-row>
        <el-row justify="center">
          <el-divider border-style="dashed" />
          <el-text tag="p" size="large"> 3.教、科研项目 </el-text>
        </el-row>
        <el-row>
          <el-col :span="5"><el-text> 立项时间 </el-text></el-col>
          <el-col :span="10"><el-text> 项目名称 </el-text></el-col>
          <el-col :span="4"><el-text> 级别 </el-text></el-col>
          <el-col :span="4"><el-text> 排名 </el-text></el-col>
        </el-row>
        <el-row v-for="item in formDataProject0" :key="item.id">
          <el-col :span="5">
            <el-form-item>
              <el-date-picker
                v-model="item.time"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD "
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-input v-model="item.title" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="item.level" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="item.rank" />
            </el-form-item>
          </el-col>

          <el-col :span="1">
            <el-form-item>
              <el-button type="danger" size="small" plain :icon="Delete" @click="delFormItemProject0(item)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col :span="12" v-if="formDataProject0.length != 0">
            <el-upload
              :action="uploadPath"
              ref="uploadRef3"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :before-upload="beforeFileUpload"
              :headers="myHeaders"
              :data="{
                code: props.code,
                part: 3
              }"
            >
              <el-button type="primary" size="small" plain>上传佐证文件</el-button>
              <template #tip> <div class="el-upload__tip">只能上传PDF</div> </template>
            </el-upload>
          </el-col>
          <el-col :span="12" v-if="formDataProject0.length == 0"><el-text> 暂无记录 </el-text></el-col>
          <el-col :span="4"><el-button @click="addFormItemProject0()">增加一条记录</el-button> </el-col>
        </el-row>
        <el-row justify="center">
          <el-divider border-style="dashed" />
          <el-text tag="p" size="large"> 4.教学成果奖或教学竞赛奖励 </el-text>
        </el-row>
        <el-row>
          <el-col :span="5"><el-text> 获奖时间 </el-text></el-col>
          <el-col :span="10"><el-text> 获奖类型 </el-text></el-col>
          <el-col :span="4"><el-text> 级别 </el-text></el-col>
          <el-col :span="4"><el-text> 排名 </el-text></el-col>
        </el-row>
        <el-row v-for="item in formDataProject1" :key="item.id">
          <el-col :span="5">
            <el-form-item>
              <el-date-picker
                v-model="item.time"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD "
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-input v-model="item.title" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="item.level" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="item.rank" />
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="danger" size="small" plain :icon="Delete" @click="delFormItemProject1(item)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col :span="12" v-if="formDataProject1.length != 0">
            <el-upload
              :action="uploadPath"
              ref="uploadRef4"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :before-upload="beforeFileUpload"
              :headers="myHeaders"
              :data="{
                code: props.code,
                part: 4
              }"
            >
              <el-button type="primary" size="small" plain>上传佐证文件</el-button>
              <template #tip> <div class="el-upload__tip">只能上传PDF</div> </template>
            </el-upload>
          </el-col>

          <el-col :span="12" v-if="formDataProject1.length == 0"><el-text> 暂无记录 </el-text></el-col>
          <el-col :span="4"><el-button @click="addFormItemProject1()">增加一条记录</el-button> </el-col>
        </el-row>
        <el-row justify="center">
          <el-divider border-style="dashed" />
          <el-text tag="p" size="large"> 5.指导竞赛 </el-text>
        </el-row>
        <el-row>
          <el-col :span="5"><el-text> 获奖时间 </el-text></el-col>
          <el-col :span="10"><el-text> 赛项名称 </el-text></el-col>
          <el-col :span="4"><el-text> 级别 </el-text></el-col>
          <el-col :span="4"><el-text> 名次 </el-text></el-col>
        </el-row>
        <el-row v-for="item in formDataProject2" :key="item.id">
          <el-col :span="5">
            <el-form-item>
              <el-date-picker
                v-model="item.time"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD "
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item> <el-input v-model="item.title" /></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item> <el-input v-model="item.level" /> </el-form-item
          ></el-col>
          <el-col :span="4">
            <el-form-item> <el-input v-model="item.rank" /> </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="danger" size="small" plain :icon="Delete" @click="delFormItemProject2(item)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col :span="12" v-if="formDataProject2.length != 0">
            <el-upload
              :action="uploadPath"
              ref="uploadRef5"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :before-upload="beforeFileUpload"
              :headers="myHeaders"
              :data="{
                code: props.code,
                part: 5
              }"
            >
              <el-button type="primary" size="small" plain>上传佐证文件</el-button>
              <template #tip> <div class="el-upload__tip">只能上传PDF</div> </template>
            </el-upload>
          </el-col>
          <el-col :span="12" v-if="formDataProject2.length == 0"><el-text> 暂无记录 </el-text></el-col>
          <el-col :span="4"><el-button @click="addFormItemProject2()">增加一条记录</el-button> </el-col>
        </el-row>
        <el-row justify="center">
          <el-divider border-style="dashed" />
          <el-text tag="p" size="large"> 6.成果推广 </el-text>
        </el-row>
        <el-row>
          <el-col :span="23"><el-text> 成果说明 </el-text></el-col>
        </el-row>
        <el-row v-for="(item, index) in formDataResearch" :key="index">
          <el-col :span="23">
            <el-form-item>
              <el-input v-model:model-value="item.name" />
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="danger" size="small" plain :icon="Delete" @click="delFormItemResearch(item)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col :span="12" v-if="formDataResearch.length != 0">
            <el-upload
              :action="uploadPath"
              ref="uploadRef6"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :before-upload="beforeFileUpload"
              :headers="myHeaders"
              :data="{
                code: props.code,
                part: 6
              }"
            >
              <el-button type="primary" size="small" plain>上传佐证文件</el-button>
              <template #tip> <div class="el-upload__tip">只能上传PDF</div> </template>
            </el-upload>
          </el-col>
          <el-col :span="12" v-if="formDataResearch.length == 0"><el-text> 暂无记录 </el-text></el-col>
          <el-col :span="4">
            <el-button @click="addFormItemResearch()">增加一条记录</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24"
            ><el-form-item label="所受奖惩情况">
              <el-input v-model="awardsAndPunishments" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider border-style="dashed" />
        <el-row>
          <el-col :span="24">
            <el-text tag="p" size="large">直系亲属及主要社会关系 </el-text>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><el-text> 姓名 </el-text></el-col>
          <el-col :span="4"><el-text> 关系 </el-text></el-col>
          <el-col :span="16"><el-text> 工作单位及职务 </el-text></el-col>
        </el-row>
        <el-row v-for="item in formDataFamilyConnections" :key="item.name">
          <el-col :span="4">
            <el-form-item><el-input v-model="item.name" /> </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item><el-input v-model="item.connection" /> </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item><el-input v-model="item.work" /> </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="danger" size="small" plain :icon="Delete" @click="delFormItemFamilyConnections(item)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col :span="12" v-if="formDataFamilyConnections.length == 0"><el-text> 暂无记录 </el-text></el-col>
          <el-col :span="4"><el-button @click="addFormItemFamilyConnections()">增加一条记录</el-button> </el-col>
        </el-row>
        <el-row>
          <el-col :span="24"
            ><el-form-item label="备注">
              <el-input v-model="note" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col>
            <el-text tag="p"
              >说明：<br />
              1.请报考者认真阅读《招聘公告》后如实准确填写。报考者隐瞒有关情况或提供虚假材料的，取消其考试或聘用资格，并按有关规定严肃处理。<br />
              2.教育经历请从专科及以上开始填写，并按照时间专科、本科、研究生、博士的顺序填写。<br />
              3.“直系亲属及主要社会关系”包括夫妻关系、直系血亲关系、三代以内旁系血亲和近姻亲关系。
            </el-text>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col :span="20">
            <el-text v-if="uploading">上传中</el-text>
          </el-col>
          <el-col :span="4">
            <el-button :loading="uploading" type="warning" size="large" plain @click="submit()">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
  </el-row>
</template>
<style>
.el-drawer__body .el-col {
  text-align: center;
  padding: 0.5em 0.8em;
  outline: transparent 1px solid;
}
.el-drawer__body .el-row {
  margin-top: 0.3em;
  outline: #ccc 1px solid;
}
</style>
