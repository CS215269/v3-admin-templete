/** 添加数据结构 */
export interface CreateTableRequestData {
  positionId: number
  batchId: number
}
/** 修改数据结构 */
export interface UpdateTableRequestData {
  positionId: number
  batchId: number
  id: number
}

/** 搜索数据结构 */
export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：岗位名称 */
  jobTitles?: number[]
  /** 查询参数：批次名称 */
  batches?: number[]
}

/** 表格数据结构 */
export interface GetTableResultData {
  recruitId: number
  jobTitle: string
  department: string
  degree: string
  departmentId: number
  positionId: number
  batchId: number
  batchname: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableResultData[]
  total: number
}>
