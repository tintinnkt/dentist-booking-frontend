"use client";
import BookingCard from "@/components/BookingCard";
import { SearchBar } from "@/components/SearchBar";
import { BackendRoutes, FrontendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { Booking } from "@/types/api/Dentist";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";
const Page = () => {
  const [myBooking, setMyBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const [filteredBookings, setFilteredBookings] = useState<Array<Booking>>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: session } = useSession();
  const { user } = useUser();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = bookings.filter((booking) => {
      const lowercasedSearchTerm = value.toLowerCase().trim();
      return (
        booking.user.name.toLowerCase().includes(lowercasedSearchTerm) ||
        booking.dentist?.name?.toLowerCase().includes(lowercasedSearchTerm)
      );
    });
    setFilteredBookings(filtered);
  };

  const fetchBookings = async (token: string | undefined) => {
    if (!token) return [];
    const response = await axios.get(BackendRoutes.BOOKING, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings", session?.user.token],
    queryFn: () => fetchBookings(session?.user.token),
    enabled: !!session?.user.token,
  });

  useEffect(() => {
    if (data && user) {
      if (user.role === Role_type.USER) {
        const userBooking = data.find(
          (booking: Booking) => booking.user._id === user._id,
        );
        setMyBooking(userBooking || null);
        setBookings([]);
        setFilteredBookings([]);
      } else if (user.role === Role_type.ADMIN) {
        setBookings(data);
        setFilteredBookings(data);
        setMyBooking(null);
      }
    }
  }, [data, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 pt-10">
        <LoaderIcon /> Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error loading bookings</div>
    );
  }

  return (
    <main className="flex w-full flex-col justify-evenly space-y-10">
      {myBooking ? (
        <section className="col-span-1 flex w-full flex-col items-center pt-10 pl-5">
          <h1 className="p-4 text-3xl font-bold">My Booking</h1>
          <BookingCard isMyBooking booking={myBooking} />
        </section>
      ) : user.role === Role_type.USER ? (
        <div className="w-full place-items-center pt-10 text-center">
          No Own Booking{" "}
          <Link
            href={FrontendRoutes.DENTIST_LIST}
            className="text-blue-500 underline"
          >
            get one
          </Link>
        </div>
      ) : null}

      {user.role === Role_type.ADMIN && bookings.length > 0 ? (
        <section className="flex w-full flex-col place-items-center items-center justify-center py-3 pr-5">
          <div className="flex w-full items-center justify-center space-x-4 py-4">
            <h1 className="text-2xl font-bold">Bookings</h1>
            <SearchBar
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={() => handleSearch(searchTerm)}
            />
          </div>
          <ul className="flex w-full grid-cols-2 flex-col items-center justify-center space-y-3">
            {filteredBookings.map((booking) => (
              <li key={booking._id}>
                <BookingCard booking={booking} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
};

export default Page;
