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

// /** 查询是否实名认证 */
// export function getBatchDataApi(params: Table.GetTableRequestData) {
//   return request<Table.GetTableResponseData>({
//     url: "tableBatch",
//     method: "get",
//     headers: {
//       "ngrok-skip-browser-warning": "123"
//     },
//     params
//   })
// }
