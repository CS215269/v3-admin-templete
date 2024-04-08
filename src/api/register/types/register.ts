export interface RegisterRequestData {
  /** 注册密码 */
  password: string
  /** 验证密码 */
  confirmPassword: string
  /** 注册手机号 */
  phone: string
  /** 验证码 */
  code: string
}

export type RegisterCodeResponseData = ApiResponseData<{ code: string }>

export type RegisterResponseData = ApiResponseData<{ token: string }>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>

export type CanRegisterResponseData = ApiResponseData<number>
