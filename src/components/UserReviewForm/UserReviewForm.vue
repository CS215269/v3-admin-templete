<script lang="ts" setup>
import { defineComponent, onMounted, reactive, ref } from "vue"
import { Delete } from "@element-plus/icons-vue"
import {
  ElMessage,
  FormRules,
  UploadFile,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
  genFileId
} from "element-plus"
import { setDegree, setEducation } from "@/utils/degree"
import type * as Type from "./type/data"
import { submitJobApplicationPartA, submitJobApplicationPartB, submitJobApplicationPartC } from "@/api/user-batch"
import { useUserStore } from "@/store/modules/user"
import { getThingInfoApi, preViewUserFileApi } from "./api"

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

/** 是否已经投递 */
const delivered = ref(false)

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

const sex = ref("请选择")

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

const loading = ref<boolean>(false)
const showinfo = (thingId: number, code: string) => {
  loading.value = true
  getThingInfoApi({ id: thingId, code })
    .then((res) => {
      if (res.code != 0) {
        ElMessage.error("获取投递详情失败,请重试")
        return
      }
      formDataUserInfo.value = res.data.userinfo
      formDataEducation.value = res.data.education
      formDataWorkExperience.value = res.data.workExperience
      formDataPaper.value = res.data.paper
      if (res.data && res.data.project && Array.isArray(res.data.project)) {
        formDataProject0.value = res.data.project.filter((item) => item.type === 0)
        formDataProject1.value = res.data.project.filter((item) => item.type === 1)
        formDataProject2.value = res.data.project.filter((item) => item.type === 2)
      } else {
        // Handle the case when res.data or res.data.project is null, undefined, or not an array
        // For example, set default values or show an error message
      }

      formDataResearch.value = res.data.research
      formDataFamilyConnections.value = res.data.family
      note.value = res.data.note
      awardsAndPunishments.value = res.data.awardsAndPunishments
      if (res.data.file0 != null) {
        for (let i = 0; i < res.data.file0.length; i++) {
          const element = res.data.file0[i]
          fileList0.value.push({
            url: element,
            name: element.split("/").slice(-1)
          })
        }
        fileList0.value = res.data.file0.reverse()
      }
      if (res.data.file1 != null) fileList1.value = res.data.file1.reverse()
      if (res.data.file2 != null) fileList2.value = res.data.file2.reverse()
      if (res.data.file3 != null) fileList3.value = res.data.file3.reverse()
      if (res.data.file4 != null) fileList4.value = res.data.file4.reverse()
      if (res.data.file5 != null) fileList5.value = res.data.file5.reverse()
      if (res.data.file6 != null) fileList6.value = res.data.file6.reverse()
      if (res.data.IDPhoto != null) fileIdNum.value = res.data.IDPhoto
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
}

const percentage = ref(0)
const uploading = ref(false)
const fileUploading = ref(false)

const submit = () => {
  if (delivered.value) {
    ElMessage.error("有其他岗位正在投递中")
    return
  }
  uploading.value = true
  // 过滤空数据
  if (formDataWorkExperience.value.length == 1 && formDataWorkExperience.value.at(0)?.company === "")
    // 清空 formDataWorkExperience
    formDataWorkExperience.value = []
  if (formDataEducation.value.length == 1 && formDataEducation.value.at(0)?.school === "")
    // 清空 formDataEducation
    formDataEducation.value = []
  const adapter: Type.Education[] = []

  for (let i = 0; i < formDataWorkExperience.value.length; i++) {
    formDataWorkExperience.value[i].work_time_start = work_time.value[i][0]
    formDataWorkExperience.value[i].work_time_end = work_time.value[i][1]
  }

  for (let i = 0; i < formDataEducation.value.length; i++) {
    if (
      formDataEducation.value[i].graduationTime == null ||
      formDataEducation.value[i].graduationTime == undefined ||
      formDataEducation.value[i].graduationTime === ""
    ) {
      formDataEducation.value[i].graduationTime = "2000-01-01"
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
  formDataPartA.info = formDataUserInfo.value
  if (sex.value == "1" || sex.value == "男") formDataPartA.info.sex = 1

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
const upload = ref<UploadInstance>()

const fileList0 = ref<UploadUserFile[]>([])
const fileList1 = ref<UploadUserFile[]>([])
const fileList2 = ref<UploadUserFile[]>([])
const fileList3 = ref<UploadUserFile[]>([])
const fileList4 = ref<UploadUserFile[]>([])
const fileList5 = ref<UploadUserFile[]>([])
const fileList6 = ref<UploadUserFile[]>([])
const fileIdNum = ref<UploadUserFile>()

const token = useUserStore().token
const myHeaders = new Headers()
myHeaders.append("ngrok-skip-browser-warning", "true")
if (token) {
  myHeaders.append("Authorization", `Bearer ${token}`)
}

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

const handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  if (!uploadFile || !uploadFile.raw) {
    return false
  }

  if (uploadFile.raw.type !== "application/pdf") {
    ElMessage.error("只能上传 doc,docx 或 pdf 格式的文件!")
    removeFile(uploadFile, uploadFiles) // 移除非法文件
    return false
  } else if (uploadFile.raw.size > 5 * 1024 * 1024) {
    ElMessage.error("文件大小必须小于5MB!")
    removeFile(uploadFile, uploadFiles) // 移除非法文件
    return false
  }
  return true
}
const removeFile = (file: UploadFile, fileList: UploadFile[]) => {
  const index = fileList.indexOf(file)
  if (index !== -1) {
    fileList.splice(index, 1)
  }
}

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const showUserFileLoading = ref<boolean>(false)
const showUserFile = (path0: string | undefined) => {
  const path: string = path0 == undefined ? "urlError" : path0
  showUserFileLoading.value = true
  preViewUserFileApi({ path })
    .then((res) => {
      // Determine the file extension
      const fileExtension = path.slice(path.lastIndexOf(".") + 1).toLowerCase()
      if (fileExtension == "pdf") {
        const mimeType = "application/pdf"
        const blob = new Blob([res], { type: mimeType })
        // Handle PDF files: open in a new tab
        const pdfURL = URL.createObjectURL(blob)
        window.open(pdfURL, "_blank")
      } else {
        console.log("Unsupported file type")
      }
    })
    .catch((e) => {
      ElMessage.error("预览用户资历文件服务异常")
      console.log(e)
    })
    .finally(() => {
      showUserFileLoading.value = false
    })
}

onMounted(() => {
  showinfo(props.recruitId, props.code)
})
</script>

<template>
  <el-row justify="center">
    <el-col :span="23">
      <el-row justify="space-evenly">
        <el-col>
          <el-text tag="p" type="danger"> 填报须知：</el-text>
          <el-text tag="p" type="danger">
            <b
              >请报考者认真阅读《招聘公告》后如实准确填写，所选报考岗位必须符合招聘公告相关要求。报考者隐瞒有关情况或提供虚假材料的，取消其考试或聘用资格，并按有关规定严肃处理。</b
            ></el-text
          >
          <el-text tag="p" type="danger">
            <b
              >2.所有上传的佐证材料均应为PDF格式文件，证明材料应真实有效，单个PDF证明文件大小在5M以下,并根据证明材料的内容命名上传。</b
            ></el-text
          >
          <el-text tag="p" type="danger"> <b>3.请在“身份证号码”一栏上传身份证正反面照片的PDF文件。</b></el-text>
          <el-text tag="p" type="danger">
            <b
              >4.教育经历请从专科及以上开始填写，并按照时间专科、本科、研究生、博士的顺序依次填写，并依次上传佐证材料。</b
            ></el-text
          >
          <el-text tag="p" type="danger">
            <b
              >5.专业技术岗位报考还需符合《安徽工商职业学院周转池编制人才标准》对应的要求，详见招聘公告附件2。</b
            ></el-text
          >
          <el-text tag="p" type="danger">
            <b
              >6.如因个人或者资格审查不通过要变更报考岗位，请在我的投递中点击放弃后，再选择符合申报条件的岗位报名。每人限报一个岗位。</b
            ></el-text
          >
          <el-text tag="p" type="danger"
        /></el-col>
      </el-row>
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
              <el-select v-model="formDataUserInfo.married" clearable placeholder="Select" style="width: 240px">
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
              v-model:file-list="fileIdNum"
              ref="upload"
              :action="uploadPath2"
              accept="application/pdf"
              :limit="1"
              :on-exceed="handleExceed"
              :on-change="handleChange"
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
              v-model:file-list="fileList0"
              :action="uploadPath"
              ref="uploadRef0"
              :show-file-list="false"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :on-change="handleChange"
              :headers="myHeaders"
              :data="{
                code: props.code,
                part: 0
              }"
            >
              <el-button type="primary" size="small" plain>上传佐证文件</el-button>
              <template #tip> <div class="el-upload__tip">只能上传PDF</div> </template>
            </el-upload>
            <el-text v-for="(file, index) in fileList0" :key="index">
              {{ file.name }}

              <el-button @click="showUserFile()" :loading="showUserFileLoading" type="" text bg> 查看 </el-button>
              <el-button type="danger" text bg> 删除 </el-button>
            </el-text>
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
        <el-row v-for="(item, index) in formDataWorkExperience" :key="index">
          <el-col :span="6">
            <el-form-item>
              {{ work_time[index] }}
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
              v-model:file-list="fileList1"
              ref="uploadRef1"
              :action="uploadPath"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :on-change="handleChange"
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
              v-model:file-list="fileList2"
              :action="uploadPath"
              ref="uploadRef2"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :on-change="handleChange"
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
              v-model:file-list="fileList3"
              :action="uploadPath"
              ref="uploadRef3"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :on-change="handleChange"
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
              v-model:file-list="fileList4"
              :action="uploadPath"
              ref="uploadRef4"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :on-change="handleChange"
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
              v-model:file-list="fileList5"
              :action="uploadPath"
              ref="uploadRef5"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :on-change="handleChange"
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
              v-model:file-list="fileList6"
              :action="uploadPath"
              ref="uploadRef6"
              :auto-upload="false"
              accept="application/pdf"
              :on-exceed="handleExceed"
              :on-success="handleUploadComplete"
              :on-change="handleChange"
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
