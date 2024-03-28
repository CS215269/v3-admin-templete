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

/** 放弃求职 */
export function userAbandonApi(params: { id: number }) {
  return request<Table.setUserInfoResponseData>({
    url: "abandon",
    method: "get",
    params
  })
}

/** 下载 */
export function exportFormApi(params: { id: number }) {
  return request<BlobPart>({
    responseType: "blob",
    url: `exportForm`,
    method: "get",
    params
  })
}
