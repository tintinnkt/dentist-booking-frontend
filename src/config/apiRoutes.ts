const BACKEND_URL = "https://project-s-backend-cyan.vercel.app";
const BackendRootRoutes = `${BACKEND_URL}/api/v1`;

export enum BackendRoutes {
  LOGOUT = `${BackendRootRoutes}/auth/logout`,
  LOGIN = `${BackendRootRoutes}/auth/login`,
  REGISTER = `${BackendRootRoutes}/auth/register`,
  UPDATE_USER = `${BackendRootRoutes}/auth/updateUser`,
  DENTIST = `${BackendRootRoutes}/dentists`,
  BOOKING = `${BackendRootRoutes}/bookings`,
  GET_BOOKING_FOR_DENTIST = `${BackendRoutes.DENTIST}`,
  USER_INFO = `${BackendRootRoutes}/auth/me`,
}

export enum FrontendRootRoutes {
  ADMIN = "/admin",
  LIST = "/list",
  LOGIN = "/login",
  PROFILE = "/profile",
  BOOKING = "/booking",
}
export enum FrontendRoutes {
  USER_MANAGEMENT = `${FrontendRootRoutes.ADMIN}/user`,
  DENTIST_LIST = `${FrontendRootRoutes.LIST}`,
  LOGIN = `${FrontendRootRoutes.LOGIN}`,
  PROFILE = `${FrontendRootRoutes.PROFILE}`,
  BOOKING = `${FrontendRootRoutes.BOOKING}`,
}
