<script lang="ts" setup>
import { defineProps, ref } from "vue"
import { GetPositionData } from "@/api/user-batch/types/user-batch"
import { ElMessage, UploadProps, UploadUserFile } from "element-plus"
import { submitThingApi } from "@/api/user-thing"
// import { setUserInfoRequestData } from "@/api/user-thing/types/user-thing"
import { useUserStore } from "@/store/modules/user"

defineOptions({
  name: "JobBatchItem"
})

/** 详情对话框是否可视 */
const dialogFormVisible = ref(false)

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
    rawFile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    ElMessage.error("只能上传 DOCX 格式的文件!")
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
</script>

<template>
  <div>
    <el-card class="position-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="head-title">{{ props.position.jobTitle }}</span>
          <el-button class="button" text @click="dialogFormVisible = true">投递</el-button>
          <el-dialog v-model="dialogFormVisible" title="投递岗位">
            <el-card>
              <el-text size="large" tag="p">
                您正在投递我校 <strong> {{ position.department }} </strong> 的
                <strong>{{ props.position.jobTitle }} </strong>
                职位 我们不会索要你的其他隐私,请您注意甄别违法、虚假、高风险招聘信息，警惕索要隐私信息的行为。
              </el-text>
            </el-card>
            <br />
            <el-card>
              <template #header>
                <el-text tag="p"> 请核对个人信息并上传相关资历文件 </el-text>
                <el-text size="large" tag="p"> 照片/图片: </el-text>
                <el-text type="warning" tag="p"> 最多5个文件,多余的将被覆盖 </el-text>
                <el-text type="warning" tag="p"> 文件大小必须小于 2mb </el-text>
                <el-text type="danger" tag="p"> 请勿上传虚假信息 </el-text>
              </template>
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
            </el-card>
            <br />
            <el-card>
              <template #header>
                <el-text tag="p"> 请核对个人信息并上传相关资历文件 </el-text>
                <el-text size="large"> PDF或world: </el-text>
                <el-text type="warning" tag="p"> 最多5个文件,多余的将被覆盖 </el-text>
                <el-text type="warning" tag="p"> 文件大小必须小于 2mb </el-text>
                <el-text type="danger" tag="p"> 请勿上传虚假信息 </el-text>
              </template>
              <!-- action="https://supposedly-credible-cougar.ngrok-free.app/Recruit/api/resume" -->
              <!-- "api/resume" -->
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
                  <div class="el-upload__tip">文件大小必须小于 500kb</div>
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
      <div>
        <el-text>所属部门:{{ position.department }}</el-text>
        <br />
        <el-text>学历要求:{{ position.degree }}</el-text>
        <br />
        <el-text>详细信息:{{ position.info }}</el-text>
      </div>
    </el-card>
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
