export interface GetTableRequestData {
  department: string
  departmentId: number
  recruitId: number
  positionId: number
  jobTitle: string
  batchname: string
  status: number
}

export interface SubmitThingRequestData {
  recruitId: number
}

export interface setUserInfoRequestData {
  name: string
  idNum: string
  degree: number
}

export type GetUserThingResponseData = ApiResponseData<GetTableRequestData[]>
export type SubmitThingResponseData = ApiResponseData<null>
export type setUserInfoResponseData = ApiResponseData<null>
