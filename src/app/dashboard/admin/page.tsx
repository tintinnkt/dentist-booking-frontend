"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { BackendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { Booking } from "@/types/api/Booking";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LoaderIcon, Trash2, XCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface Dentist {
  id: string;
  user: {
    _id: string;
    name: string;
  };
  yearsOfExperience: number;
  areaOfExpertise: Array<string>;
  bookings: Array<Booking>;
}

export default function Page() {
  const { user } = useUser();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedDentistId, setSelectedDentistId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  // if (!user || user.role !== Role_type.ADMIN)
  //   redirect(FrontendRoutes.DENTIST_LIST);

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

  // Sort bookings by date function
  const getSortedBookings = (bookings: Array<Booking>) => {
    return [...bookings].sort((a, b) => {
      return (
        new Date(a.apptDateAndTime).getTime() -
        new Date(b.apptDateAndTime).getTime()
      );
    });
  };

  const {
    data: dentists = [],
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery<Array<Dentist>, Error>({
    queryKey: ["dentists"],
    queryFn: fetchDentists,
    enabled: !!user && !!session?.user.token, // Only fetch when user and token are available
  });

  const deleteMutation = useMutation({
    mutationFn: async ({
      dentistId,
      commentId,
    }: {
      dentistId: string;
      commentId: string;
    }) => {
      if (!session?.user.token) throw new Error("Authentication required");

      await axios.delete(
        `${BackendRoutes.DENTIST}/${dentistId}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${session.user.token}` },
        },
      );
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

  const handleDeleteComment = async (dentistId: string, commentId: string) => {
    deleteMutation.mutate({ dentistId, commentId });
  };

  const filteredDentists = dentists.filter((dentist) =>
    `${dentist.user.name} ${dentist.areaOfExpertise?.join(" ")}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  if (!user) {
    return (
      <div className="p-8 text-center">
        Please{" "}
        <Link href="/login" className="text-blue-500 underline">
          login
        </Link>{" "}
        to view dentist information
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full rounded-xl bg-white p-8 shadow-md">
        <div className="flex items-center justify-center gap-3 pt-4">
          <LoaderIcon className="animate-spin" size={18} /> Loading dentists
          data...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-[90%] rounded-xl bg-white p-8 shadow-md">
        <div className="flex items-center gap-2 text-red-500">
          <XCircleIcon size={18} /> Error: {queryError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] rounded-xl bg-white p-8 shadow-md">
      <div className="mb-2 text-lg font-bold">Dentist Management</div>
      <div className="mb-4 text-sm text-gray-400">
        View and manage dentist information, schedules, and comments
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-500">
          <XCircleIcon className="mr-2 inline" size={16} />
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search dentist by name or expertise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-sm"
        />
      </div>

      {/* Dentist Cards */}
      {filteredDentists.length === 0 ? (
        <div className="text-sm text-gray-500 italic">No dentists found.</div>
      ) : (
        filteredDentists.map((dentist) => (
          <div key={dentist.id}>
            <Card
              className={`mb-4 cursor-pointer hover:shadow-lg ${selectedDentistId === dentist.id ? "border-2 border-orange-400" : ""}`}
              onClick={() => handleCardClick(dentist.id)}
            >
              <CardContent className="flex justify-between p-4">
                <div>
                  <div className="font-bold">{dentist.user.name}</div>
                  <div className="text-sm text-gray-400">
                    {dentist.areaOfExpertise?.join(", ")}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {dentist.yearsOfExperience} years of experience
                  </div>

                  <div className="mt-3 text-sm font-bold">Today's Schedule</div>
                  <div className="text-sm">
                    {dentist.bookings.length > 0 ? (
                      getSortedBookings(dentist.bookings).map(
                        (booking, idx) => (
                          <div
                            key={idx}
                            className="mt-1 flex items-center gap-2"
                          >
                            <span>
                              {new Date(
                                booking.apptDateAndTime,
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                booking.apptDateAndTime,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span
                              className={`rounded px-2 py-0.5 text-xs font-semibold ${
                                booking.status.toLowerCase() === "cancel"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {booking.status === "cancel"
                                ? "Cancel"
                                : "Booked"}
                            </span>
                          </div>
                        ),
                      )
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        No schedule for today
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            {selectedDentistId === dentist.id && (
              <div className="mt-2 mb-6 rounded-xl bg-white p-6 shadow-md">
                <div className="mb-3 font-bold">
                  {dentist.user.name}'s Bookings
                </div>
                {dentist.bookings.length === 0 ? (
                  <div className="text-sm text-gray-500 italic">
                    No bookings available
                  </div>
                ) : (
                  getSortedBookings(dentist.bookings).map((booking, idx) => (
                    <div
                      key={idx}
                      className="mb-3 flex justify-between rounded-xl border bg-white p-4 shadow-sm"
                    >
                      <div>
                        <div className="text-sm font-bold">{booking._id}</div>
                        <div className="mt-1 text-sm">{booking.status}</div>
                        <div className="mt-2 text-sm font-bold text-black">
                          Appointment on{" "}
                          {new Date(
                            booking.apptDateAndTime,
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(booking.apptDateAndTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </div>
                      {/* Only show delete button for admins */}
                      {user.role === Role_type.ADMIN && (
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteComment(dentist.id, booking._id);
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
                  ))
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
