"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, LoaderIcon, XCircleIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BackendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Updated interface to match your API response structure
interface Booking {
  _id: string;
  apptDateAndTime: string;
  user: {
    _id: string;
    name: string;
    email: string;
    tel: string;
  };
  dentist: {
    _id: string;
    user: {
      _id: string;
      name: string;
      tel: string;
      email: string;
    };
    yearsOfExperience: number;
    areaOfExpertise: string[];
    id: string;
  };
  isUnavailable: boolean;
  status: string;
  createdAt: string;
  comment?: string;
}

interface Dentist {
  id: string;
  _id: string;
  user: {
    _id: string;
    name: string;
    tel: string;
    email: string;
  };
  yearsOfExperience: number;
  areaOfExpertise: string[];
  bookings: Booking[];
}

export default function DentistManagement() {
  const { user } = useUser();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedDentistId, setSelectedDentistId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const fetchDentists = async (): Promise<Array<Dentist>> => {
    if (!session?.user.token) return [];

    const response = await axios.get(BackendRoutes.DENTIST, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    });

    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error("Failed to fetch dentists data");
  };

  const getSortedBookings = (bookings) => {
    return [...bookings].sort((a, b) => {
      return new Date(a.apptDateAndTime).getTime() - new Date(b.apptDateAndTime).getTime();
    });
  };

  const {
    data: dentists = [],
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery<Dentist[], Error>({
    queryKey: ["dentists"],
    queryFn: fetchDentists,
    enabled: !!user && !!session?.user.token,
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ dentistId, bookingId }: { dentistId: string; bookingId: string }) => {
      if (!session?.user.token) throw new Error("Authentication required");

      await axios.delete(`${BackendRoutes.DENTIST}/${dentistId}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
      setError("");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleCardClick = (id: string) => {
    setSelectedDentistId(id === selectedDentistId ? null : id);
  };

  const handleDeleteBooking = async (dentistId: string, bookingId: string) => {
    deleteMutation.mutate({ dentistId, bookingId });
  };

  const filteredDentists = dentists.filter((dentist) =>
    `${dentist.user.name} ${dentist.areaOfExpertise?.join(" ")}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="p-8 text-center">
        Please <Link href="/login" className="text-blue-500 underline">login</Link> to view dentist information
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
        <div className="flex items-center justify-center gap-3 pt-4">
          <LoaderIcon className="animate-spin" size={18} /> Loading dentists data...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
        <div className="text-red-500 flex items-center gap-2">
          <XCircleIcon size={18} /> Error: {queryError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
      <div className="font-bold text-lg mb-2">Dentist Management</div>
      <div className="text-gray-400 mb-4 text-sm">
        View and manage dentist information, schedules, and comments
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-50 rounded-lg">
          <XCircleIcon className="inline mr-2" size={16} />
          {error}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search dentist by name or expertise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {filteredDentists.length === 0 ? (
        <div className="text-gray-500 text-sm italic">No dentists found.</div>
      ) : (
        filteredDentists.map((dentist) => (
          <div key={dentist.id || dentist._id}>
            <Card
              className={`mb-4 cursor-pointer hover:shadow-lg ${
                selectedDentistId === (dentist.id || dentist._id) ? "border-2 border-orange-400" : ""
              }`}
              onClick={() => handleCardClick(dentist.id || dentist._id)}
            >
              <CardContent className="flex justify-between p-4">
                <div>
                  <div className="font-bold">{dentist.user.name}</div>
                  <div className="text-sm text-gray-400">
                    {dentist.areaOfExpertise?.join(", ")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dentist.yearsOfExperience} years of experience
                  </div>

                  {dentist.bookings && dentist.bookings.length > 0 && (
                    <>
                      <div className="mt-3 font-bold text-sm">Today's Schedule</div>
                      <div className="text-sm">
                        {getSortedBookings(dentist.bookings).map((booking, idx) => (
                          <div key={idx} className="flex items-center gap-2 mt-1">
                            <span>
                              {new Date(booking.apptDateAndTime).toLocaleDateString()} -{" "}
                              {new Date(booking.apptDateAndTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                booking.status.toLowerCase() === "cancel"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {booking.status === "cancel" ? "Cancel" : "Booked"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedDentistId === (dentist.id || dentist._id) && dentist.bookings && dentist.bookings.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 mt-2 mb-6">
                <div className="font-bold mb-3">{dentist.user.name}'s Comments</div>
                {getSortedBookings(dentist.bookings).map((booking, idx) => (
                  <div
                    key={idx}
                    className="border rounded-xl p-4 mb-3 shadow-sm bg-white flex justify-between"
                  >
                    <div className="w-full">
                      {/* Display patient name correctly from the API response structure */}
                      <div className="font-bold text-sm">
                        {booking.user && booking.user.name}
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(booking.apptDateAndTime).toLocaleString([], {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </div>

                      <div className="text-sm mt-1">
                        Status:{" "}
                        <span
                          className={`${
                            booking.status.toLowerCase() === "cancel"
                              ? "text-red-600"
                              : "text-green-600"
                          } font-semibold`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-3 mb-2">
                        <div className="text-sm font-semibold text-gray-700">Comment:</div>
                        <div className="p-3 bg-gray-50 rounded-lg mt-1 text-sm">
                          {booking.comment ? (
                            booking.comment
                          ) : (
                            <span className="text-gray-400 italic">No comment for this appointment.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {user.role === Role_type.ADMIN && (
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBooking(dentist.id || dentist._id, booking._id);
                          }}
                          className="text-gray-500 hover:text-red-500"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <LoaderIcon className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}