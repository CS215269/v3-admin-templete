export interface CreateTableRequestData {
  jobTitle: string
  departmentId: number
  degree: string
  info: string
}

export interface UpdateTableRequestData {
  id: number
  jobTitle: string
  departmentId: number
  degree: string
  info: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：批次名称 */
  jobTitle?: string
  /** 查询参数：批次是否可用 */
  department?: string
}

export interface GetTablePositionData {
  id: number
  jobTitle: string
  department: string
  degree: string
  info: string
  departmentId: number
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTablePositionData[]
  total: number
}>

export type GetPositionOptionData = ApiResponseData<{
  list: { id: number; jobTitle: string }[]
  total: number
}>

export type DeleteResult = ApiResponseData<{
  total: number
  error: number
}>
