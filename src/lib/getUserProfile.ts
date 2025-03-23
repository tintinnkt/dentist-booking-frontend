import { BackendRoutes } from "@/config/apiRoutes";
import axios, { AxiosError } from "axios";

export default async function getUserProfile(token: string) {
  try {
    const response = await axios.get(BackendRoutes.USER_INFO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      "Failed to get user profile: " + (error as AxiosError).message,
    );
  }
}
