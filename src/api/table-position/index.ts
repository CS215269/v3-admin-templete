import { request } from "@/utils/service"
import type * as Table from "./types/table-position"

/** 增 */
export function createTableDataApi(data: Table.CreateTableRequestData) {
  return request({
    url: "tablePosition",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: number) {
  return request({
    url: `tablePosition/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "tablePosition",
    method: "put",
    data
  })
}

/** 查 */
export function getTableDataApi(params: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "tablePosition",
    method: "get",
    headers: {
      "ngrok-skip-browser-warning": "123"
    },
    params
  })
}

/** 查 */
export function getPositionOptionApi() {
  return request<Table.GetPositionOptionData>({
    url: "getPositionOption",
    method: "get",
    headers: {
      "ngrok-skip-browser-warning": "123"
    }
  })
}
