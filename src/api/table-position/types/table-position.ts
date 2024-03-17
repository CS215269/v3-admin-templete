export interface CreateTableRequestData {
  jobTitle: string
  departmentId: number
  education: number
  degree: number
  require: string
  maxSalary: number
  minSalary: number
  info: string
}

export interface UpdateTableRequestData {
  id: number
  jobTitle: string
  departmentId: number
  education: number
  degree: number
  require: string
  maxSalary: number
  minSalary: number
  info: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：部门 */
  departments?: string
}

export interface GetTablePositionData {
  id: number
  jobTitle: string
  department: string
  education: number
  degree: number
  maxSalary: number
  minSalary: number
  require: string
  info: string
  departmentId: number
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
