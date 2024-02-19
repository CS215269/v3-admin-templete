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
export function deleteTableDataApi(id: number | number[]) {
  const data = Array.isArray(id) ? id : [id]
  return request<Table.DeleteResult>({
    url: `tablePositionDel`,
    method: "post",
    data
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
export function getTableDataApi(data: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "tablePositionPro",
    method: "post",
    data
  })
}

/** 查 */
export function getPositionOptionApi() {
  return request<Table.GetPositionOptionData>({
    url: "getPositionOption",
    method: "get"
  })
}
