const BACKEND_URL = "https://project-s-backend-cyan.vercel.app";
const BackendRootRoutes = `${BACKEND_URL}/api/v1`;

export enum BackendRoutes {
  LOGOUT = `${BackendRootRoutes}/auth/logout`,
  LOGIN = `${BackendRootRoutes}/auth/login`,
  REGISTER = `${BackendRootRoutes}/auth/register`,
  UPDATE_USER = `${BackendRootRoutes}/auth/updateUser`,
  USER_INFO = `${BackendRootRoutes}/auth/me`,

  DENTIST = `${BackendRootRoutes}/dentists`,
  BOOKING = `${BackendRootRoutes}/bookings`,
<<<<<<< Updated upstream
  REGISTER_DENTIST = `${BackendRootRoutes}/registerDent`,
  UNAVAILABLE_BOOKING = `${BackendRootRoutes}/bookings/unavailable`,
  GET_ALL_DENTISTS_SCHEDULES = `${BackendRootRoutes}/bookings/schedules`,
  UNAVAILABLE_BOOKING_BY_DENTIST_ID = `${BackendRootRoutes}/dentists/:dentistId/unavailable`,
||||||| Stash base
  GET_BOOKING_FOR_DENTIST = `${BackendRoutes.DENTIST}`,
  USER_INFO = `${BackendRootRoutes}/auth/me`,
=======
  GET_BOOKING_FOR_DENTIST = `${BackendRoutes.DENTIST}`,
  USER_INFO = `${BackendRootRoutes}/auth/me`,
  SCHEDULES = `${BackendRootRoutes}/unavailable`,
>>>>>>> Stashed changes
}

export const getUnavailableBookingByDentistId = (dentistId: string): string =>
  BackendRoutes.UNAVAILABLE_BOOKING_BY_DENTIST_ID.replace(
    ":dentistId",
    dentistId,
  );

export enum FrontendRootRoutes {
  ADMIN = "/admin",
  LIST = "/list",
  LOGIN = "/login",
  PROFILE = "/profile",
  BOOKING = "/booking",
  DENTIST = "/dentist",
}
export enum FrontendRoutes {
  ADMIN_MANAGEMENT = `${FrontendRootRoutes.ADMIN}/management`,
  DENTIST = `${FrontendRootRoutes.DENTIST}`,
  DENTIST_LIST = `${FrontendRootRoutes.LIST}`,
  LOGIN = `${FrontendRootRoutes.LOGIN}`,
  PROFILE = `${FrontendRootRoutes.PROFILE}`,
  BOOKING = `${FrontendRootRoutes.BOOKING}`,
}
