import { combineDateAndTime } from "@/components/BookingCard";
import { BackendRoutes } from "@/config/apiRoutes";
import { Booking } from "@/types/api/Dentist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export const useBooking = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetch all bookings
  const {
    data: bookings = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!session?.user.token) return [];
      const response = await axios.get(BackendRoutes.BOOKING, {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
      return response.data.data;
    },
    enabled: !!session?.user.token,
  });

  // Create a new booking
  const createBookingMutation = useMutation({
    mutationFn: async (appointmentData: {
      apptDate: Date;
      user: string;
      dentist: string;
    }) => {
      return axios.post(BackendRoutes.BOOKING, appointmentData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Appointment booked successfully");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to book appointment";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
        console.error(error);
      }
    },
  });

  // Update an existing booking
  const updateBookingMutation = useMutation({
    mutationFn: async ({
      bookingId,
      appointmentDate,
    }: {
      bookingId: string;
      appointmentDate: Date;
    }) => {
      return axios.put(
        `${BackendRoutes.BOOKING}/${bookingId}`,
        { apptDate: appointmentDate.toISOString() },
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
            "Content-Type": "application/json",
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Appointment successfully rescheduled.");
    },
    onError: (error) => {
      toast.error("Error updating the appointment. Please try again.");
      console.error("Error updating booking:", error);
    },
  });

  // Delete a booking
  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return axios.delete(`${BackendRoutes.BOOKING}/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Appointment successfully deleted.");
    },
    onError: (error) => {
      toast.error("Error deleting the appointment. Please try again.");
      console.error("Error deleting booking:", error);
    },
  });

  // Book an appointment
  const bookAppointment = (
    dentistId: string,
    userId: string,
    date: Date,
    time: string,
  ) => {
    const combinedDateTime = combineDateAndTime(date, time);

    if (isNaN(combinedDateTime.getTime())) {
      toast.error("Invalid date or time");
      return;
    }

    createBookingMutation.mutate({
      apptDate: combinedDateTime,
      user: userId,
      dentist: dentistId,
    });

    return combinedDateTime;
  };

  // Reschedule an appointment
  const rescheduleAppointment = (
    bookingId: string,
    date: Date,
    time: string,
  ) => {
    const combinedDateTime = combineDateAndTime(date, time);

    if (isNaN(combinedDateTime.getTime())) {
      toast.error("Invalid date or time");
      return;
    }

    updateBookingMutation.mutate({
      bookingId,
      appointmentDate: combinedDateTime,
    });

    return combinedDateTime;
  };

  // Delete an appointment
  const deleteAppointment = (bookingId: string) => {
    deleteBookingMutation.mutate(bookingId);
  };

  // Filter bookings
  const filterBookings = (searchTerm: string) => {
    if (!searchTerm.trim()) return bookings;

    return bookings.filter((booking: Booking) => {
      const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
      return (
        booking.user.name.toLowerCase().includes(lowercasedSearchTerm) ||
        booking.dentist?.name?.toLowerCase().includes(lowercasedSearchTerm)
      );
    });
  };

  // Get a booking for a specific user
  const getUserBooking = (userId: string) => {
    return (
      bookings.find((booking: Booking) => booking.user._id === userId) || null
    );
  };

  return {
    bookings,
    isLoading,
    error,
    refetch,
    bookAppointment,
    rescheduleAppointment,
    deleteAppointment,
    filterBookings,
    getUserBooking,
    isCreating: createBookingMutation.isPending,
    isUpdating: updateBookingMutation.isPending,
    isDeleting: deleteBookingMutation.isPending,
  };
};
