<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { getBatchDataApi, getPositionDataApi } from "@/api/user-batch"
import { GetBatchData, GetPositionData } from "@/api/user-batch/types/user-batch"
import ReviewForm from "@/components/ReviewForm/ReviewForm.vue"
import { Search, Refresh } from "@element-plus/icons-vue"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { setRealNameInfoApi } from "@/api/user-info"
import { getDegree, getEducation } from "@/utils/degree"

defineOptions({
  name: "UserThing"
})

const loading = ref<boolean>(false)
/** 当前批次 */
const currentBatch = ref<GetBatchData>({
  id: 0,
  name: "",
  startime: "",
  deadline: "",
  positionNum: 0
})

/** 用于存储每个 collapse 的数据 */
const positions = reactive<GetPositionData[]>([])
/** 用于存储每个 drawer(抽屉) 的数据 */
const drawerOpenIndex = reactive<boolean[]>([])

// const handleClose = (done: () => void) => {
//   drawerOpenIndex.fill(false)
//   console.log("重置")
//   console.log(drawerOpenIndex)
//   done()
// }

/** 无限加载工具类 */
const listUtil = reactive({
  /** 岗位列表是否加载完毕 */
  over: false,
  /** 岗位总数 */
  num: 0,
  /** 查询起始位置 */
  offset: 0
})
/** 搜索表单 */
const searchData = reactive({
  code: ""
})
const handleSearch = () => {
  location.reload()
}
const loadData = async () => {
  try {
    const {
      data: { list }
    } = await getPositionDataApi({
      batchId: currentBatch.value.id,
      currentPage: listUtil.offset,
      size: 3,
      code: ""
    })

    // 无限加载功能取消
    // if (list.length < 1) {
    //   listUtil.over = true
    //   console.log("over?" + listUtil.over)
    //   return
    // }

    positions.push(...list)
    console.log(positions)
    listUtil.offset += list.length
  } catch (error) {
    console.error(error)
    ElMessage.error("加载数据时出错")
  }
}

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
    { required: true, trigger: "blur", message: "请输入账号" },
    {
      pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
      trigger: "blur",
      message: "请输入有效的身份证号码"
    }
    // dsa validator: isChineseIdCard,
  ]
})
const clickHandle = (index: number) => {
  if (alreadyRecruit.value) {
    ElMessage.warning("一次只能投递一个岗位")
    return
  }
  if (infoIntegrity.value) drawerOpenIndex[index] = true
  else showRealNameMessageBox.value = true
}
const sendRealName = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      realNameLoading.value = true
      setRealNameInfoApi(formData)
        .then(() => {
          ElMessage.success("实名成功")
          infoIntegrity.value = true
        })
        .catch(() => {})
        .finally(() => {
          realNameLoading.value = false
          showRealNameMessageBox.value = false
        })
    } else {
      ElMessage.error("表单效验不通过")
    }
  })
}
const alreadyRecruit = ref(false)
const getBatchData = () => {
  loading.value = true
  getBatchDataApi()
    .then((res) => {
      currentBatch.value = res.data.oneBatch
      listUtil.num = res.data.oneBatch.positionNum
      console.log(alreadyRecruit.value)
      alreadyRecruit.value = res.data.alreadyRecruit
      console.log(alreadyRecruit.value)
      infoIntegrity.value = res.data.infoIntegrity == 0 ? false : true
      loadData()
    })
    .catch(() => {
      ElMessage.error("系统异常")
    })
    .finally(() => {
      loading.value = false
      console.log("a?cub" + currentBatch.value.id + "listnum" + listUtil.num)
    })
}

onMounted(getBatchData)
</script>

