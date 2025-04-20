import { BackendRoutes } from "@/config/apiRoutes";
import axios, { AxiosError } from "axios";

export const getDentistSchedule = async (token: string) => {
  try {
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
      throw new Error(error.response?.data?.message || "Failed to get dentist schedule");
    }
    throw new Error("An unexpected error occurred");
  }
};