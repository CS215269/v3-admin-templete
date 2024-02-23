export interface GetTableRequestData {
  department: string
  departmentId: number
  recruitId: number
  thingId: number
  positionId: number
  jobTitle: string
  batchId: number
  batchname: string
  status: number
}

export interface SubmitThingRequestData {
  recruitId: number
}

export type GetUserThingResponseData = ApiResponseData<GetTableRequestData[]>
export type SubmitThingResponseData = ApiResponseData<null>
export type setUserInfoResponseData = ApiResponseData<null>
