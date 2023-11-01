export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：部门 */
  departmentId?: string
  /** 查询参数：批次名称 */
  batch?: string
  /** 查询参数：岗位名称 */
  jobTitle?: string
  /** 查询参数：批次是否可用 */
  department?: string
}

export interface GetTableThingData {
  id: number
  jobTitle: string
  positionId: number
  department: string
  departmentId: number
  batchid: number
  batchname: string
  degree: number
  userId: number
  username: string
  school: string
  status: number
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableThingData[]
  total: number
}>
