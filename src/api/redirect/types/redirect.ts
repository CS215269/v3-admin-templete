export interface RedirectRequestData {
  /** 注册账号 */
  username: string
  /** 注册密码 */
  password: string
  /** 注册手机号 */
  phone: string
  /** 验证码 */
  code: string
}

export type RedirectCodeResponseData = ApiResponseData<string>

export type RedirectResponseData = ApiResponseData<{ token: string }>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>
