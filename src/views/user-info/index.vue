<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { Lock } from "@element-plus/icons-vue"
import { getUserInfoApi, setRealNameInfoApi, setUserInfoApi, newPwdApi } from "@/api/user-info"
import { UserInfoData } from "@/api/user-info/types/user-info"

defineOptions({
  name: "UserInfo"
})

const loading = ref<boolean>(false)
/** 是否处于编辑模式 */
const isEditing = ref<boolean>(false)
/** 当前用户id,默认0 */
const uid = ref<number>(0)

/** 用户是否实名认证过 */
const infoIntegrity = ref<boolean>(false)
/** 实名认证表单展示 */
const showRealNameMessageBox = ref<boolean>(false)
/** 实名认证正在执行 */
const realNameLoading = ref<boolean>(false)
/** 实名认证表单引用 */
const formRef = ref<FormInstance | null>(null)
/** 实名认证表单值绑定 */
const formData = reactive({
  idnum: "",
  name: ""
})
/** 实名认证表单效验 */
const formRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入岗位名称" }],
  idnum: [
    { required: true, trigger: "blur", message: "请输入身份证号码" },
    {
      pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
      trigger: "blur",
      message: "请输入有效的身份证号码"
    }
    // dsa validator: isChineseIdCard,
  ]
})
const sendRealName = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      realNameLoading.value = true
      setRealNameInfoApi(formData)
        .then(() => {
          ElMessage.success("实名成功")
          infoIntegrity.value = true
          getUserData()
        })
        .catch(() => {})
        .finally(() => {
          showRealNameMessageBox.value = false
          realNameLoading.value = false
        })
    } else {
      ElMessage.error("表单效验不通过")
    }
  })
}

const userinfo = ref<UserInfoData>()
const editedUserinfo = ref<UserInfoData>({
  id: uid.value,
  name: "",
  idnum: "",
  phone: "",
  /** 性别 */
  sex: 1,
  /** 政治面貌 */
  zzmm: "",
  /** 民族 */
  nation: "",
  /** 出生日期 */
  birthday: "",
  /** 籍贯 */
  nativePlace: "",
  /** 现居地址 */
  address: "",
  birthPlace: "",
  /** 电子邮件 */
  email: "",
  /** 婚否 */
  married: "",
  /** 资格证 */
  specialtiesCertificates: ""
})
const sex = ref("")

const getUserData = () => {
  loading.value = true
  getUserInfoApi()
    .then((res) => {
      userinfo.value = res.data.user
      console.log("获取值,又是男?")
      console.log(res.data.user.sex)

      sex.value = res.data.user.sex == 1 ? "男" : "女"
      console.log("结果")
      console.log(sex.value)

      uid.value = res.data.user.id
      canEdit.value = res.data.canEdit
    })

    .catch(() => {
      // 如果获取失败,所有属性设为空
      userinfo.value = {
        id: uid.value,
        name: "",
        idnum: "",
        phone: "",
        sex: 1,
        zzmm: "",
        nation: "",
        birthday: "",
        nativePlace: "",
        address: "",
        birthPlace: "",
        email: "",
        married: "",
        specialtiesCertificates: ""
      }
      ElMessage.error("获取个人信息失败,请重试")
    })
    .finally(() => {
      loading.value = false
    })
}

