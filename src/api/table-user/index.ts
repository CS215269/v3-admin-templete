import { request } from "@/utils/service"
import type * as Table from "./types/table-user"

/** 增 */
export function createTableDataApi(data: Table.CreateTableRequestData) {
  return request({
    url: "tableUser",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: number) {
  return request({
    url: `tableUser/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "tableUser",
    method: "put",
    data
  })
}

/** 改 */
export function resetPassWordApi(params: { id: number }) {
  return request({
    url: "userNewPwd",
    method: "get",
    params
  })
}

/** 查 */
export function getTableDataApi(data: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "tableUsers",
    method: "post",
    data
  })
}

/** 查是否有正在进行的投递 */
export function getAlreadyRecruitApi(params: { id: number }) {
  return request<Table.GetAlreadyRecruit>({
    url: "userAlreadyRecruit",
    method: "get",
    params
  })
}
