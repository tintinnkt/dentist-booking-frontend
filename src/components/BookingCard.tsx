"use client";

import { timeSlots } from "@/constant/expertise";
import { useBooking } from "@/hooks/useBooking";
import { Booking } from "@/types/api/Dentist";
import { format } from "date-fns";
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

export const combineDateAndTime = (date: Date, time: string) => {
  const combined = new Date(date);

  const [hourMin, period] = time.split(" ");
  let [hours, minutes] = hourMin.split(":").map(Number);

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  combined.setHours(hours, minutes, 0, 0);

  return combined;
};

interface BookingCardProps {
  booking: Booking;
  isMyBooking?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isMyBooking = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(booking.apptDateAndTime),
  );
  const [appTime, setAppTime] = useState<string>(
    booking.apptDateAndTime
      ? format(new Date(booking.apptDateAndTime), "HH:mm")
      : timeSlots[0],
  );

  const { rescheduleAppointment, deleteAppointment, isUpdating, isDeleting } =
    useBooking();

  const toggleEditMode = () => {
    if (isEditing) {
      // Reset selected date and time when canceling edit
      setSelectedDate(new Date(booking.apptDateAndTime));
      setAppTime(format(new Date(booking.apptDateAndTime), "HH:mm"));
    }
    setIsEditing((prev) => !prev);
  };

  // Handle confirm edit
  const handleConfirmEdit = () => {
    const originalDate = new Date(booking.apptDateAndTime);
    const combinedDateTime = combineDateAndTime(selectedDate, appTime);

    if (combinedDateTime.toISOString() === originalDate.toISOString()) {
      toast.error("No changes detected.");
      return;
    }

    // Pass a callback to update local state after successful reschedule
    rescheduleAppointment(booking._id, selectedDate, appTime, () => {
      // Update the booking reference with the new date/time
      booking.apptDateAndTime = combinedDateTime.toISOString();
    });
    setIsEditing(false);
  };

  const handleDeleteBooking = () => {
    deleteAppointment(booking._id);
  };

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
        <p className="col-span-1 px-1 sm:col-span-2">
          {booking.dentist?.user.name}
        </p>
        <p>Date</p>
        <span>{format(new Date(booking.apptDateAndTime), "PP | HH:mm")}</span>
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <CustomButton
              useFor={isMyBooking ? "cancel-booking" : "delete"}
              isLoading={isDeleting}
            />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              {isMyBooking
                ? "This booking will be deleted. You can always get a new booking."
                : "This booking will be deleted. The record is not possible to restore."}
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteBooking}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default BookingCard;