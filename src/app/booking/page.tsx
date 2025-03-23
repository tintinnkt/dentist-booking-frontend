"use client";
import BookingCard from "@/components/BookingCard";
import { SearchBar } from "@/components/SearchBar";
import { useUserBookings } from "@/hooks/userUserBooking";
import { useUser } from "@/hooks/useUser";
import { mockBookings } from "@/mock/BookingMock";

const Page = () => {
  const bookings = mockBookings;
  const user = useUser().user;

  const { booking: myBooking } = useUserBookings();
  console.log("my booking:", myBooking);
  return (
    <main className="flex w-full justify-evenly space-y-10">
      <section className="col-span-1 flex w-full flex-col items-center pt-10 pl-5">
        <h1 className="p-4 text-3xl font-bold">My Booking</h1>
        {myBooking ? (
          <BookingCard isMyBooking booking={myBooking} />
        ) : (
          <p className="text-gray-500">No booking</p>
        )}
      </section>
      {
        <section className="w-full place-items-center py-3 pr-5">
          <div className="flex w-full items-center justify-center space-x-4 py-4">
            <h1 className="text-2xl font-bold">Bookings</h1>
            <SearchBar />
          </div>
          <ul className="space-y-3">
            {bookings.map((booking) => (
              <li key={booking._id}>
                <BookingCard booking={booking} />
              </li>
            ))}
          </ul>
        </section>
      }
    </main>
  );
};

export default Page;
