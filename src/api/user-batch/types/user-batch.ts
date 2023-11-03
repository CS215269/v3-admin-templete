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

export interface GetPositionThingData {
  id: number
  jobTitle: string
  positionId: number
  department: string
  departmentId: number
  batchid: number
  batchname: string
  degree: number
  focus: number
}

export type GetTableResponseData = ApiResponseData<{
  list: GetPositionThingData[]
  total: number
}>
