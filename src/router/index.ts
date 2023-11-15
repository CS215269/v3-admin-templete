import { type RouteRecordRaw, createRouter } from "vue-router"
import { history, flatMultiLevelRoutes } from "./helper"
import routeSettings from "@/config/route"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/register",
    component: () => import("@/views/register/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/adminTable",
    component: Layouts,
    redirect: "/adminTable/index",
    name: "adminTable",
    meta: {
      title: "管理员",
      svgIcon: "lock",
      roles: ["admin"] // 可以在根路由中设置角色
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/table-admin/index.vue"),
        name: "管理员信息",
        meta: {
          title: "管理员",
          svgIcon: "lock"
        }
      }
    ]
  },
  {
    path: "/batchTable",
    component: Layouts,
    redirect: "/batchTable/index",
    name: "batchTable",
    meta: {
      title: "批次",
      svgIcon: "unocss",
      roles: ["admin"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/table-batch/index.vue"),
        name: "批次信息",
        meta: {
          title: "批次",
          svgIcon: "unocss"
        }
      }
    ]
  },
  {
    path: "/departmentTable",
    component: Layouts,
    redirect: "/departmentTable/index",
    name: "departmentTable",
    meta: {
      title: "部门",
      svgIcon: "unocss",
      roles: ["admin"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/table-department/index.vue"),
        name: "部门信息",
        meta: {
          title: "部门",
          svgIcon: "unocss"
        }
      }
    ]
  },
  {
    path: "/positionTable",
    component: Layouts,
    redirect: "/positionTable/index",
    name: "positionTable",
    meta: {
      title: "岗位",
      svgIcon: "unocss",
      roles: ["admin"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/table-position/index.vue"),
        name: "岗位信息",
        meta: {
          title: "岗位",
          svgIcon: "unocss"
        }
      }
    ]
  },
  {
    path: "/thingTable",
    component: Layouts,
    redirect: "/thingTable/index",
    name: "thingTable",
    meta: {
      title: "投递",
      svgIcon: "unocss",
      roles: ["admin"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/table-thing/index.vue"),
        name: "投递信息",
        meta: {
          title: "投递",
          svgIcon: "unocss"
        }
      }
    ]
  },
  {
    path: "/thingResult",
    component: Layouts,
    redirect: "/thingResult/index",
    name: "thingResult",
    meta: {
      title: "招聘",
      svgIcon: "unocss",
      roles: ["admin"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/table-result/index.vue"),
        name: "公开的招聘岗位",
        meta: {
          title: "招聘岗位",
          svgIcon: "unocss"
        }
      }
    ]
  },
  {
    path: "/user-thing",
    component: Layouts,
    redirect: "/user-thing/index",
    name: "user-thing",
    meta: {
      title: "投递",
      svgIcon: "unocss",
      roles: ["editor"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/user-thing/index.vue"),
        name: "投递信息",
        meta: {
          title: "投递信息",
          svgIcon: "keyboard-down"
        }
      }
    ]
  },
  {
    path: "/my-thing",
    component: Layouts,
    redirect: "/my-thing/index",
    name: "my-thing",
    meta: {
      title: "投递",
      svgIcon: "unocss",
      roles: ["editor"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/my-thing/index.vue"),
        name: "我的投递",
        meta: {
          title: "我的投递",
          svgIcon: "keyboard-down"
        }
      }
    ]
  },
  {
    path: "/permission",
    component: Layouts,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "权限管理",
      svgIcon: "lock",
      roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "page",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "页面权限",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "directive",
        component: () => import("@/views/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
