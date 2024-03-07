import { request } from "@/utils/service"
import type * as Table from "./types/user-batch"

export function getPositionDataApi(batchid: number) {
  return request<Table.GetPositionResponseData>({
    url: `positions/${batchid}`,
    method: "get"
  })
}

export function getBatchDataApi() {
  return request<Table.GetBatchResponseData>({
    url: `batchs`,
    method: "get"
  })
}

/** 改 */
export function updateTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "tableBatch",
    method: "put",
    data
  })
}

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
