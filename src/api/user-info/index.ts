import { request } from "@/utils/service"
import type * as Table from "./types/user-info"

// /** 增 */
// export function createTableDataApi(data: Table.CreateTableRequestData) {
//   return request({
//     url: "userThing",
//     method: "post",
//     data
//   })
// }

export function getUserInfoApi() {
  return request<Table.GetUserInfoResponseData>({
    url: `userInfo`,
    method: "get"
  })
}

export function setUserInfoApi(data: Table.UserInfoData) {
  return request<Table.SetUserInfoResponseData>({
    url: `userInfo`,
    method: "post",
    data
  })
}
/** 实名认证提交 */
export function setRealNameInfoApi(data: Table.SetRealNameRequestData) {
  return request({
    url: "realName",
    method: "post",
    data
  })
}
/** 修改密码 */
export function newPwdApi(data: { oldPwd: string; newPwd: string }) {
  return request({
    url: "user/pwd",
    method: "post",
    data
  })
}
