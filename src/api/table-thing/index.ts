import { request } from "@/utils/service"
import type * as Table from "./types/table-thing"

/** 同意 */
export function accept3ThingApi(data: { thingId: number }) {
  return request({
    url: "accept3",
    method: "post",
    data
  })
}

/** 获取预览打印准考证号等数据 */
export function prePrintfCertificatesDataApi(data: { id: number[] }) {
  return request<Table.prePrintfCertificatesData>({
    url: "previewData",
    method: "post",
    data
  })
}

/** 预览打印准考证 */
export function prePrintfCertificatesApi() {
  return request<BlobPart>({
    responseType: "blob",
    url: "print",
    method: "get"
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

/** 预览用户资历文件 */
export function preViewUserFileApi(data: { path: string }) {
  return request<BlobPart>({
    responseType: "blob",
    url: "previewUserFile",
    method: "post",
    data
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
