import { request } from "@/utils/service"
import type * as Redirect from "./types/redirect"

/** 获取登录验证码 */
export function getRedirectCodeApi() {
  return request<Redirect.RedirectCodeResponseData>({
    url: "redirect/code",
    method: "get",
    /** 内网穿透用,跳过无意义的响应 */
    headers: {
      "ngrok-skip-browser-warning": "123"
    }
  })
}

/** 登录并返回 Token */
export function loginApi(data: Redirect.RedirectRequestData) {
  return request<Redirect.RedirectResponseData>({
    url: "admin/login",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Redirect.UserInfoResponseData>({
    url: "users/info",
    method: "get",
    /** 内网穿透用,跳过无意义的响应 */
    headers: {
      "ngrok-skip-browser-warning": "123"
    }
  })
}
