export interface CreateTableRequestData {
  name: string
  account: string
  pwd: string
  phone: string
}

export interface UpdateTableRequestData {
  id: string
  name: string
  account: string
  phone: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：用户名 */
  username?: string
  /** 查询参数：手机号 */
  phone?: string
}

export interface GetTableAdminData {
  account: string
  id: string
  phone: string
  pwd: boolean
  name: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableAdminData[]
  total: number
}>
