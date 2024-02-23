<script lang="ts" setup>
import { defineProps, ref } from "vue"
import { GetPositionData } from "@/api/user-batch/types/user-batch"
import { ElMessage, UploadProps, UploadUserFile } from "element-plus"
import { submitThingApi } from "@/api/user-thing"
// import { setUserInfoRequestData } from "@/api/user-thing/types/user-thing"
import { useUserStore } from "@/store/modules/user"
import { UserInfoData } from "@/api/user-info/types/user-info"
import { getUserInfoApi, setUserInfoApi } from "@/api/user-info"

defineOptions({
  name: "JobBatchItem"
})

// 学历计算属性
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
    default:
      return "未知"
  }
}

/** 详情对话框是否可视 */
const dialogFormVisible = ref(false)

const loading = ref<boolean>(false)

/** 用户图片文件列表 */
const fileimgList = ref<UploadUserFile[]>([])
/** 用户文件列表 */
const fileList = ref<UploadUserFile[]>([])

const props = defineProps<{
  position: GetPositionData
  batchid: number
}>()

const formDataImg = new FormData()
formDataImg.append("isImg", "1")
formDataImg.append("batchname", String(props.batchid))
formDataImg.append("department", String(props.position.departmentId))
formDataImg.append("jobTitle", String(props.position.id))

const formDataFile = new FormData()
formDataFile.append("isImg", "0")
formDataFile.append("batchname", String(props.batchid))
formDataFile.append("department", String(props.position.departmentId))
formDataFile.append("jobTitle", String(props.position.id))
const token = useUserStore().token
//  getToken()
const myHeaders = new Headers()
myHeaders.append("ngrok-skip-browser-warning", "true")
if (token) {
  myHeaders.append("Authorization", `Bearer ${token}`)
}
//
// const uploadPath = "https://supposedly-credible-cougar.ngrok-free.app/Recruit/api/resume"
const uploadPath = "api/resume"

/** 上传时图片预览链接 */
const dialogImageUrl = ref("")
/** 上传时图片预览框 */
const dialogVisible = ref(false)

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const updateSuccess: UploadProps["onSuccess"] = (uploadFile) => {
  ElMessage.success(uploadFile.message)
}

const updateImgSuccess: UploadProps["onSuccess"] = (uploadFile) => {
  console.log(uploadFile)
  ElMessage.success(uploadFile.message)
}

const beforeImgUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    console.log("上传时:批次id" + props.batchid)
    ElMessage.error("只能上传 JPG 或 PNG 格式的图片!")
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("文件大小必须小于2MB!")
    return false
  }
  console.log(rawFile.name + "开始上传")
  ElMessage.info(rawFile.name + " 开始上传")
  return true
}

const beforeFileUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (
    rawFile.type !== "application/msword" &&
    rawFile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
    rawFile.type !== "application/pdf"
  ) {
    ElMessage.error("只能上传 doc,docx 或 pdf 格式的文件!")
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("文件大小必须小于2MB!")
    return false
  }
  console.log(rawFile.name + "开始上传")
  ElMessage.info(rawFile.name + " 开始上传")
  return true
}

const handleImgChange: UploadProps["onChange"] = () => {
  /** 最多5个文件,多余的将被覆盖 */
  fileimgList.value = fileimgList.value.slice(-5)
  console.log("fileImg List" + fileimgList.value)
}

const handleChange: UploadProps["onChange"] = () => {
  /** 最多5个文件,多余的将被覆盖 */
  fileList.value = fileList.value.slice(-5)
  console.log("fileList" + fileList.value)
}

const readyToSubmit = () => {
  dialogFormVisible.value = true
  getUserData()
}

const submit = (id: number) => {
  dialogFormVisible.value = false
  // loading.value = true
  submitThingApi({ recruitId: id })
    .then(() => {
      ElMessage.success("投递成功")
    })
    .catch(() => {
      ElMessage.error("发生异常,请重试")
    })
    .finally(() => {
      // loading.value = false
    })
}

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
</script>

