<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { ElMessage, type FormInstance, type FormRules } from "element-plus"
import { Lock, Phone } from "@element-plus/icons-vue"
// Key,
// import { getRegisterCodeApi } from "@/api/register"
import { type RegisterRequestData } from "@/api/register/types/register"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import { canRegisterApi } from "@/api/register"

const router = useRouter()

/** 注册表单元素的引用 */
const registerFormRef = ref<FormInstance | null>(null)
/** 注册按钮 Loading */
const loading = ref(false)
/** 注册表单数据 */
const registerFormData: RegisterRequestData = reactive({
  // password: "12345678",
  // confirmPassword: "1234567",
  // phone: "17756800661",
  // code: "it1knq"
  password: "",
  confirmPassword: "",
  phone: "",
  code: ""
})
/** 确认密码校验规则 */
const validatePassword2 = (rule: any, value: string, callback: Function) => {
  if (value !== registerFormData.password) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

/** 注册表单校验规则 */
const registerFormRules: FormRules = {
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    { validator: validatePassword2, message: "密码不同", trigger: "blur" }
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/, message: "手机号格式不正确", trigger: "blur" }
  ]
  // code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
}
/** 注册逻辑 */
const handleRegister = () => {
  registerFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .register(registerFormData)
        .then(() => {
          router.push({ path: "/" })
        })
        .catch(() => {
          registerFormData.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.error("表单校验不通过", fields)
      ElMessage.error("表单校验不通过")
    }
  })
}

const canRegister = ref(true)
/** 查询能否注册 */
const canRegisterHandler = () => {
  canRegisterApi()
    .then((res) => {
      if (res.data == 0) {
        canRegister.value = false
        ElMessage.error("注册功能已经关闭")
      }
    })
    .catch(() => {
      canRegister.value = false
      ElMessage.error("注册系统异常,请联系管理员")
    })
}

onMounted(canRegisterHandler)
/** 短信验证码冷却 */
// const registerCode = ref<boolean>(false)
/** 短信验证码冷却 */
// const registerCodeCD = ref<number>(0)
/** 获取短信验证码 */
//const createCode = () => {
// 先清空验证码的输入
//  registerFormData.code = ""
//  registerCode.value = true

//   registerFormRef.value
//     ?.validateField("phone")
//     .then(() => {
//       getRegisterCodeApi({ phone: registerFormData.phone })
//         .then((res) => {
//           ElMessage.success(res.message)
//         })
//         .catch(() => {
//           ElMessage.error("系统异常,请联系管理员")
//         })

//       registerCodeCD.value = 60
//       registerCode.value = true
//       const interval = setInterval(() => {
//         registerCodeCD.value--
//         if (registerCodeCD.value <= 0) {
//           clearInterval(interval)
//           registerCode.value = false
//         }
//       }, 1000)
//     })
//     .catch(() => {
//       ElMessage.error("手机号格式不正确")
//       registerCode.value = false
//     })
// }
</script>

<template>
  <div class="register-container">
    <ThemeSwitch class="theme-switch" />
    <div class="register-card">
      <div class="title">
        <img src="@/assets/layouts/logo-text-2.png" />
        <el-text size="large">手机号注册</el-text>
        <el-text v-if="!canRegister" type="warning" tag="p">已到报名截止时间，停止注册</el-text>
      </div>
      <div class="content">
        <el-form
          ref="registerFormRef"
          :model="registerFormData"
          :rules="registerFormRules"
          @keyup.enter="handleRegister"
        >
          <el-form-item prop="phone">
            <el-input
              v-model.trim="registerFormData.phone"
              placeholder="手机号"
              type="text"
              tabindex="2"
              :prefix-icon="Phone"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="registerFormData.password"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model.trim="registerFormData.confirmPassword"
              placeholder="确认密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <!-- <el-form-item prop="code">
            <el-input
              v-model.trim="registerFormData.code"
              placeholder="验证码注册"
              type="text"
              tabindex="3"
              :prefix-icon="Key"
              maxlength="7"
              size="large"
            >
              <template #append>
                <el-button @click="createCode()" :loading="registerCode" style="width: 215px">
                  {{ registerCode ? `${registerCodeCD} 秒后重新发送` : "获取验证码" }}
                </el-button>
              </template>
            </el-input>
          </el-form-item> -->
          <el-text>已有账号? <el-link href="#/login">去登录</el-link></el-text>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleRegister">注 册</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/login-background/banner_1.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .register-card {
    width: 480px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
