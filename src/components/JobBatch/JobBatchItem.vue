<script lang="ts" setup>
import { defineProps, reactive, ref } from "vue"
import { GetPositionData } from "@/api/user-batch/types/user-batch"
import { ElMessage, UploadProps, UploadUserFile } from "element-plus"
import { submitThingApi } from "@/api/user-thing"

const dialogFormVisible = ref(false)
const formLabelWidth = "140px"

const props = defineProps<{
  position: GetPositionData
}>()

defineOptions({
  name: "JobBatchItem"
})
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
})

const dialogImageUrl = ref("")
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

const fileimgList = ref<UploadUserFile[]>([])
const fileList = ref<UploadUserFile[]>([])

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
  console.log("用户投了" + id)
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
const headers = {
  "ngrok-skip-browser-warning": "123"
}
</script>

<template>
  <div>
    <el-card class="position-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="head-title">{{ props.position.jobTitle }}</span>
          <el-button class="button" text @click="dialogFormVisible = true">投递</el-button>
          <el-dialog v-model="dialogFormVisible" title="Shipping address">
            <el-form :model="form">
              <el-form-item label="Promotion name" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
              </el-form-item>
              <el-form-item label="Zones" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="Please select a zone">
                  <el-option label="Zone No.1" value="shanghai" />
                  <el-option label="Zone No.2" value="beijing" />
                </el-select>
              </el-form-item>
            </el-form>
            <el-text size="large" tag="p">
              您正在投递我校 {{ position.department }} 的 {{ props.position.jobTitle }} 职位
              我们不会索要你的其他隐私,请您注意甄别违法、虚假、高风险招聘信息，警惕索要隐私信息的行为。
            </el-text>
            <el-text tag="p"> 请核对个人信息并上传相关文件 </el-text>
            <el-text type="warning" tag="p"> 最多5个文件,多余的将被覆盖 </el-text>
            <el-text type="warning" tag="p"> 文件大小必须小于 2mb </el-text>
            <el-text type="danger" tag="p"> 请勿上传虚假信息 </el-text>
            <el-text size="large" tag="p"> 图片: </el-text>
            <el-upload
              v-model:file-list="fileimgList"
              action="https://supposedly-credible-cougar.ngrok-free.app/Recruit/api/resume"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="handleImgChange"
              :on-success="updateImgSuccess"
              :before-upload="beforeImgUpload"
              :headers="headers"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <el-text size="large"> PDF或world: </el-text>

            <!-- action="https://supposedly-credible-cougar.ngrok-free.app/Recruit/api/resume" -->
            <el-upload
              v-model:file-list="fileList"
              class="upload-demo"
              action="https://supposedly-credible-cougar.ngrok-free.app/Recruit/api/resume"
              :headers="headers"
              :on-change="handleChange"
              :on-success="updateSuccess"
              :before-upload="beforeFileUpload"
            >
              <el-button type="primary">选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip">文件大小必须小于 500kb</div>
              </template>
            </el-upload>

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