const canEdit = ref<boolean>(false)
const startEditing = () => {
  if (!canEdit.value) {
    ElMessage.error("有正在投递的岗位,无法修改")
    return
  }
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
  if (sex.value == "男" || sex.value == "1") editedUserinfo.value.sex = 1
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

const newPwdDialog = ref<boolean>(false)
/** 注册表单元素的引用 */
const pwdFormRef = ref<FormInstance | null>(null)
/** 注册表单数据 */
const pwdFormData = reactive({
  oldpassword: "",
  password: "",
  confirmPassword: ""
})
/** 确认密码校验规则 */
const validatePassword2 = (rule: any, value: string, callback: Function) => {
  console.log("xiaoyshengxiao")
  if (value !== pwdFormData.password) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

/** 注册表单校验规则 */
const pwdFormRules: FormRules = {
  oldpassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    { validator: validatePassword2, message: "密码不同", trigger: "blur" }
  ]
}
const newPwd = () => {
  pwdFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      newPwdDialog.value = true
      newPwdApi({ oldPwd: pwdFormData.oldpassword, newPwd: pwdFormData.password })
        .then(() => {
          ElMessage.success("修改成功")
        })
        .catch(() => {
          ElMessage.error("修改失败,请重试")
        })
        .finally(() => {
          newPwdDialog.value = false
        })
    } else {
      console.log("formError表单数据错误")
      console.log(fields)
    }
  })
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
              <el-button @click="newPwdDialog = true">修改密码</el-button>
            </div>
          </template>

          <el-descriptions-item label="用户名" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.name }}</template>
            <template v-else> <el-input v-model="editedUserinfo.name" /> </template>
          </el-descriptions-item>
          <el-descriptions-item label="性别" label-align="center" align="left">
            <template v-if="!isEditing">{{ sex }}</template>
            <template v-else>
              <el-select id="usersex" v-model="sex">
                <el-option label="男" :value="1" />
                <el-option label="女" :value="2" />
              </el-select> </template
          ></el-descriptions-item>
          <el-descriptions-item label="婚否" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.married }}</template>
            <template v-else>
              <el-select id="married" v-model="editedUserinfo.married">
                <el-option label="未婚" :value="0" />
                <el-option label="已婚" :value="1" />
              </el-select> </template
          ></el-descriptions-item>
          <el-descriptions-item label="出生地" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.birthPlace }}</template>
            <template v-else>
              <el-input id="birthPlace" v-model="editedUserinfo.birthPlace" />
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="政治面貌" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.zzmm }}</template>
            <template v-else>
              <el-input id="userzzmm" v-model="editedUserinfo.zzmm" />
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="户口所在地" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.nativePlace }}</template>
            <template v-else> <el-input v-model="editedUserinfo.nativePlace" /> </template
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
          <el-descriptions-item label="电子邮件" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.email }}</template>
            <template v-else> <el-input v-model="editedUserinfo.email" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="曾获何种专业证书，有何特长" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.specialtiesCertificates }}</template>
            <template v-else> <el-input type="textarea" v-model="editedUserinfo.specialtiesCertificates" /> </template
          ></el-descriptions-item>
          <el-descriptions-item label="身份证号码" label-align="center" align="left">
            <template v-if="!isEditing && userinfo?.idnum">{{ userinfo.idnum }}</template>
            <template v-else-if="!isEditing && !userinfo?.idnum">
              <el-button @click="showRealNameMessageBox = true">实名认证</el-button>
            </template>
            <template v-else>
              <el-tooltip class="box-item" content="身份证号不可修改" placement="top">
                {{ userinfo?.idnum }}
              </el-tooltip>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="手机号" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.phone }}</template>
            <template v-else>
              <el-tooltip class="box-item" content="手机号暂不支持修改" placement="top">
                {{ editedUserinfo.phone }}
              </el-tooltip>
            </template></el-descriptions-item
          >
          <el-descriptions-item label="家庭详细地址" :span="2" label-align="center" align="left">
            <template v-if="!isEditing">{{ userinfo?.address }}</template>
            <template v-else> <el-input v-model="editedUserinfo.address" /> </template
          ></el-descriptions-item>
        </el-descriptions>
        <el-text v-if="isEditing" tag="p" type="warning">编辑完成请及时保存</el-text>
      </div>
      <div class="pager-wrapper">
        <!-- Pagination code here -->
      </div>
    </el-card>
    <el-dialog v-model="showRealNameMessageBox" title="开始投递前,请先进行实名认证" width="30%">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="name" label="姓名">
          <el-input v-model.trim="formData.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item prop="idnum" label="身份证号码">
          <el-input v-model.trim="formData.idnum" placeholder="请输入身份证号" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRealNameMessageBox = false">取消</el-button>
          <el-button type="primary" @click="sendRealName()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="newPwdDialog" title="修改密码" width="30%">
      <el-form ref="pwdFormRef" :model="pwdFormData" :rules="pwdFormRules" label-width="100px" label-position="left">
        <el-form-item prop="oldpassword" label="旧密码">
          <el-input v-model.trim="pwdFormData.oldpassword" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item prop="password" label="新密码">
          <el-input
            v-model.trim="pwdFormData.password"
            placeholder="请输入新密码"
            type="password"
            tabindex="2"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item prop="confirmPassword" label="确认密码">
          <el-input
            v-model.trim="pwdFormData.confirmPassword"
            placeholder="请确认密码"
            type="password"
            tabindex="2"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="newPwdDialog = false">取消</el-button>
          <el-button type="primary" @click="newPwd()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
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
