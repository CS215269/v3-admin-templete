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

export type GetTableResponseData = ApiResponseData<{
  list: GetTableThingData[]
  total: number
}>
