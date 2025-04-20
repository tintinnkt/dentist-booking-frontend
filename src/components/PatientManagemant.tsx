"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { LoaderIcon, XCircleIcon, Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BackendRoutes } from "@/config/apiRoutes";
import { useSession } from "next-auth/react";

export default function PatientManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();

  const fetchBookings = async (): Promise<Array<any>> => {
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
  const groupedBookings = bookings.reduce((acc, booking) => {
    const userId = booking.user._id;
    if (!acc[userId]) {
      acc[userId] = {
        user: booking.user,
        appointments: [],
      };
    }
    acc[userId].appointments.push(booking);
    return acc;
  }, {} as Record<string, any>);

  // Filter patients based on search query
  const filteredPatients = Object.values(groupedBookings).filter((patient: any) =>
    `${patient.user.name} ${patient.user.email} ${patient.user.tel}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
    <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
      <div className="font-bold text-lg mb-2">Patient Management</div>
      <div className="text-gray-400 mb-4 text-sm">
        View and manage patient information and appointment status
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search patient by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {/* Patient Cards */}
      {filteredPatients.length === 0 ? (
        <div className="text-gray-500 text-sm italic">No patients found.</div>
      ) : (
        filteredPatients.map((patient: any) => (
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

                <div className="mt-3 font-bold text-sm">Appointments</div>
                <div className="space-y-2 mt-2">
                  {patient.appointments.map((appt: any) => (
                    <div key={appt._id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <span className="mr-2">
                          {appt.status === "Cancel" ? (
                            <X size={16} className="text-red-500" />
                          ) : (
                            <Check size={16} className="text-green-500" />
                          )}
                        </span>
                        <span>
                          {new Date(appt.apptDateAndTime).toLocaleDateString()} at{" "}
                          {new Date(appt.apptDateAndTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
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