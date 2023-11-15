import { request } from "@/utils/service"
import type * as Table from "./types/user-thing"

// /** 增 */
// export function createTableDataApi(data: Table.CreateTableRequestData) {
//   return request({
//     url: "userThing",
//     method: "post",
//     data
//   })
// }

export function getUserThingDataApi() {
  return request<Table.GetUserThingResponseData>({
    url: `userAboutThing`,
    headers: {
      "ngrok-skip-browser-warning": "123"
    },
    method: "get"
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
