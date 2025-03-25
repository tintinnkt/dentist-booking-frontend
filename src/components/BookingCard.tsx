"use client";

import { BackendRoutes } from "@/config/apiRoutes";
import { timeSlots } from "@/constant/expertise";
import { Booking } from "@/types/api/Dentist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { twJoin } from "tailwind-merge";
import { CustomButton } from "./CustomButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/AlertDialog";
import { Calendar } from "./ui/Calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Separator } from "./ui/Separator";

// Utility function to combine date and time
export function combineDateAndTime(date: Date, time: string): Date {
  const dateString = date.toISOString().split("T")[0];
  const combinedDateTimeString = `${dateString}T${time}:00`;
  const combinedDateTime = new Date(combinedDateTimeString);
  return combinedDateTime;
}

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
  const [appTime, setAppTime] = useState<string>(
    // Extract time from existing booking date or default to first slot
    booking.apptDate
      ? format(new Date(booking.apptDate), "HH:mm")
      : timeSlots[0],
  );

  const toggleEditMode = () => {
    if (isEditing) {
      // Reset selected date and time when canceling edit
      setSelectedDate(new Date(booking.apptDate));
      setAppTime(format(new Date(booking.apptDate), "HH:mm"));
    }
    setIsEditing((prev) => !prev);
  };

  // Mutation for updating appointment
  const { mutate: handleUpdateAppointment, isPending: isUpdating } =
    useMutation({
      mutationFn: async () => {
        // Combine selected date and time
        const combinedDateTime = combineDateAndTime(selectedDate, appTime);

        return axios.put(
          `${BackendRoutes.BOOKING}/${booking._id}`,
          {
            apptDate: combinedDateTime.toISOString(),
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
    const originalDate = new Date(booking.apptDate);
    const combinedDateTime = combineDateAndTime(selectedDate, appTime);

    if (combinedDateTime.toISOString() === originalDate.toISOString()) {
      toast.error("No changes detected.");
      return;
    }
    handleUpdateAppointment();
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
      <CardContent className="grid w-full grid-cols-2 space-y-3.5 sm:grid-cols-3">
        <p>Owner</p>
        <p className="col-span-1 px-1 sm:col-span-2">{booking.user.name}</p>
        <p>Dentist</p>
        <p className="col-span-1 px-1 sm:col-span-2">{booking.dentist?.name}</p>
        <p>Date</p>

        <span>{format(new Date(booking.apptDate), "PP | HH:mm")}</span>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-end space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <CustomButton useFor="edit-booking" onClick={toggleEditMode} />
          </PopoverTrigger>
          <PopoverContent className="">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={selectedDate}
              className="col-span-3 mt-4"
            />
            <div className="flex flex-col space-y-2 pb-2">
              <h4 className="text-sm font-medium">
                Time for {format(selectedDate, "EEEE, MMMM do")}
              </h4>
              <Select value={appTime} onValueChange={setAppTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-1.5">
              
              <CustomButton
                useFor="confirm-info"
                onClick={handleConfirmEdit}
                isLoading={isUpdating}
              />
            </div>
          </PopoverContent>
        </Popover>

        {isMyBooking ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <CustomButton useFor="cancel-booking" isLoading={isDeleting} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                This booking will be deleted. You can always get a new booking.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteBooking()}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <CustomButton useFor="delete" isLoading={isDeleting} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                This booking will be deleted. The record is not possible to
                restore.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteBooking()}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingCard;
