"use client";

import { BackendRoutes } from "@/config/apiRoutes";
import { Booking } from "@/types/api/Dentist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { twJoin } from "tailwind-merge";
import { CustomButton } from "./CustomButton";
import { Calendar } from "./ui/Calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Separator } from "./ui/Separator";

interface BookingCardProps {
  booking: Booking;
  isMyBooking?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isMyBooking = false,
}) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(booking.apptDate),
  );

  const toggleEditMode = () => {
    if (isEditing) {
      // Reset selected date when canceling edit
      setSelectedDate(new Date(booking.apptDate));
    }
    setIsEditing((prev) => !prev);
  };

  // Mutation for updating appointment date
  const { mutate: handleUpdateAppDate, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      return axios.put(
        `${BackendRoutes.BOOKING}/${booking._id}`,
        {
          apptDate: selectedDate.toISOString(),
        },
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
      toast.success(`Appointment successfully rescheduled.`);
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Error updating the appointment. Please try again.");
      console.error("Error updating booking:", error);
    },
  });

  // Handle confirm edit
  const handleConfirmEdit = () => {
    if (
      selectedDate.toISOString() === new Date(booking.apptDate).toISOString()
    ) {
      toast.error("No changes detected.");
      return;
    }
    handleUpdateAppDate();
  };

  const { mutate: handleDeleteBooking, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      return axios.delete(`${BackendRoutes.BOOKING}/${booking._id}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success(`Appointment successfully Deleted.`);
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Error updating the appointment. Please try again.");
      console.error("Error updating booking:", error);
    },
  });

  return (
    <Card
      className={twJoin(
        "w-full max-w-lg rounded-xl",
        isMyBooking ? "pt-0" : "",
      )}
    >
      {isMyBooking && (
        <CardHeader className="rounded-t-xl bg-emerald-400 p-4">
          <CardTitle>My Booking</CardTitle>
        </CardHeader>
      )}
      <CardContent className="grid w-full grid-cols-2 space-y-3 sm:grid-cols-3">
        <p>Owner</p>
        <p className="col-span-2">{booking.user.name}</p>
        <p>Dentist</p>
        <p className="col-span-2">{booking.dentist?.name}</p>
        <p>Date</p>
        {isEditing ? (
          <div className="col-span-2">
            <p className="text-sm font-medium">
              {selectedDate.toLocaleDateString("en-GB")}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Select a new date below
            </p>
          </div>
        ) : (
          <span className="col-span-2">
            {new Date(booking.apptDate).toLocaleDateString("en-GB")}
          </span>
        )}
        {isEditing ? (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            month={selectedDate}
            className="col-span-3 mt-4"
          />
        ) : (
          <Calendar
            mode="single"
            selected={new Date(booking.apptDate)}
            month={new Date(booking.apptDate)}
            className="col-span-3 mt-4"
            disabled
          />
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <CustomButton
              useFor="cancel"
              onClick={toggleEditMode}
              disabled={isUpdating}
            />
            <CustomButton
              useFor="confirm-edit"
              onClick={handleConfirmEdit}
              isLoading={isUpdating}
            />
          </>
        ) : (
          <CustomButton useFor="edit-booking" onClick={toggleEditMode} />
        )}
        {isMyBooking ? (
          <CustomButton
            useFor="cancel-booking"
            isLoading={isDeleting}
            onClick={() => handleDeleteBooking()}
          />
        ) : (
          <CustomButton
            useFor="delete"
            isLoading={isDeleting}
            onClick={() => handleDeleteBooking()}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingCard;
