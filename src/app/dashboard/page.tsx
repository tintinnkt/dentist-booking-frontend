"use client";

import { Input } from "@/components/ui/Input";
import { BackendRoutes, FrontendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { Booking } from "@/types/api/Booking";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function ScheduleManagement() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const { data: session } = useSession();
  const { user } = useUser();

  if (!user || user.role == Role_type.USER)
    redirect(FrontendRoutes.DENTIST_LIST);

  const getDentistSchedule = async () => {
    if (!session?.user?.token) {
      throw new Error("Authentication token not available");
    }

    try {
      const response = await axios.get(BackendRoutes.BOOKING_DENTIST, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });
      return response.data.data as Array<Booking>;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Axios error response:", error.message);
        throw new Error(
          error.response?.data?.message || "Failed to get dentist schedule",
        );
      }
      console.error("Unknown error:", error);
      throw new Error("An unexpected error occurred");
    }
  };

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ["dentistSchedule", session?.user?.token],
    queryFn: getDentistSchedule,
    enabled: !!session?.user?.token,
  });

  const filteredSchedules = schedules.filter((item) => {
    if (!item.apptDateAndTime) return false;
    const apptDate = new Date(item.apptDateAndTime);
    if (isNaN(apptDate.getTime())) return false;

    const bookingDate = apptDate.toISOString().split("T")[0];
    return bookingDate === selectedDate;
  });

  const showSchedules = schedules.length > 0;
  const message = getStatusMessage(isLoading, filteredSchedules, session);

  return (
    <div className="w-full">
      <div className="pb-1 text-lg font-bold">Schedule Management</div>
      <div className="pb-4 text-sm text-gray-500">
        View and manage dentist schedules and appointments
      </div>

      <div className="py-3 text-sm font-bold">Select Date</div>
      <div className="flex gap-x-3">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-fit rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {isLoading && (
        <div className="mt-4 font-semibold text-blue-500">Loading...</div>
      )}

      {message && (
        <div className="mt-4 font-semibold text-red-600">{message}</div>
      )}

      {showSchedules && filteredSchedules.length > 0 && (
        <div className="mt-4 text-sm font-bold text-black">
          Schedule on {selectedDate || "this day"}
          {filteredSchedules.map((item) => {
            if (!item.dentist || !item.user) return null;

            return (
              <div key={item._id} className="mt-4">
                <h3 className="text-xl text-blue-600">{item.user.name}</h3>
                <ul className="ml-5 list-disc text-gray-700">
                  <li>
                    <strong>Appointment:</strong>{" "}
                    {new Date(item.apptDateAndTime).toLocaleString()}
                    <br />
                    <strong>Status:</strong> {item.status}
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper function to determine status message
function getStatusMessage(
  isLoading: boolean,
  filteredSchedules: Array<Booking>,
  session: Session | null,
): string {
  if (!session?.user?.token) {
    return "กรุณาเข้าสู่ระบบเพื่อดูตารางนัดหมาย";
  }

  if (isLoading) {
    return "";
  }

  if (filteredSchedules.length === 0) {
    return "ไม่พบตารางนัดหมายของทันตแพทย์ในวันที่เลือก";
  }

  return "";
}
