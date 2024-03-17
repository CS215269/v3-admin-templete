import { request } from "@/utils/service"
import type * as Table from "./types/user-batch"

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
