export interface CreateTableRequestData {
  name: string
  open: number
  startime: string
  deadline: string
}

export interface UpdateTableRequestData {
  id: number
  name: string
  open: number
  startime: string
  deadline: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：批次名称 */
  name?: string
  /** 查询参数：批次是否可用 */
  open?: number
}

export interface GetPositionData {
  id: number
  recruitId: number
  jobTitle: string
  department: string
  departmentId: number
  degree: number
  focus: number
  info: string
}

export interface GetBatchData {
  id: number
  name: string
  startime: string
  deadline: string
  positionNum: number
}

export type GetBatchResponseData = ApiResponseData<{
  list: GetBatchData[]
  total: number
}>

export type GetPositionResponseData = ApiResponseData<{
  list: GetPositionData[]
  total: number
}>
