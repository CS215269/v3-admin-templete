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
  key?: string
  /** 查询参数：批次是否可用 */
  state?: number
}

export interface GetTableBatchData {
  name: string
  id: number
  open: number
  positionNum: number
  startime: string
  deadline: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableBatchData[]
  total: number
}>

export type GetBatchOptionData = ApiResponseData<{
  list: { id: number; name: string }[]
}>
