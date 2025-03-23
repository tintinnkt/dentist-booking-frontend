"use client";
import { Booking } from "@/types/api/Dentist";
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
  return (
    <Card
      className={twJoin(
        "w-fit max-w-lg rounded-xl",
        isMyBooking ? "pt-0" : null,
      )}
    >
      {isMyBooking && (
        <CardHeader className="rounded-t-xl bg-emerald-400 p-4">
          <CardTitle className="flex flex-wrap items-center space-y-1 space-x-4">
            My Booking
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="grid w-full grid-cols-2 space-y-3 sm:grid-cols-3">
        <p>Owner</p>
        <p className="col-span-2">{booking.user}</p>
        <p>Dentist</p>
        <p className="col-span-2">{booking.dentist?.name}</p>
        <p>Date</p>
        <p className="col-span-2">
          {new Date(booking.apptDate).toLocaleDateString("en-GB")}
        </p>
        {isMyBooking && (
          <Calendar
            mode="single"
            selected={new Date(booking.apptDate)}
            month={new Date(booking.apptDate)}
          />
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-end space-x-2">
        {isMyBooking ? (
          <CustomButton useFor="cancel-booking" />
        ) : (
          <>
            <CustomButton useFor="edit" />
            <CustomButton useFor="delete-booking" />
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingCard;
