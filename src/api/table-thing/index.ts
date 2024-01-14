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

/** 同意 */
export function accept2ThingApi(data: { thingId: number }) {
  return request({
    url: "accept2",
    method: "post",
    data
  })
}

/** 同意 */
export function accept3ThingApi(data: { thingId: number }) {
  return request({
    url: "accept3",
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
export function printfCertificatesApi(data: { id: number[] }) {
  return request<Table.ThingIdToPrintResult>({
    url: "print",
    method: "post",
    data
  })
}

/** 查详细 */
export function getThingInfoApi(id: number) {
  return request<Table.GetThingInfoData>({
    url: `tableThing/${id}`,
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
