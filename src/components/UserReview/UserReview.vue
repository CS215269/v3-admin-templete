<script lang="ts" setup>
import { defineComponent, ref, onMounted } from "vue"
import * as Type from "./type/data"
import { getThingInfoApi, preViewUserFileApi } from "./api"
import { ElMessage } from "element-plus"
import { getDegree, getEducation } from "@/utils/degree"

defineComponent({
  name: "UserReview"
})

const props = defineProps<{
  thingId: number
  code: string
}>()

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

const formDataEducation = ref<Type.Education[]>([
  {
    id: 0,
    school: "",
    graduationTime: "",
    degree: 0,
    education: 0,
    specialty: ""
  }
])

const formDataWorkExperience = ref<Type.WorkExperience[]>([
  {
    id: 0,
    company: "",
    work_time_start: "",
    work_time_end: "",
    position: ""
  }
])

const formDataPaper = ref<Type.Paper[]>([
  {
    id: 0,
    journal: "",
    title: "",
    time: "",
    journal_num: ""
  }
])

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

const formDataResearch = ref<Type.Research[]>([
  {
    id: 0,
    name: ""
  }
])

const awardsAndPunishments = ref<string>("")

const formDataFamilyConnections = ref<Type.FamilyConnections[]>([
  {
    name: "",
    connection: "",
    work: ""
  }
])

const note = ref<string>("")

const qualificationResult = ref<string>("")

const fileList0 = ref<string[]>([])
const fileList1 = ref<string[]>([])
const fileList2 = ref<string[]>([])
const fileList3 = ref<string[]>([])
const fileList4 = ref<string[]>([])
const fileList5 = ref<string[]>([])
const fileList6 = ref<string[]>([])

const fileListIDPhoto = ref<string>("")

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
      console.log("身份证1" + fileListIDPhoto.value)
      qualificationResult.value = res.data.qualificationResult
      console.log("拒绝理由" + qualificationResult.value)
      console.log("身份证2" + fileListIDPhoto.value)
      awardsAndPunishments.value = res.data.awardsAndPunishments
      if (res.data.file0 != null) fileList0.value = res.data.file0.reverse()
      if (res.data.file1 != null) fileList1.value = res.data.file1.reverse()
      if (res.data.file2 != null) fileList2.value = res.data.file2.reverse()
      if (res.data.file3 != null) fileList3.value = res.data.file3.reverse()
      if (res.data.file4 != null) fileList4.value = res.data.file4.reverse()
      if (res.data.file5 != null) fileList5.value = res.data.file5.reverse()
      if (res.data.file6 != null) fileList6.value = res.data.file6.reverse()
      if (res.data.IDPhoto != null) fileListIDPhoto.value = res.data.IDPhoto
      console.log("身份证3" + fileListIDPhoto.value)
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
}

const showUserFileLoading = ref<boolean>(false)
const showUserFile = (path: string) => {
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
        console.log("不支持的文件类型")
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
  showinfo(props.thingId, props.code)
})
</script>

