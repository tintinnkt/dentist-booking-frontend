import { BackendRoutes } from "@/config/apiRoutes";
import { Booking } from "@/types/api/Dentist";

import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch and provide a single user booking
 * @returns The booking object or undefined if not fetched yet
 */
export const useUserBookings = () => {
  const [booking, setBooking] = useState<Booking | null>(null); // Booking type or null if no data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!session?.user?.token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const bookingsData = await getUserBookings(session.user.token);

        // Ensure you pick only the first booking, if any
        if (bookingsData.data && bookingsData.data.length > 0) {
          setBooking(bookingsData.data[0]); // Only set the first booking
        } else {
          setBooking(null); // No bookings available
        }

        setError(null);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setError(error instanceof Error ? error : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [session?.user?.token]);

  return { booking, loading, error };
};

async function getUserBookings(token: string) {
  try {
    const response = await axios.get(BackendRoutes.BOOKING, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Assuming response.data is an array of bookings
  } catch (error) {
    throw new Error(
      "Failed to get user bookings: " + (error as AxiosError).message,
    );
  }
}
