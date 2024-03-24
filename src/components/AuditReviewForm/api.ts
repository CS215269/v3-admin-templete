import { request } from "@/utils/service"
import * as Type from "./type/data"

/** 查用户详细信息和资历文件 */
export function getThingInfoApi(params: { id: number; code: string }) {
  return request<Type.GetUserThingResponseData>({
    url: `tableThing`,
    method: "get",
    params
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
