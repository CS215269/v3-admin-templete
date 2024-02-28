export interface CreateTableRequestData {
  name: string
  account: string
  pwd: string
  phone: string
  viewOnly: number
}

export interface UpdateTableRequestData {
  id: string
  name: string
  account: string
  phone: string
  viewOnly: number
}

export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：用户名 */
  name?: string
  /** 查询参数：手机号 */
  phone?: string
}

export interface GetTableAdminData {
  account: string
  id: string
  phone: string
  pwd: boolean
  name: string
  viewOnly: number
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableAdminData[]
  total: number
}>
