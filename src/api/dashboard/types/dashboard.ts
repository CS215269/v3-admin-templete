export interface DashboardData {
  unsettledThingsNum: number
  openBatchTotal: number
  userTotal: number
  methodOpen: number
}

export type ResponseData = ApiResponseData<DashboardData>
