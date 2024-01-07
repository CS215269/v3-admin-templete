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
  departments?: number[]
}

export interface GetTableThingData {
  /** 用户-(岗位-批次)表的主键 */
  thingId: number
  /** 岗位-批次表的主键 */
  recruitId: number
  /** 岗位表的主键 */
  positionId: number
  jobTitle: string
  department: string
  departmentId: number
  batchId: number
  batchname: string
  degree: number
  userId: number
  username: string
  school: string
  status: number
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
  /** 部门 */
  department: string
  degree: number
  info: string
  departmentId: number
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableThingData[]
  total: number
}>
export type GetThingInfoData = ApiResponseData<{ data: ThingInfoData }>
