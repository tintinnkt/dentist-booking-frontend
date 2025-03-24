"use client";
import BookingCard from "@/components/BookingCard";
import { SearchBar } from "@/components/SearchBar";
import { BackendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { Booking } from "@/types/api/Dentist";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";

const Page = () => {
  const [myBooking, setMyBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { data: session } = useSession();
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch bookings based on the user role
  const fetchBookings = async () => {
    try {
      const response = await axios.get(BackendRoutes.BOOKING, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });

      if (user?.role === Role_type.USER) {
        const userBooking = response.data.data.find(
          (booking: Booking) => booking.user._id === user._id,
        );
        setMyBooking(userBooking || null);
        setBookings([]);
      } else if (user?.role === Role_type.ADMIN) {
        setBookings(response.data.data);
        setMyBooking(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchBookings();
    }
  }, [user?._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 pt-10">
        <LoaderIcon /> Loading...
      </div>
    );
  }

  return (
    <main className="flex w-full justify-evenly space-y-10">
      {myBooking ? (
        <section className="col-span-1 flex w-full flex-col items-center pt-10 pl-5">
          <h1 className="p-4 text-3xl font-bold">My Booking</h1>

          <BookingCard isMyBooking booking={myBooking} />
        </section>
      ) : null}

      <section className="flex w-full flex-col place-items-center items-center justify-center py-3 pr-5">
        <div className="flex w-full items-center justify-center space-x-4 py-4">
          <h1 className="text-2xl font-bold">Bookings</h1>
          <SearchBar />
        </div>
        <ul className="flex w-full grid-cols-2 flex-col items-center justify-center space-y-3">
          {bookings &&
            bookings.map((booking) => (
              <li key={booking._id}>
                <BookingCard booking={booking} />
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
};

export default Page;