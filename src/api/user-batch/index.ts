import { request } from "@/utils/service"
import type * as Table from "./types/user-batch"
import type * as Type from "@/components/ReviewForm/data"

export function getPositionDataApi(data: Table.SearchPositionData) {
  return request<Table.GetPositionResponseData>({
    url: `searchPositions`,
    method: "post",
    data
  })
}

export function getBatchDataApi() {
  return request<Table.GetCurrentBatchResponseData>({
    url: `batchs`,
    method: "get"
  })
}

export function inspectIdnumApi(params: { idNum: number }) {
  return request<Table.InspectIdnumResponse>({
    url: `inspectIdnum`,
    method: "get",
    params
  })
}

export function submitJobApplicationPartA(data: Type.FormDataPartA) {
  return request<Type.SubmitDataRequest>({
    url: `submitA`,
    method: "post",
    data
  })
}

export function reTryJobApplicationPartA(data: Type.FormDataPartA) {
  return request<Type.SubmitDataRequest>({
    url: `submitA`,
    method: "put",
    data
  })
}

export function submitJobApplicationPartB(data: Type.FormDataPartB) {
  return request({
    url: `submitB`,
    method: "post",
    data
  })
}

export function submitJobApplicationPartC(data: Type.FormDataPartC) {
  return request({
    url: `submitC`,
    method: "post",
    data
  })
}
