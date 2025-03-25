"use client";
import { BackendRoutes } from "@/config/apiRoutes";
import { User } from "@/types/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

const getUserProfile = async (token: string) => {
  try {
    const response = await axios.get(BackendRoutes.USER_INFO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(
      "Failed to get user profile: " + (error as AxiosError).message,
    );
  }
};

/**
 * Custom hook using TanStack Query to fetch and provide user information
 * @returns Query result with user data, loading state, and error
 */
export const useUser = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["userProfile", session?.user?.token],
    queryFn: () => {
      if (!session?.user?.token) return null;
      return getUserProfile(session.user.token);
    },
    enabled: !!session?.user?.token, // Only run query when token exists
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 1, // Only retry once if the request fails
  });

  // Mutation for updating user data
  const { mutate: setUser } = useMutation({
    mutationFn: (newUserData: User | null) => {
      // Updated to accept null
      // TODO: Possibly could implement an API call to update the user here
      // For now, this just updates the cache
      return Promise.resolve(newUserData);
    },
    onSuccess: (newUserData) => {
      // Update the cache with the new user data
      queryClient.setQueryData(
        ["userProfile", session?.user?.token],
        newUserData,
      );
    },
  });

  return {
    user,
    setUser,
    loading,
    error: error as Error | null,
  };
};
