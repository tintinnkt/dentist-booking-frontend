"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDentistSchedule } from "@/lib/dentist/getDentistSchedule";
import { DentistSchedule } from "@/types/api/Dentist";
import { useSession } from "next-auth/react";

export default function ScheduleManagement() {
  const [selectedDate, setSelectedDate] = useState("");
  const [show, setShow] = useState(false);
  const [schedules, setSchedules] = useState<DentistSchedule[]>([]);
  const [message, setMessage] = useState("");
  const { data: session, status } = useSession();

  const handleSearch = async () => {
    if (!session || !session.user.token) {
      setMessage("กรุณาเข้าสู่ระบบเพื่อดูตารางนัดหมาย");
      setShow(false);
      return;
    }
    try {
      const data = await getDentistSchedule(session.user.token);
      setSchedules(data);

      if (data.length === 0) {
        setMessage("ไม่พบตารางนัดหมายของทันตแพทย์ในวันที่เลือก");
      } else {
        setMessage("");
        setShow(true);
      }
    } catch (err) {
      setMessage("เกิดข้อผิดพลาดในการดึงข้อมูลตารางนัดหมาย");
      console.error(err);
    }
  };

  return (
    <div className="w-[800px] h-auto min-h-[500px] rounded-lg shadow-lg bg-white">
      <div className="p-5">
        <div className="text-lg font-bold">Schedule Management</div>
        <div className="text-sm text-gray-500">
          View and manage dentist schedules and appointments
        </div>

        <div className="text-sm font-bold py-3">Select Date</div>
        <div className="flex gap-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold px-4 py-1 rounded"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {message && (
          <div className="mt-4 text-red-600 font-semibold">{message}</div>
        )}

        {show && schedules.length > 0 && (
          <div className="mt-4 text-sm text-black font-bold">
            Schedule on {selectedDate || "this day"}
            {schedules.map((item) => {
              const filteredBookings = item.upcomingBookings.filter((booking) => {
                const bookingDate = new Date(booking.date).toISOString().split("T")[0];
                return bookingDate === selectedDate;
              });

              // ถ้าไม่มี booking ในวันนั้น ไม่ต้องแสดงเลย
              if (filteredBookings.length === 0) return null;

              return (
                <div key={item.dentist.id} className="mt-4">
                  <h3 className="text-blue-600">{item.dentist.user.name}</h3>
                  <ul className="list-disc ml-5 text-gray-700">
                    {filteredBookings.map((booking) => (
                      <li key={booking.id}>
                        <strong>Date:</strong> {new Date(booking.date).toLocaleString()} <br />
                          <strong>Patient:</strong> {booking.patientName} <br />
                          <strong>Contact:</strong> {booking.patientContact} <br />
                          <strong>Email:</strong> {booking.patientEmail} <br />
                          <strong>Status:</strong> {booking.status}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
