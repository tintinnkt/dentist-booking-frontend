import { BackendRoutes } from "@/config/apiRoutes";
import axios, { AxiosError } from "axios";

export const getDentistSchedule = async (token: string) => {
  try {
    console.log("📦 Backend route:", BackendRoutes.BOOKING_DENTIST);
    const response = await axios.get(
      BackendRoutes.BOOKING_DENTIST,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Axios error response:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to get dentist schedule");
    }
    console.error("Unknown error:", error);
    throw new Error("An unexpected error occurred");
  }
};