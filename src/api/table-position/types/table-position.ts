export interface CreateTableRequestData {
  jobTitle: string
  education: number
  degree: number
  require: string
  info: string
}

export interface UpdateTableRequestData {
  id: number
  jobTitle: string
  education: number
  degree: number
  require: string
  info: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
}

export interface GetTablePositionData {
  id: number
  recruitId: number
  jobTitle: string
  code: string
  department: string
  departmentId: number
  education: number
  focus: number
  info: string
  require: string
  degree: number
  maxAge: number
  sex: 0
  specialty: string
  toll: 0
  type: string
  zzmm: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTablePositionData[]
  total: number
}>

export type GetPositionOptionData = ApiResponseData<{
  list: { id: number; jobTitle: string }[]
}>

export type DeleteResult = ApiResponseData<{
  total: number
  error: number
}>
