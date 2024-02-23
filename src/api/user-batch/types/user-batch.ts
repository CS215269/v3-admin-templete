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
  require: string
}

export interface GetBatchData {
  id: number
  name: string
  startime: string
  deadline: string
  positionNum: number
}

export type GetBatchResponseData = ApiResponseData<{
  /** 岗位列表 */
  list: GetBatchData[]
  total: number
  /** 用户是否实名认证 */
  infoIntegrity: number
}>

export type GetPositionResponseData = ApiResponseData<{
  /** 岗位列表 */
  list: GetPositionData[]
  /** 列表数量 */
  total: number
  /** 用户是否实名认证 */
  infoIntegrity: number
}>