<template>
  <div class="app-container">
    <div class="toolbar-wrapper" style="margin-bottom: 20px">
      <el-row justify="space-around">
        <el-col :span="8">
          <el-text class="mx-1" size="large">{{ currentBatch.name }}</el-text>
        </el-col>
        <el-col :span="4">
          <el-text class="mx-1" size="large"><el-button>切换批次</el-button> </el-text>
        </el-col>
      </el-row>
      <el-card>
        <el-form ref="searchFormRef" :inline="true" :model="searchData">
          <el-form-item prop="code" label="岗位代码">
            <el-input v-model="searchData.code" placeholder="请输入" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button :icon="Refresh" @click="undefined">重置</el-button
            ><!-- resetSearch -->
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="table-wrapper">
      <div v-if="!infoIntegrity">
        <el-text>请先实名认证</el-text>
        <el-button @click="showRealNameMessageBox = true">实名认证</el-button>
      </div>
      <ul v-infinite-scroll="loadData" :infinite-scroll-disabled="true" class="infinite-list" style="overflow: auto">
        <li>
          <el-row>
            <el-col style="text-align: start">
              <el-text tag="p" type="danger"> 填报须知：</el-text>
              <el-text tag="p" type="danger">
                <b
                  >请报考者认真阅读《招聘公告》后如实准确填写，所选报考岗位必须符合招聘公告相关要求。报考者隐瞒有关情况或提供虚假材料的，取消其考试或聘用资格，并按有关规定严肃处理。</b
                >
              </el-text>
              <el-text tag="p" type="danger">
                <b
                  >2.所有上传的佐证材料均应为PDF格式文件，证明材料应真实有效，单个PDF证明文件大小在5M以下,并根据证明材料的内容命名上传。</b
                >
              </el-text>
              <el-text tag="p" type="danger"> <b>3.请在“身份证号码”一栏上传身份证正反面照片的PDF文件。</b></el-text>
              <el-text tag="p" type="danger">
                <b
                  >4.教育经历请从专科及以上开始填写，并按照时间专科、本科、研究生、博士的顺序依次填写，并依次上传佐证材料。</b
                ></el-text
              >
              <el-text type="danger">
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
        </li>
        <li v-for="(p, index) in positions" :key="p.id">
          <el-card style="margin-top: 0.1em">
            <!-- {{ p }} -->
            <table border="2px #ccc solid" style="width: 100%; border-collapse: collapse; text-align: center">
              <!-- 第一行占总高度的6/24 -->
              <tr style="height: 25%">
                <!-- 占总宽度的4/24 -->
                <td style="width: 16.666%">岗位代码</td>
                <!-- 占总宽度的2/24 -->
                <td style="width: 8.333%">拟聘人数</td>
                <!-- 占总宽度的16/24 -->
                <td style="width: 66.666%">招聘岗位要求</td>
                <!-- 合并两个格子，占总宽度的2/24 -->
                <td rowspan="2" class="td-btn" style="width: 8.333%" @click="clickHandle(index)">点击报名</td>
              </tr>
              <!-- 第二行占总高度的18/24 -->
              <tr style="height: 75%">
                <!-- 占总宽度的4/24 -->
                <td style="width: 16.666%">{{ p.code }}</td>
                <!-- 占总宽度的2/24 -->
                <td style="width: 8.333%">{{ p.toll }}</td>
                <!-- 占总宽度的16/24 -->
                <td style="width: 66.666%; text-align: start">
                  <el-row :gutter="20">
                    <el-col :span="12"> 岗位名称：{{ p.code + "-" + p.jobTitle }} </el-col>
                    <el-col :span="12"> 岗位类别：{{ p.type }} </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12"> 专业：{{ p.specialty }} </el-col>
                    <el-col :span="12"> 学历：{{ getEducation(p.education) }} </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12"> 学位：{{ getDegree(p.degree) }} </el-col>
                    <el-col :span="12"> 年龄：{{ p.maxAge }}周岁以下</el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12"> 性别：{{ p.sex == 0 ? "不限" : p.sex == 1 ? "男性" : "女性" }} </el-col>
                    <el-col :span="12"> 政治面貌：{{ p.zzmm }} </el-col>
                  </el-row>
                  技能测试环节：{{ p.require }}<br />
                  其他：{{ p.info }}
                </td>
              </tr>
            </table>
          </el-card>
          <el-drawer v-model="drawerOpenIndex[index]" direction="rtl" size="75%">
            <template #header>
              <h4>正在投递: 岗位代码 {{ p.code }}</h4>
            </template>
            <template #default>
              <ReviewForm :recruitId="p.recruitId" :code="p.code" @close-drawer="drawerOpenIndex[index] = false" />
            </template>
          </el-drawer>
        </li>
      </ul>
      <el-dialog v-model="showRealNameMessageBox" title="开始投递前,请先进行实名认证" width="30%">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
          <el-form-item prop="name" label="姓名">
            <el-input v-model="formData.name" placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item prop="idnum" label="身份证号码">
            <el-input v-model="formData.idnum" placeholder="请输入身份证号" clearable />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showRealNameMessageBox = false">取消</el-button>
            <el-button type="primary" @click="sendRealName()"> 确定 </el-button>
            <!-- <el-button type="primary" @click="submit()"> 确定 </el-button> -->
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="pager-wrapper">
      <!-- Pagination code here -->
    </div>
  </div>
</template>
<style>
.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none;
}
.table-wrapper li {
  margin-bottom: 20px;
}
li .el-card__body {
  padding: 0;
}
td {
  padding: 20px;
}
td.td-btn {
  cursor: pointer;
  transition: all 0.5s ease-out;
}
td.td-btn:hover {
  cursor: pointer;
  transition: all;
  color: blue;
  box-shadow:
    inset -2px -2px 5px 2px #888,
    inset 2px 2px 5px 2px #f4f4f4;
}
</style>
