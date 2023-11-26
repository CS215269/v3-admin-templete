export interface CreateTableRequestData {
  name: string
  sex: string
  age: string
  degree: number
  zzmm: string
  school: string
  native_place: string
}

export interface UpdateTableRequestData {
  id: number
  name: string
  sex: string
  age: string
  degree: number
  zzmm: string
  school: string
  native_place: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：批次名称 */
  name?: string
  /** 查询参数：批次是否可用 */
  degree?: number
}

export interface GetTableUserData {
  id: number
  name: string
  idnum: number
  tel: number
  sex: string
  age: string
  degree: number
  zzmm: string
  school: string
  nation: string
  birthday: string
  native_place: string
  address: string
  graduation_time: string
  specialty: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableUserData[]
  total: number
}>
