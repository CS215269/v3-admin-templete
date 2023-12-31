import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "login/code",
    method: "get",
    /** 内网穿透用,跳过无意义的响应 */
    headers: {
      "ngrok-skip-browser-warning": "123"
    }
  })
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "admin/login",
    method: "post",
    /** 内网穿透用,跳过无意义的响应 */
    headers: {
      "ngrok-skip-browser-warning": "123"
    },
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "users/info",
    method: "get"
  })
}
