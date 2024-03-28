export interface GetTableRequestData {
  recruitId: number
  thingId: number
  positionId: number
  jobTitle: string
  batchId: number
  batchname: string
  status: number
  qualificationResult: string

  code: string
  education: number
  focus: number
  info: string
  require: string
  degree: number
  maxAge: number
  sex: 0
  specialty: string
  toll: 0
  type: string
  zzmm: string
}

export interface SubmitThingRequestData {
  recruitId: number
}

export type GetUserThingResponseData = ApiResponseData<GetTableRequestData[]>
export type SubmitThingResponseData = ApiResponseData<null>
export type setUserInfoResponseData = ApiResponseData<null>
