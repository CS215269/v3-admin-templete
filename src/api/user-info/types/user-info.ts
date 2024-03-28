/** 用户信息 */
export interface UserInfoData {
  /** 用户id */
  id: number
  /** 姓名 */
  name: string
  /** 身份证号码 */
  idnum: string
  /** 电话号码 */
  phone: string
  /** 性别 */
  sex: number
  /** 政治面貌 */
  zzmm: string
  /** 民族 */
  nation: string
  /** 出生日期 */
  birthday: string
  /** 出生地 */
  nativePlace: string
  /** 现居地址 */
  address: string
  /** 出生地 */
  birthPlace: string
  /** 电子邮件 */
  email: string
  /** 婚否 */
  married: string
  /** 资格证 */
  specialtiesCertificates: string
}

export interface SetRealNameRequestData {
  name: string
  idnum: string
}

export type GetUserInfoResponseData = ApiResponseData<{ user: UserInfoData; canEdit: boolean }>
export type SetUserInfoResponseData = ApiResponseData<null>
