"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BackendRoutes } from "@/config/apiRoutes";
import { LoaderIcon, XCircleIcon, Calendar } from "lucide-react";
import { format } from "date-fns";

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
const fetchUnavailableBookings = async (dentistId?: string, date?: string): Promise<Array<Booking>> => {
  let url = BackendRoutes.UNAVAILABLE_BOOKING;
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
    error: dentistsError
  } = useQuery({
    queryKey: ["dentists"],
    queryFn: fetchDentists,
  });

  // Fetch bookings data with filters
  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    error: bookingsError,
    refetch: refetchBookings
  } = useQuery({
    queryKey: ["unavailableBookings", selectedDentistId, formattedDate],
    queryFn: () => fetchUnavailableBookings(selectedDentistId, formattedDate),
    enabled: !!selectedDentistId || !!formattedDate, // Only run if there's a selected dentist or date
  });

  // Update selected dentist ID when dentist name changes
  useEffect(() => {
    if (selectedDentist && dentists.length > 0) {
      const dentist = dentists.find(d => d.name === selectedDentist);
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
  const formattedBookings = bookings.map(booking => {
    const bookingDate = new Date(booking.apptDateAndTime);
    return {
      id: booking._id,
      dentistName: booking.dentist.name,
      date: format(bookingDate, "yyyy-MM-dd"),
      time: format(bookingDate, "HH:mm - ") + format(new Date(bookingDate.getTime() + 60 * 60 * 1000), "HH:mm"), // Assuming 1 hour appointments
      status: booking.status,
      type: viewMode === "Dental schedules" ? "Unavailable Time" : "Booked Appointment"
    };
  });

  // Filter bookings based on the view mode
  const filteredBookings = viewMode === "Dental schedules"
    ? formattedBookings // Unavailable times are fetched by the API
    : formattedBookings.filter(booking => booking.status === "Booked" || booking.status === "Cancel");

  if (dentistsError || bookingsError) {
    const error = dentistsError || bookingsError;
    return (
      <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
        <p className="text-red-500 flex items-center gap-2">
          <XCircleIcon size={18} /> Error: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
      <div className="font-bold text-lg mb-2">Schedule Management</div>
      <div className="text-gray-400 mb-4 text-sm">
        View and manage dentist schedules and unavailable time slots
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Select Dentist</label>
          {isLoadingDentists ? (
            <div className="w-[200px] h-10 flex items-center justify-center bg-gray-100 rounded">
              <LoaderIcon className="animate-spin" size={16} />
            </div>
          ) : (
            <Select value={selectedDentist} onValueChange={setSelectedDentist}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Dentist" />
              </SelectTrigger>
              <SelectContent>
                {dentists.map(dentist => (
                  <SelectItem key={dentist._id || dentist.id} value={dentist.name}>
                    {dentist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Select Date</label>
          <DatePickerWithPresets value={selectedDate} onChange={setSelectedDate} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">View mode</label>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dental schedules">Unavailable Times</SelectItem>
              <SelectItem value="Appointments">Booked Appointments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <button
            className="bg-orange-400 hover:bg-orange-300 text-black text-sm font-semibold px-4 py-2 rounded transition-colors"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="font-semibold text-base mb-4">
        {viewMode === "Dental schedules" ? "Unavailable Times" : "Appointments"} for {selectedDentist || "all dentists"} {formattedDate ? `on ${formattedDate}` : ""}
      </div>

      {/* Loading State */}
      {isLoadingBookings && (
        <div className="flex items-center justify-center p-6">
          <LoaderIcon className="animate-spin mr-2" size={20} />
          <span>Loading schedule data...</span>
        </div>
      )}

      {/* Schedule Cards */}
      {!isLoadingBookings && filteredBookings.length > 0 ? (
        filteredBookings.map((booking) => (
          <Card key={booking.id} className="mb-4">
            <CardContent className="p-4 space-y-2">
              <div className="font-bold">{booking.dentistName}</div>
              <div className="text-sm text-gray-600">{booking.date} {booking.time}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm mt-2">
                  <span className="mr-2">
                    <Calendar size={16} className={viewMode === "Dental schedules" ? "text-gray-500" : "text-blue-500"} />
                  </span>
                  <span>{booking.type}</span>
                </div>
                {booking.status === "Cancel" && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Cancelled
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        !isLoadingBookings && (
          <div className="text-sm text-gray-400 p-4 text-center bg-gray-50 rounded-lg">
            No {viewMode === "Dental schedules" ? "unavailable times" : "appointments"} found for selected criteria.
          </div>
        )
      )}
    </div>
  );
}
