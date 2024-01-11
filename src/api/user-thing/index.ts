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
    method: "get"
  })
}

export function submitThingApi(params: Table.SubmitThingRequestData) {
  return request<Table.SubmitThingResponseData>({
    url: `submit`,
    method: "get",
    params
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

/** 下载 */
export function userDownload(batchId: number) {
  return request<BlobPart>({
    responseType: "blob",
    url: `userDownload/${batchId}`,
    method: "get"
  })
}
