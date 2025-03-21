export enum BackendRoutes {
  GET_ME = "/api/v1/aut/me",
  GET_DENTISTS = "/api/v1/dentists/",
}
export enum FrontendRootRoutes {
  ADMIN = "/admin",
  LIST = "/list",
  LOGIN = "/login",
  ME = "/me",
}
export enum FrontendRoutes {
  USER_MANAGEMENT = `${FrontendRootRoutes.ADMIN}/user`,
  DENTIST_LIST = `${FrontendRootRoutes.LIST}`,
  LOGIN = `${FrontendRootRoutes.LOGIN}`,
  ME = `${FrontendRootRoutes.ME}`,
}