<template>
  <div>
    <el-card class="position-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="head-title">{{ props.position.jobTitle }}</span>
          <el-button class="button" text @click="readyToSubmit()">投递</el-button>
        </div>
      </template>
      <div>
        <el-text tag="p">所属部门:{{ position.department }}</el-text>
        <el-text tag="p">学历要求:{{ getDegreeLabel(position.degree) }}</el-text>
        <el-text tag="p">详细信息:{{ position.info }}</el-text>
        <el-text tag="p">其他要求:{{ position.require }}</el-text>
      </div> </el-card
    ><el-dialog v-loadin="loading" v-model="dialogFormVisible" width="90%">
      <template #header>
        <el-text size="large" tag="p">
          您正在投递我校 <strong> {{ position.department }} </strong> 的
          <strong>{{ props.position.jobTitle }} </strong>
          职位 我们不会索要你的其他隐私,请您注意甄别违法、虚假、高风险招聘信息，警惕索要隐私信息的行为。
        </el-text>
      </template>
      <el-card>
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
              <template v-if="!isEditing">{{ userinfo?.zzmm }}</template>
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
              <template v-else>
                <el-date-picker
                  v-model="editedUserinfo.graduation_time"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                /> </template
            ></el-descriptions-item>
            <el-descriptions-item label="专业" label-align="center" align="left">
              <template v-if="!isEditing">{{ userinfo?.specialty }}</template>
              <template v-else> <el-input v-model="editedUserinfo.specialty" /> </template
            ></el-descriptions-item>
            <el-descriptions-item label="身份证号码" label-align="center" align="left">
              <template v-if="!isEditing && userinfo?.idnum">{{ userinfo.idnum }}</template>
              <template v-else>
                <el-tooltip class="box-item" content="身份证号不可修改" placement="top">
                  {{ userinfo?.idnum }}
                </el-tooltip>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="手机号" label-align="center" align="left">
              <template v-if="!isEditing">{{ userinfo?.tel }}</template>
              <template v-else>
                <el-tooltip class="box-item" content="手机号暂不支持修改" placement="top">
                  {{ editedUserinfo.tel }}
                </el-tooltip>
              </template></el-descriptions-item
            >
            <el-descriptions-item label="现居地址" :span="2" label-align="center" align="left">
              <template v-if="!isEditing">{{ userinfo?.address }}</template>
              <template v-else> <el-input v-model="editedUserinfo.address" /> </template
            ></el-descriptions-item>
          </el-descriptions>
        </div>
        <el-divider />
        <el-text tag="p"> 请核对个人信息并上传相关资历文件 </el-text>
        <el-text size="large" tag="p"> 照片/图片: </el-text>
        <el-text type="warning" tag="p"> 最多5个文件,多余的将被覆盖 </el-text>
        <el-text type="warning" tag="p"> 文件大小必须小于 2mb </el-text>
        <el-text type="danger" tag="p"> 请勿上传虚假信息 </el-text>

        <el-text size="large" tag="p"> 照片或图片: </el-text>
        <el-upload
          v-model:file-list="fileimgList"
          :action="uploadPath"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="handleImgChange"
          :on-success="updateImgSuccess"
          :before-upload="beforeImgUpload"
          :headers="myHeaders"
          :data="{
            isImg: 1,
            batchname: props.batchid,
            department: props.position.departmentId,
            jobTitle: props.position.id
          }"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <br />
        <el-text size="large" tag="p"> pdf或word: </el-text>
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          :action="uploadPath"
          :headers="myHeaders"
          :data="{
            isImg: 0,
            batchname: props.batchid,
            department: props.position.departmentId,
            jobTitle: props.position.id
          }"
          :on-change="handleChange"
          :on-success="updateSuccess"
          :before-upload="beforeFileUpload"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">文件大小必须小于 2MB</div>
          </template>
        </el-upload>
      </el-card>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="submit(position.recruitId)"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.position-card {
  margin-bottom: 0.4em;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .card-header {
      tab-size: 1.5em;
    }
  }
}
</style>
