"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { BackendRoutes } from "@/config/apiRoutes";
import { Booking, BookingUserProps } from "@/types/api/Booking";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowUpDown, Check, LoaderIcon, X, XCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface GroupedPatient {
  user: BookingUserProps;
  appointments: Array<Booking>;
}

export default function PatientManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { data: session } = useSession();

  const fetchBookings = async (): Promise<Array<Booking>> => {
    if (!session?.user.token) throw new Error("Authentication required");
    const response = await axios.get(BackendRoutes.BOOKING, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    });

    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error("Failed to fetch bookings data");
  };

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    enabled: !!session?.user.token, // only fetch when token is ready
  });

  // Group bookings by patient ID
  const groupedBookings = bookings.reduce(
    (acc, booking) => {
      const userId = booking.user._id;
      if (!acc[userId]) {
        acc[userId] = {
          user: booking.user,
          appointments: [],
        };
      }
      acc[userId].appointments.push(booking);
      return acc;
    },
    {} as Record<string, GroupedPatient>,
  );

  // Filter patients based on search query
  const filteredPatients = Object.values(groupedBookings).filter((patient) =>
    `${patient.user.name} ${patient.user.email} ${patient.user.tel}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // Sort appointments for each patient based on date
  filteredPatients.forEach((patient) => {
    patient.appointments.sort((a, b) => {
      const dateA = new Date(a.apptDateAndTime).getTime();
      const dateB = new Date(b.apptDateAndTime).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
  });

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  if (!session?.user.token) {
    return (
      <div className="p-8 text-center">
        Please{" "}
        <a href="/login" className="text-blue-500 underline">
          login
        </a>{" "}
        to view patient information.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 pt-10">
        <LoaderIcon className="animate-spin" /> Loading patient data...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-red-500">
        <XCircleIcon /> Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full rounded-xl bg-white p-8 shadow-md">
      <div className="mb-2 text-lg font-bold">Patient Management</div>
      <div className="mb-4 text-sm text-gray-400">
        View and manage patient information and appointment status
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search patient by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-sm md:w-2/3"
        />

        <button
          onClick={toggleSortDirection}
          className="flex items-center justify-center gap-2 rounded-md border border-gray-300 p-2 text-sm hover:bg-gray-50"
        >
          <ArrowUpDown size={16} />
          Sort by Date:{" "}
          {sortDirection === "asc" ? "Oldest First" : "Newest First"}
        </button>
      </div>

      {/* Patient Cards */}
      {filteredPatients.length === 0 ? (
        <div className="text-sm text-gray-500 italic">No patients found.</div>
      ) : (
        filteredPatients.map((patient) => (
          <Card
            key={patient.user._id}
            className="mb-4 cursor-pointer hover:shadow-lg"
          >
            <CardContent className="flex flex-col p-4">
              <div>
                <div className="font-bold">{patient.user.name}</div>
                <div className="text-sm text-gray-400">
                  Patient ID: {patient.user._id}
                </div>
                <div className="text-sm text-gray-500">
                  Phone: {patient.user.tel}
                </div>
                <div className="text-sm text-gray-500">
                  Email: {patient.user.email}
                </div>

                <div className="mt-3 text-sm font-bold">
                  Appointments
                  <span className="ml-2 text-xs text-gray-400">
                    (
                    {sortDirection === "asc"
                      ? "oldest to newest"
                      : "newest to oldest"}
                    )
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  {patient.appointments.map((appt) => (
                    <div
                      key={appt._id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center">
                        <span className="mr-2">
                          {appt.status === "cancel" ? (
                            <X size={16} className="text-red-500" />
                          ) : (
                            <Check size={16} className="text-green-500" />
                          )}
                        </span>
                        <span>
                          {new Date(appt.apptDateAndTime).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(appt.apptDateAndTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          appt.status === "cancel"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {appt.status === "cancel" ? "Cancel" : "Booked"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
