"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, LoaderIcon, XCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BackendRoutes } from "@/config/apiRoutes";

// API call to fetch all bookings data
const fetchBookings = async (): Promise<Array<any>> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    window.location.href = "/login";
    return [];
  }

  try {
    const response = await axios.get("http://localhost:5000/api/v1/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error("Failed to fetch bookings data");

  } catch (err: any) {
    if (err.response?.status === 401) {
      console.error("Unauthorized access. Redirecting to login...");
      window.location.href = "/login";
      return [];
    } else {
      console.error("Error fetching data:", err);
      throw err;
    }
  }
};

export default function PatientManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: bookings = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
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

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
        <p className="text-red-500 flex items-center gap-2">
          <XCircleIcon size={18} /> Error: {(error as Error).message}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
        <p className="flex items-center justify-center gap-3 pt-4">
          <LoaderIcon className="animate-spin" size={18} /> Loading bookings data...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
      <div className="font-bold text-lg mb-2">Patient Management</div>
      <div className="text-gray-400 mb-4 text-sm">
        View and manage patient information and upcoming appointments
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
          <Card key={patient.user._id} className="mb-4 cursor-pointer hover:shadow-lg">
            <CardContent className="flex flex-col p-4">
              <div>
                <div className="font-bold">{patient.user.name}</div>
                <div className="text-sm text-gray-400">Patient ID: {patient.user._id}</div>
                <div className="text-sm text-gray-500">Phone: {patient.user.tel}</div>
                <div className="text-sm text-gray-500">Email: {patient.user.email}</div>

                <div className="mt-3 font-bold text-sm">Appointments</div>
                <ul className="text-sm list-disc ml-4">
                  {patient.appointments.map((appt: any) => (
                    <li key={appt._id}>
                      {new Date(appt.apptDateAndTime).toLocaleDateString()} at{" "}
                      {new Date(appt.apptDateAndTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
