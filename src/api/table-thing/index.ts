import { request } from "@/utils/service"
import type * as Table from "./types/table-thing"

/** 同意 */
export function acceptThingApi(data: { thingId: number }) {
  return request({
    url: "accept",
    method: "post",
    data
  })
}

/** 拒绝 */
export function refuseThingDataApi(data: number) {
  return request({
    url: "tableThing",
    method: "post",
    data
  })
}

/** 打印准考证 */
export function updateTableDataApi(data: number) {
  return request({
    url: "tableThing",
    method: "put",
    data
  })
}

/** 查 */
export function getTableDataApi() {
  return request<Table.GetTableResponseData>({
    url: "tableThing",
    method: "get"
  })
}

/** 查 */
export function getTableDataBySearchApi(data: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "tableThing2",
    method: "post",
    data
  })
}
