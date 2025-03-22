import BookingCard from "@/components/BookingCard";
import { SearchBar } from "@/components/SearchBar";
import { mockBookings } from "@/mock/BookingMock";

const Page = () => {
  const bookings = mockBookings;
  const user = {
    name: "Nomsod Belle",
  };
  const myBooking = mockBookings.find((b) => b.owner == user.name);
  return (
    <main className="space-y-10">
      <section className="flex w-full flex-col items-center justify-center pt-10">
        <h1 className="p-4 text-3xl font-bold">My Booking</h1>
        {myBooking ? (
          <BookingCard isMyBooking booking={myBooking} />
        ) : (
          <p className="text-gray-500">No booking</p>
        )}
      </section>
      <section className="w-full place-items-center py-3">
        <div className="flex w-full items-center justify-center space-x-4 py-4">
          <h1 className="text-2xl font-bold">Bookings</h1>
          <SearchBar />
        </div>
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <li key={booking.id}>
              <BookingCard booking={booking} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Page;
