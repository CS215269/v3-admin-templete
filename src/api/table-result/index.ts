import { request } from "@/utils/service"
import type * as Table from "./types/table-result"

/** 增 */
export function createTableDataApi(data: Table.CreateTableRequestData) {
  return request({
    url: "tableResult",
    method: "post",
    headers: {
      "ngrok-skip-browser-warning": "123"
    },
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: number) {
  return request({
    url: `tableResult/${id}`,
    headers: {
      "ngrok-skip-browser-warning": "123"
    },
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "tableResult",
    method: "put",
    headers: {
      "ngrok-skip-browser-warning": "123"
    },
    data
  })
}

/** 查 */
export function getTableDataApi(data: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "tableResult2",
    method: "post",
    data
  })
}
