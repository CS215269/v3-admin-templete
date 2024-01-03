export interface CreateTableRequestData {
  name: string
}

export interface UpdateTableRequestData {
  id: number
  name: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：批次名称 */
  name?: string
}

export interface GetTableDepartmentData {
  id: number
  name: string
  positionNum: number
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableDepartmentData[]
  total: number
}>

export type GetDepartmenOptionData = ApiResponseData<{
  list: { id: number; name: string }[]
}>
