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

export function submitJobApplicationPartA(data: Type.FormDataPartA) {
  return request({
    url: `submitA`,
    method: "post",
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
