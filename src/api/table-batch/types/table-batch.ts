export interface CreateTableRequestData {
  name: string
  open: number
  startime: Date
  deadline: Date
}

export interface UpdateTableRequestData {
  id: number
  name: string
  open: number
  startime: Date
  deadline: Date
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

export interface GetTableBatchData {
  name: string
  id: number
  open: number
  startime: Date | null
  deadline: Date | null
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableBatchData[]
  total: number
}>
