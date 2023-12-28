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

export function setUserInfoApi(data: Table.SetUserInfoRequestData) {
  return request<Table.SetUserInfoResponseData>({
    url: `userInfo`,
    method: "post",
    data
  })
}
// /** 改 */
// export function updateTableDataApi(data: Table.UpdateTableRequestData) {
//   return request({
//     url: "userThing",
//     method: "put",
//     data
//   })
// }

// /** 查 */
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
