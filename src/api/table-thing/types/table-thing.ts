export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：岗位名称 */
  jobTitles?: number[]
  /** 查询参数：批次名称 */
  batches?: number[]
  /** 查询参数：部门 */
  status?: number[]
  /** 查询参数：部门 */
  name?: string
}

export interface GetTableThingData {
  /** 用户-(岗位-批次)表的主键 */
  thingId: number
  /** 岗位-批次表的主键 */
  recruitId: number
  /** 岗位表的主键 */
  positionId: number
  /** 岗位学位的要求 */
  degree: number
  code: string
  jobTitle: string
  batchId: number
  batchname: string
  userId: number
  username: string
  status: number
  time: Date
}

export interface ThingInfoData {
  /** 用户id */
  userId: number
  /** 姓名 */
  name: string
  /** 身份证号码 */
  idnum: number
  /** 电话号码 */
  tel: number
  /** 性别 */
  sex: string
  /** 年龄 */
  age: string
  /** 学历 */
  userEducation: number
  /** 学位 */
  userDegree: number
  /** 政治面貌 */
  zzmm: string
  /** 毕业学校 */
  school: string
  /** 民族 */
  nation: string
  /** 出生日期 */
  birthday: string
  /** 籍贯 */
  native_place: string
  /** 现居地址 */
  address: string
  /** 毕业时间 */
  graduation_time: string
  /** 专业 */
  specialty: string
  /** 资历图片 */
  imgs: string

  /** 岗位id */
  pid: number
  /** 岗位名称 */
  jobTitle: string
  education: number
  degree: number
  info: string
}

export interface ThingIdToPrint {
  thingId: number[]
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableThingData[]
  total: number
}>
export type GetThingInfoData = ApiResponseData<{ data: ThingInfoData; file: string[]; img: string[] }>
export type ThingIdToPrintResult = ApiResponseData<{ total: number; error: number }>
export type prePrintfCertificatesData = ApiResponseData<{ code: number; codeWithUser: number }>
