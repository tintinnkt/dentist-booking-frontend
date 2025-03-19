export enum BackendRoutes {
  GET_ME = "/api/v1/aut/me",
  GET_DENTISTS = "/api/v1/dentists/",
}
export enum FrontendRootRoutes {
  ADMIN = "/admin",
  LIST = "/list",
  LOGIN = "/login",
}
export enum FrontendRoutes {
  ADMIN_MANAGEMENT = `${FrontendRootRoutes.ADMIN}/management`,
  DENTIST_LIST = `${FrontendRootRoutes.LIST}`,
}
