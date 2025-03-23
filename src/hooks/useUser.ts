import { BackendRoutes } from "@/config/apiRoutes";
import { User } from "@/types/user";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch and provide user information
 * @returns The user object or undefined if not fetched yet
 */
export const useUser = () => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userData = await getUserProfile(session.user.token);
        setUser(userData.data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError(error instanceof Error ? error : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [session?.user?.token]);

  return { user, loading, error };
};

async function getUserProfile(token: string) {
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
