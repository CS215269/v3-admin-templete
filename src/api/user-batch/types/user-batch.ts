export interface SearchPositionData {
  /** 偏移量 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：岗位代码 */
  code?: string
  batchId: number
}

export interface GetPositionData {
  id: number
  recruitId: number
  jobTitle: string
  code: string
  department: string
  departmentId: number
  education: number
  focus: number
  info: string
  maxSalary: number
  minSalary: number
  require: string
  degree: number
  maxAge: number
  sex: 0
  specialty: string
  toll: 0
  type: string
  zzmm: string
}

export interface GetBatchData {
  id: number
  name: string
  startime: string
  deadline: string
  positionNum: number
}

export type InspectIdnumResponse = ApiResponseData<undefined>
export type GetCurrentBatchResponseData = ApiResponseData<{ oneBatch: GetBatchData }>
export type GetBatchResponseData = ApiResponseData<{
  /** 岗位列表 */
  list: GetBatchData[]
  total: number
  /** 用户是否实名认证 */
  infoIntegrity: number
}>

export type GetPositionResponseData = ApiResponseData<{
  /** 岗位列表 */
  list: GetPositionData[]
  /** 用户是否实名认证 */
  infoIntegrity: number
}>
