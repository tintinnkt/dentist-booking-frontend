// const BACKEND_URL = "https://project-s-backend-cyan.vercel.app";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003";

const BackendRootRoutes = `${BACKEND_URL}/api/v1`;

export const BackendRoutes = {
  LOGOUT: `${BackendRootRoutes}/auth/logout`,
  LOGIN: `${BackendRootRoutes}/auth/login`,
  REGISTER: `${BackendRootRoutes}/auth/register`,
  UPDATE_USER: `${BackendRootRoutes}/auth/updateUser`,
  USER_INFO: `${BackendRootRoutes}/auth/me`,
  DENTIST: `${BackendRootRoutes}/dentists`,

  PATIENTS: `${BackendRootRoutes}/`,
  BOOKING: `${BackendRootRoutes}/bookings`,
  BOOKING_DENTIST: `${BackendRootRoutes}/bookings/dentist`,
  REGISTER_DENTIST: `${BackendRootRoutes}/auth/registerDent`,
  UNAVAILABLE_BOOKING: `${BackendRootRoutes}/bookings/unavailable`,
  GET_ALL_DENTISTS_SCHEDULES: `${BackendRootRoutes}/bookings/schedules`,
  UNAVAILABLE_BOOKING_BY_DENTIST_ID: `${BackendRootRoutes}/dentists/:dentistId/unavailable`,
  SCHEDULES: `${BackendRootRoutes}/unavailable`,
  OFF_HOURS: `${BackendRootRoutes}/offHours`,
  OFF_HOURS_BY_OWNER: `${BackendRootRoutes}/offHours/owner/:ownerId`,
  COMMENTS: `${BackendRootRoutes}/comments`,
} as const;
export type BackendRouteKeys = keyof typeof BackendRoutes;

export const getUnavailableBookingByDentistId = (dentistId: string): string =>
  BackendRoutes.UNAVAILABLE_BOOKING_BY_DENTIST_ID.replace(
    ":dentistId",
    dentistId,
  );

export enum FrontendRootRoutes {
  DASHBOARD = "/dashboard",
  LIST = "/list",
  LOGIN = "/login",
  PROFILE = "/profile",
  BOOKING = "/booking",
  DENTIST = "/dentist",
}
export enum FrontendRoutes {
  DASHBOARD = FrontendRootRoutes.DASHBOARD,
  ADMIN = `${FrontendRoutes.DASHBOARD}/admin`,
  COMMENT = `${FrontendRootRoutes.DASHBOARD}/comment`,
  USER = `${FrontendRootRoutes.DASHBOARD}/users`,
  HOLIDAY = `${FrontendRootRoutes.DASHBOARD}/holiday`,
  DENTIST = `${FrontendRootRoutes.DASHBOARD}/dentist`,
  DENTIST_LIST = `${FrontendRootRoutes.LIST}`,
  LOGIN = `${FrontendRootRoutes.LOGIN}`,
  PROFILE = `${FrontendRootRoutes.PROFILE}`,
  BOOKING = `${FrontendRootRoutes.BOOKING}`,
}
