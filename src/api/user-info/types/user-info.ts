/** 用户信息 */
export interface UserInfoData {
  /** 用户id */
  id: number
  /** 姓名 */
  name: string
  /** 身份证号码 */
  idnum: number
  /** 电话号码 */
  tel: number
  /** 性别 */
  sex: string
  /** 年龄 */
  age: string
  /** 学历 */
  degree: number
  /** 政治面貌 */
  zzmm: string
  /** 毕业学校 */
  school: string
  /** 民族 */
  nation: string
  /** 出生日期 */
  birthday: string
  /** 籍贯 */
  native_place: string
  /** 现居地址 */
  address: string
  /** 毕业时间 */
  graduation_time: string
  /** 专业 */
  specialty: string
}

export interface SetUserInfoRequestData {
  name: string
  idNum: string
  degree: number
}

export type GetUserInfoResponseData = ApiResponseData<UserInfoData>
export type SetUserInfoResponseData = ApiResponseData<null>
// export type GetUserThingResponseData = ApiResponseData<GetUserInfoRequestData>
