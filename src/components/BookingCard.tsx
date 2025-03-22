"use client";
import { twJoin } from "tailwind-merge";
import { CustomButton } from "./CustomButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Separator } from "./ui/Separator";
interface BookingProps {
  id: string;
  owner: string;
  dentist: string;
  date: string;
}
interface BookingCardProps {
  isMyBooking?: boolean;
  booking: BookingProps;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isMyBooking = false,
}) => {
  return (
    <Card
      className={twJoin(
        "w-full max-w-xl rounded-xl",
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

      <CardContent className="grid w-full grid-cols-2 sm:grid-cols-3">
        {!isMyBooking && (
          <>
            <p>Owner</p>
            <p className="col-span-2">{booking.owner}</p>
          </>
        )}
        <p>Dentist</p>
        <p className="col-span-2">{booking.dentist}</p>
        <p>Date</p>
        <p className="col-span-2">{booking.date}</p>
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
