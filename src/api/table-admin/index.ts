import { request } from "@/utils/service"
import type * as Table from "./types/table-admin"

/** 增 */
export function createTableDataApi(data: Table.CreateTableRequestData) {
  return request({
    url: "tableAdmin",
    method: "post",
    /** 绕过ngrok新人弹窗 */
    headers: {
      "ngrok-skip-browser-warning": "123"
    },
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: string) {
  return request({
    url: `tableAdmin/${id}`,
    /** 绕过ngrok新人弹窗 */
    headers: {
      "ngrok-skip-browser-warning": "123"
    },
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "tableAdmin",
    method: "put",
    /** 绕过ngrok新人弹窗 */
    headers: {
      "ngrok-skip-browser-warning": "123"
    },
    data
  })
}

/** 查 */
export function getTableDataApi(params: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "tableAdmin",
    method: "get",
    /** 绕过ngrok新人弹窗 */
    headers: {
      "ngrok-skip-browser-warning": "123"
    },
    params
  })
}
