"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { BackendRoutes } from "@/config/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Calendar, LoaderIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  apptDateAndTime: string;
  dentist: {
    _id: string;
    name: string;
  };
  // Only use status with "Booked" or "Cancel"
  status: "Booked" | "Cancel";
}

interface Dentist {
  id: number;
  _id: string;
  name: string;
}

// API calls
const fetchUnavailableBookings = async (
  dentistId?: string,
  date?: string,
): Promise<Array<Booking>> => {
  const url = BackendRoutes.UNAVAILABLE_BOOKING;
  const params: Record<string, string> = {};

  if (dentistId) params.dentistId = dentistId;
  if (date) params.date = date;

  const response = await axios.get(url, { params });
  if (Array.isArray(response.data.data)) {
    return response.data.data;
  }
  throw new Error("Failed to fetch bookings data");
};

const fetchDentists = async (): Promise<Array<Dentist>> => {
  const response = await axios.get(BackendRoutes.DENTIST);
  if (Array.isArray(response.data.data)) {
    return response.data.data;
  }
  throw new Error("Failed to fetch dentists data");
};

export default function ScheduleManagement() {
  const [selectedDentist, setSelectedDentist] = useState<string>("");
  const [selectedDentistId, setSelectedDentistId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [viewMode, setViewMode] = useState("Dental schedules");
  const [formattedDate, setFormattedDate] = useState<string | undefined>();

  // Format the date for API calls whenever selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      // Format date as YYYY-MM-DD for API
      setFormattedDate(format(selectedDate, "yyyy-MM-dd"));
    } else {
      setFormattedDate(undefined);
    }
  }, [selectedDate]);

  // Fetch dentists data
  const {
    data: dentists = [],
    isLoading: isLoadingDentists,
    error: dentistsError,
  } = useQuery({
    queryKey: ["dentists"],
    queryFn: fetchDentists,
  });

  // Fetch bookings data with filters
  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    error: bookingsError,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ["unavailableBookings", selectedDentistId, formattedDate],
    queryFn: () => fetchUnavailableBookings(selectedDentistId, formattedDate),
    enabled: !!selectedDentistId || !!formattedDate, // Only run if there's a selected dentist or date
  });

  // Update selected dentist ID when dentist name changes
  useEffect(() => {
    if (selectedDentist && dentists.length > 0) {
      const dentist = dentists.find((d) => d.name === selectedDentist);
      if (dentist) {
        setSelectedDentistId(dentist._id);
      }
    }
  }, [selectedDentist, dentists]);

  // Set initial dentist when dentists are loaded
  useEffect(() => {
    if (dentists.length > 0 && !selectedDentist) {
      setSelectedDentist(dentists[0].name);
    }
  }, [dentists, selectedDentist]);

  const handleSearch = () => {
    refetchBookings();
  };

  // Format bookings for display
  const formattedBookings = bookings.map((booking) => {
    const bookingDate = new Date(booking.apptDateAndTime);
    return {
      id: booking._id,
      dentistName: booking.dentist.name,
      date: format(bookingDate, "yyyy-MM-dd"),
      time:
        format(bookingDate, "HH:mm - ") +
        format(new Date(bookingDate.getTime() + 60 * 60 * 1000), "HH:mm"), // Assuming 1 hour appointments
      status: booking.status,
      type:
        viewMode === "Dental schedules"
          ? "Unavailable Time"
          : "Booked Appointment",
    };
  });

  // Filter bookings based on the view mode
  const filteredBookings =
    viewMode === "Dental schedules"
      ? formattedBookings // Unavailable times are fetched by the API
      : formattedBookings.filter(
          (booking) =>
            booking.status === "Booked" || booking.status === "Cancel",
        );

  if (dentistsError || bookingsError) {
    const error = dentistsError || bookingsError;
    return (
      <div className="w-[90%] rounded-xl bg-white p-8 shadow-md">
        <p className="flex items-center gap-2 text-red-500">
          <XCircleIcon size={18} /> Error: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="w-[90%] rounded-xl bg-white p-8 shadow-md">
      <div className="mb-2 text-lg font-bold">Schedule Management</div>
      <div className="mb-4 text-sm text-gray-400">
        View and manage dentist schedules and unavailable time slots
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Select Dentist
          </label>
          {isLoadingDentists ? (
            <div className="flex h-10 w-[200px] items-center justify-center rounded bg-gray-100">
              <LoaderIcon className="animate-spin" size={16} />
            </div>
          ) : (
            <Select value={selectedDentist} onValueChange={setSelectedDentist}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Dentist" />
              </SelectTrigger>
              <SelectContent>
                {dentists.map((dentist) => (
                  <SelectItem
                    key={dentist._id || dentist.id}
                    value={dentist.name}
                  >
                    {dentist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Select Date</label>
          <DatePickerWithPresets
            value={selectedDate}
            onChange={setSelectedDate}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">View mode</label>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dental schedules">
                Unavailable Times
              </SelectItem>
              <SelectItem value="Appointments">Booked Appointments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <button
            className="rounded bg-orange-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-orange-300"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4 text-base font-semibold">
        {viewMode === "Dental schedules" ? "Unavailable Times" : "Appointments"}{" "}
        for {selectedDentist || "all dentists"}{" "}
        {formattedDate ? `on ${formattedDate}` : ""}
      </div>

      {/* Loading State */}
      {isLoadingBookings && (
        <div className="flex items-center justify-center p-6">
          <LoaderIcon className="mr-2 animate-spin" size={20} />
          <span>Loading schedule data...</span>
        </div>
      )}

      {/* Schedule Cards */}
      {!isLoadingBookings && filteredBookings.length > 0
        ? filteredBookings.map((booking) => (
            <Card key={booking.id} className="mb-4">
              <CardContent className="space-y-2 p-4">
                <div className="font-bold">{booking.dentistName}</div>
                <div className="text-sm text-gray-600">
                  {booking.date} {booking.time}
                </div>
                <div className="flex items-center justify-between">
                  <div className="mt-2 flex items-center text-sm">
                    <span className="mr-2">
                      <Calendar
                        size={16}
                        className={
                          viewMode === "Dental schedules"
                            ? "text-gray-500"
                            : "text-blue-500"
                        }
                      />
                    </span>
                    <span>{booking.type}</span>
                  </div>
                  {booking.status === "Cancel" && (
                    <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">
                      Cancelled
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        : !isLoadingBookings && (
            <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-400">
              No{" "}
              {viewMode === "Dental schedules"
                ? "unavailable times"
                : "appointments"}{" "}
              found for selected criteria.
            </div>
          )}
    </div>
  );
}
