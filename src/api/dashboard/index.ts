import { request } from "@/utils/service"
import type * as Info from "./types/dashboard"

/** 获取管理员菜单页数据 */
export function getDashboardDataApi() {
  return request<Info.ResponseData>({
    url: "adminDashboard",
    method: "get"
  })
}
