export interface DashboardData {
  unsettledThingsNum: number
  openBatchTotal: number
  userTotal: number
  num: number
}

export type ResponseData = ApiResponseData<DashboardData>
