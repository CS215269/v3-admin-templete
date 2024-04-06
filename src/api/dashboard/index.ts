import { request } from "@/utils/service"
import type * as Info from "./types/dashboard"

/** 获取管理员菜单页数据 */
export function getDashboardDataApi() {
  return request<Info.ResponseData>({
    url: "adminDashboard",
    method: "get"
  })
}

/** 获取开放注册开关状态 */
export function getOpenRegisterApi() {
  return request<number>({
    url: "switch/register",
    method: "get"
  })
}

/** 设置开放注册开关状态 */
export function setOpenRegisterApi(data: { open: number }) {
  return request({
    url: "switch/register",
    method: "post",
    data
  })
}
/** 获取导出的总表Excel文件 */
export function getExportTotalExcelApi() {
  return request<Blob>({
    responseType: "blob",
    url: "excel",
    method: "get"
  })
}
