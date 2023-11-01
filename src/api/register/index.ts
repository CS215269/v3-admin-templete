import { request } from "@/utils/service"
import type * as Register from "./types/register"

/** 获取注册验证码 */
export function getRegisterCodeApi() {
  return request<Register.RegisterCodeResponseData>({
    url: "login/code",
    method: "get",
    /** 内网穿透用,跳过无意义的响应 */
    headers: {
      "ngrok-skip-browser-warning": "123"
    }
  })
}

/** 注册并返回 Token */
export function registerApi(data: Register.RegisterRequestData) {
  return request<Register.RegisterResponseData>({
    url: "user/register",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Register.UserInfoResponseData>({
    url: "users/info",
    method: "get",
    /** 内网穿透用,跳过无意义的响应 */
    headers: {
      "ngrok-skip-browser-warning": "123"
    }
  })
}
