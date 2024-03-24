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

/** 拒绝 */
export function refuseThingApi(params: { thingId: number }) {
  return request({
    url: "refuse",
    method: "get",
    params
  })
}
/** 拒绝 */
export function refuse2ThingApi(params: { thingId: number }) {
  return request({
    url: "refuse2",
    method: "get",
    params
  })
}
