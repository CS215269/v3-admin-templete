export interface CreateTableRequestData {
  name: string
  sex: string
  age: string
  degree: number
  zzmm: string
  school: string
  native_place: string
}

export interface UpdateTableRequestData {
  id: number
  name: string
  sex: string
  age: string
  degree: number
  zzmm: string
  school: string
  native_place: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：批次名称 */
  name?: string
  /** 查询参数：批次是否可用 */
  degree?: number
}

/** 用户信息 */
export interface GetTableUserData {
  /** 用户id */
  id: number
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
  degree: number
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
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableUserData[]
  total: number
}>
