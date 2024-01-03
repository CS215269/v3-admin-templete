import { request } from "@/utils/service"
import type * as Table from "./types/table-department"

/** 增 */
export function createTableDataApi(data: Table.CreateTableRequestData) {
  return request({
    url: "tableDepartment",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: number) {
  return request({
    url: `tableDepartment/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "tableDepartment",
    method: "put",
    data
  })
}

/** 查 */
export function getTableDataApi(params: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "tableDepartment",
    method: "get",
    params
  })
}

export function getDepartmentOptionApi() {
  return request<Table.GetDepartmenOptionData>({
    url: "getDepartmentOption",
    method: "get"
  })
}