<template>
  <el-card :loading="loading">
    <el-row justify="center">
      <el-col :span="23">
        <el-row justify="center">
          <el-text tag="p" size="large"><b>基础信息</b></el-text>
        </el-row>
        <el-form ref="ruleFormRef" status-icon>
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-text>{{ formDataUserInfo.name }}</el-text>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别"
                ><el-text>{{ formDataUserInfo.sex == 1 ? "男" : "女" }}</el-text>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期">
                <el-text>{{ formDataUserInfo.birthday }}</el-text>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="出生地">
                <el-text>{{ formDataUserInfo.birthPlace }}</el-text>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="民族">
                <el-text>{{ formDataUserInfo.nation }}</el-text>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="政治面貌">
                <el-text>{{ formDataUserInfo.zzmm }}</el-text>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="电话" prop="phone">
                <el-text>{{ formDataUserInfo.phone }}</el-text>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电子邮箱">
                <el-text>{{ formDataUserInfo.email }}</el-text>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="婚否">
                <el-text>{{ formDataUserInfo.married }}</el-text>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="身份证号码" prop="idnum">
                <el-text>{{ formDataUserInfo.idnum }}</el-text>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-text tag="p" style="margin-bottom: 20px">
                {{ fileListIDPhoto.split("/").slice(-1) }}
              </el-text>
              <el-button @click="showUserFile(fileListIDPhoto)" :loading="showUserFileLoading">查看</el-button>
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
                <el-text>{{ formDataUserInfo.address }}</el-text>
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
          <el-row v-for="(item, index) in formDataEducation" :key="index">
            <el-col :span="4">
              <el-text>{{ getEducation(item.education) }}</el-text>
            </el-col>
            <el-col :span="4">
              <el-text>{{ getDegree(item.degree) }}</el-text>
            </el-col>
            <el-col :span="6">
              <el-space>
                <el-form-item
                  ><el-text>{{ item.school }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
            <el-col :span="5"
              ><el-text>{{ item.specialty }}</el-text></el-col
            >
            <el-col :span="4">
              <el-form-item>
                <el-text>{{ item.graduationTime }}</el-text>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row justify="space-evenly">
            <el-col :span="12">
              <el-row v-for="url in fileList0" :key="url">
                <el-col :span="24">
                  <el-text tag="p" style="margin-bottom: 20px">
                    {{ url.split("/").slice(-1) }}
                  </el-text>
                  <el-button @click="showUserFile(url)" :loading="showUserFileLoading">查看</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" v-if="formDataEducation.length == 0"><el-text> 暂无记录 </el-text></el-col>
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
                <el-text>{{ item.work_time_start + "到" + item.work_time_end }}</el-text>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.company }}</el-text>
                </el-form-item>
              </el-space></el-col
            >
            <el-col :span="8">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.position }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
          </el-row>
          <el-row justify="space-evenly">
            <el-col :span="12">
              <!-- ref="setUploadRef" -->
              <el-row v-for="url in fileList1" :key="url">
                <el-col :span="24">
                  <el-text tag="p" style="margin-bottom: 20px">
                    {{ url.split("/").slice(-1) }}
                  </el-text>
                  <el-button @click="showUserFile(url)" :loading="showUserFileLoading">查看</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" v-if="formDataWorkExperience.length == 0"><el-text> 暂无记录 </el-text></el-col>
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
          <el-row v-for="(item, index) in formDataPaper" :key="index">
            <el-col :span="5">
              <el-space>
                <el-form-item
                  ><el-text>{{ item.journal }}</el-text>
                </el-form-item>
              </el-space></el-col
            >
            <el-col :span="10">
              <el-space>
                <el-form-item
                  ><el-text>{{ item.title }}</el-text>
                </el-form-item>
              </el-space></el-col
            >
            <el-col :span="4">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.time }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
            <el-col :span="4">
              <el-space>
                <el-form-item
                  ><el-text>{{ item.journal_num }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
          </el-row>
          <el-row justify="space-evenly">
            <el-col :span="12">
              <el-row v-for="url in fileList2" :key="url">
                <el-col :span="24">
                  <el-text tag="p" style="margin-bottom: 20px">
                    {{ url.split("/").slice(-1) }}
                  </el-text>
                  <el-button @click="showUserFile(url)" :loading="showUserFileLoading">查看</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" v-if="formDataPaper.length == 0"><el-text> 暂无记录 </el-text></el-col>
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
          <el-row v-for="(item, index) in formDataProject0" :key="index">
            <el-col :span="5">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.time }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
            <el-col :span="10">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.title }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
            <el-col :span="4">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.level }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
            <el-col :span="4">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.rank }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
          </el-row>
          <el-row justify="space-evenly">
            <el-col :span="12">
              <el-row v-for="url in fileList3" :key="url">
                <el-col :span="24">
                  <el-text tag="p" style="margin-bottom: 20px">
                    {{ url.split("/").slice(-1) }}
                  </el-text>
                  <el-button @click="showUserFile(url)" :loading="showUserFileLoading">查看</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" v-if="formDataProject0.length == 0"><el-text> 暂无记录 </el-text></el-col>
          </el-row>
          <el-row justify="center">
            <el-divider border-style="dashed" />
            <el-text tag="p" size="large"> 4.教学成果奖或教学竞赛奖励 </el-text>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-space><el-text> 获奖时间 </el-text> </el-space></el-col
            >
            <el-col :span="10">
              <el-space><el-text> 获奖类型 </el-text> </el-space></el-col
            >
            <el-col :span="4">
              <el-space><el-text> 级别 </el-text> </el-space></el-col
            >
            <el-col :span="4">
              <el-space><el-text> 排名 </el-text> </el-space></el-col
            >
          </el-row>
          <el-row v-for="(item, index) in formDataProject1" :key="index">
            <el-col :span="5">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.time }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
            <el-col :span="10">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.title }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
            <el-col :span="4">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.level }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
            <el-col :span="4">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.rank }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
          </el-row>
          <el-row justify="space-evenly">
            <el-col :span="12">
              <el-row v-for="url in fileList4" :key="url">
                <el-col :span="24">
                  <el-text tag="p" style="margin-bottom: 20px">
                    {{ url.split("/").slice(-1) }}
                  </el-text>
                  <el-button @click="showUserFile(url)" :loading="showUserFileLoading">查看</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" v-if="formDataProject1.length == 0"><el-text> 暂无记录 </el-text></el-col>
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
          <el-row v-for="(item, index) in formDataProject2" :key="index">
            <el-col :span="5">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.time }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
            <el-col :span="10">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.title }}</el-text></el-form-item
                >
              </el-space>
            </el-col>
            <el-col :span="4">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.level }}</el-text>
                </el-form-item>
              </el-space></el-col
            >
            <el-col :span="4">
              <el-space>
                <el-form-item>
                  <el-text>{{ item.rank }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
          </el-row>
          <el-row justify="space-evenly">
            <el-col :span="12">
              <el-row v-for="url in fileList5" :key="url">
                <el-col :span="24">
                  <el-text tag="p" style="margin-bottom: 20px">
                    {{ url.split("/").slice(-1) }}
                  </el-text>
                  <el-button @click="showUserFile(url)" :loading="showUserFileLoading">查看</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" v-if="formDataProject2.length == 0"><el-text> 暂无记录 </el-text></el-col>
          </el-row>
          <el-row justify="center">
            <el-divider border-style="dashed" />
            <el-text tag="p" size="large"> 6.成果推广 </el-text>
          </el-row>
          <el-row>
            <el-col :span="24"><el-text> 成果说明 </el-text></el-col>
          </el-row>
          <el-row v-if="formDataResearch.length == 0" justify="space-evenly">
            <el-text> 暂无数据 </el-text>
          </el-row>
          <el-row v-else v-for="(item, index) in formDataResearch" :key="index">
            <el-col :span="23">
              <el-form-item>
                <el-text>{{ item.name }}</el-text>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-row v-for="url in fileList6" :key="url">
                <el-col :span="24">
                  <el-text tag="p" style="margin-bottom: 20px">
                    {{ url.split("/").slice(-1) }}
                  </el-text>
                  <el-button @click="showUserFile(url)" :loading="showUserFileLoading">查看</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" v-if="formDataResearch.length == 0"><el-text> 暂无记录 </el-text></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"
              ><el-form-item label="所受奖惩情况">
                <el-text tag="p">{{ awardsAndPunishments }}</el-text>
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
          <el-row v-for="(item, index) in formDataFamilyConnections" :key="index">
            <el-col :span="4">
              <el-space>
                <el-form-item
                  ><el-text>{{ item.name }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
            <el-col :span="4">
              <el-space>
                <el-form-item
                  ><el-text>{{ item.connection }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
            <el-col :span="15">
              <el-space>
                <el-form-item
                  ><el-text>{{ item.work }}</el-text>
                </el-form-item>
              </el-space>
            </el-col>
          </el-row>
          <el-row justify="space-evenly">
            <el-col :span="24" v-if="formDataFamilyConnections.length == 0"><el-text> 暂无记录 </el-text></el-col>
            <el-col :span="24" v-else />
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-text tag="p">备注:{{ note }}</el-text>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
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
./type/data
