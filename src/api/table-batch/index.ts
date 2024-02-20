import { request } from "@/utils/service"
import type * as Table from "./types/table-batch"

/** 增 */
export function createTableDataApi(data: Table.CreateTableRequestData) {
  return request({
    url: "tableBatch",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: number) {
  return request({
    url: `tableBatch/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "tableBatch",
    method: "put",
    data
  })
}

/** 查 */
export function getTableDataApi(data: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "tableBatches",
    method: "post",
    data
  })
}

/** 查 */
export function getBatchOptionsApi() {
  return request<Table.GetBatchOptionData>({
    url: "tableBatchOption",
    method: "get",
    headers: {
      "ngrok-skip-browser-warning": "123"
    }
  })
}
