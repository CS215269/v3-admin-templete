import { request } from "@/utils/service"
import type * as Table from "./types/admin-review"

/** 同意 */
export function accept2ThingApi(data: { thingId: number }) {
  return request({
    url: "accept2",
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
export function getAuditDataBySearchApi(data: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "tableAudit",
    method: "post",
    data
  })
}
