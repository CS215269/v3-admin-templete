<script lang="ts" setup>
import { defineComponent, reactive, ref } from "vue"
import { Delete } from "@element-plus/icons-vue"
import { ElMessage, UploadInstance, UploadProps, UploadRawFile, genFileId } from "element-plus"
import { setDegree, setEducation } from "@/utils/degree"
import type * as Type from "./data"
import { submitJobApplicationPartA, submitJobApplicationPartB, submitJobApplicationPartC } from "@/api/user-batch"

defineComponent({
  name: "ReviewForm"
})

const formDataUserInfo = reactive<Type.UserInfo>({
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
  native_place: "",
  address: "",
  specialtiesCertificates: ""
})

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
  work_time.value.push("")
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
  formDataWorkExperience.value.push({
    id: formDataWorkExperience.value.length,
    company: "",
    work_time_start: "",
    work_time_end: "",
    position: ""
  })
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
    type: 0,
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
    type: 0,
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

const submitStatus = ref<boolean>(true)
const formDataPartA = reactive<Type.FormDataPartA>({
  code: "111",
  info: formDataUserInfo,
  education: [],
  workExperience: []
})
const formDataPartB = reactive<Type.FormDataPartB>({
  paper: formDataPaper.value,
  project: formDataProject0.value.concat(formDataProject1.value, formDataProject2.value)
})
const formDataPartC = reactive<Type.FormDataPartC>({
  research: formDataResearch.value,
  awardsAndPunishments: awardsAndPunishments.value,
  family: formDataFamilyConnections.value,
  note: note.value
})
const submit = () => {
  const adapter: Type.Education[] = []
  for (let i = 0; i < formDataEducation.value.length; i++) {
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
    const element = work_time.value[i]
    formDataWorkExperience.value[i].work_time_start = element[0]
    formDataWorkExperience.value[i].work_time_end = element[1]
  }
  formDataPartA.education = adapter
  formDataPartA.workExperience = formDataWorkExperience.value
  submitJobApplicationPartA(formDataPartA)
    .then(() => {
      ElMessage.success("OK01")
    })
    .catch((e) => {
      submitStatus.value = false
      ElMessage.error(e)
    })
    .finally(() => {
      if (submitStatus.value) {
        submitB()
      }
    })
}
const submitB = () => {
  submitJobApplicationPartB(formDataPartB)
    .then(() => {})
    .catch((e) => {
      submitStatus.value = false
      ElMessage.error(e)
    })
    .finally(() => {
      if (submitStatus.value) {
        submitC()
      }
    })
}
const submitC = () => {
  submitJobApplicationPartC(formDataPartC)
    .then(() => {})
    .catch((e) => {
      submitStatus.value = false
      ElMessage.error(e)
    })
    .finally(() => {
      if (submitStatus.value) {
        ElMessage.success("提交成功")
      }
    })
}
// const fileList = ref<UploadUserFile[]>([
//   {
//     id: "1",
//     name: "element-plus-logo.svg",
//     url: "https://element-plus.org/images/element-plus-logo.svg"
//   },
//   {
//     id: "2",
//     name: "element-plus-logo2.svg",
//     url: "https://element-plus.org/images/element-plus-logo.svg"
//   }
// ])

// const uploadRef = ref<UploadInstance>()

// const submitUpload = () => {
//   uploadRef.value!.submit()
// }
const upload = ref<UploadInstance>()

// const setUploadRef = (el, index: number) => {
//   uploads.value[index] = el
// }

const beforeFileUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "application/pdf") {
    ElMessage.error("只能上传 doc,docx 或 pdf 格式的文件!")
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("文件大小必须小于2MB!")
    return false
  }
  console.log(rawFile.name + "开始上传")
  ElMessage.info(rawFile.name + " 开始上传")
  return true
}

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

// defineExpose(submit())
</script>

<template>
  <el-row justify="center">
    <el-col :span="23">
      <el-row justify="center">
        <el-text tag="p" size="large"><b>基础信息</b></el-text>
      </el-row>
      <el-form>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input v-model="formDataUserInfo.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别">
              <el-select v-model="formDataUserInfo.sex" clearable placeholder="Select" style="width: 240px">
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
            <el-form-item label="电话">
              <el-input v-model="formDataUserInfo.phone" />
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
                <el-option label="未婚" :value="0" />
                <el-option label="已婚" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="身份证号码">
              <el-input v-model="formDataUserInfo.idnum" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="户口所在地（应届毕业生填入学前的）">
              <el-input
                v-model="formDataUserInfo.native_place"
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
              ref="upload"
              :auto-upload="false"
              accept="application/pdf"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :before-upload="beforeFileUpload"
              :limit="1"
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
              ref="upload02"
              :auto-upload="false"
              accept="application/pdf"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :before-upload="beforeFileUpload"
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
              ref="upload"
              :auto-upload="false"
              accept="application/pdf"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :before-upload="beforeFileUpload"
              :limit="1"
              :data="{
                id: 33
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
              ref="upload"
              :auto-upload="false"
              accept="application/pdf"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :before-upload="beforeFileUpload"
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
              ref="upload"
              :auto-upload="false"
              accept="application/pdf"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :before-upload="beforeFileUpload"
              :limit="1"
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
              ref="upload"
              :auto-upload="false"
              accept="application/pdf"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :before-upload="beforeFileUpload"
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
              ref="upload"
              :auto-upload="false"
              accept="application/pdf"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :before-upload="beforeFileUpload"
              :limit="1"
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
        <el-row justify="space-evenly">
          <el-col :span="20" />
          <el-col :span="4"> <el-button type="warning" size="large" plain @click="submit()">提交</el-button> </el-col>
        </el-row>
      </el-form>
    </el-col>
  </el-row>
</template>
<style>
.el-col {
  text-align: center;
  padding: 0.5em 0.3em;
  outline: transparent 1px solid;
}
/* 定制上传组件*/
.el-upload-listc {
  /* 定制上传组件 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60%; /* 设置文件项的宽度 */
}
.custom-file-itemc {
  overflow: hidden; /* 避免文件名过长溢出 */
  text-overflow: ellipsis; /* 文本溢出时显示省略号 */
  white-space: nowrap; /* 文本不换行 */
}
</style>
