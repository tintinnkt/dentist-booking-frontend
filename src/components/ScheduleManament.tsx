"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDentistSchedule } from "@/lib/dentist/getDentistSchedule";
import { Booking } from "@/types/api/Dentist";
import { useSession } from "next-auth/react";
import { LoaderIcon } from "lucide-react";

export default function ScheduleManagement() {
  const [selectedDate, setSelectedDate] = useState("");
  const [show, setShow] = useState(false);
  const [schedules, setSchedules] = useState<Booking[]>([]);
  const [message, setMessage] = useState("");
  const { data: session} = useSession();
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!session || !session.user.token) {
      setMessage("กรุณาเข้าสู่ระบบเพื่อดูตารางนัดหมาย");
      setShow(false);
      return;
    }

    setLoading(true);
    
    try {
      const data = await getDentistSchedule(session.user.token);
      console.log("schedule data:", data);
      setSchedules(data);

      if(!data) {
        setMessage("รับข้อมูลไม่ได้");
      }

      if (data.length === 0) {
        setMessage("ไม่พบตารางนัดหมายของทันตแพทย์ในวันที่เลือก");
      } else {
        setMessage("");
        setShow(true);
      }
    } catch (err) {
      setMessage("เกิดข้อผิดพลาดในการดึงข้อมูลตารางนัดหมาย");
      console.error(err);
    } finally {
      setLoading(false);
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
        
          {loading && (
            <div className="flex items-center justify-center gap-3 pt-10">
            <LoaderIcon /> Loading schedules...
          </div>
          )}

          {message && (
            <div className="mt-4 text-red-600 font-semibold">{message}</div>
          )}
          {show && schedules.length > 0 && (
            <div className="mt-4 text-sm text-black font-bold">
              Schedule on {selectedDate || "this day"}
              {schedules
                .sort((a, b) => new Date(a.apptDateAndTime).getTime() - new Date(b.apptDateAndTime).getTime())
                .map((item) => {
                const apptDate = new Date(item.apptDateAndTime);

                if (isNaN(apptDate.getTime())) {
                  console.warn("Invalid date:", item.apptDateAndTime);
                  return null; // หรือจะแสดง error ก็ได้
                }
            
                const bookingDate = apptDate.toISOString().split("T")[0];

                if (bookingDate !== selectedDate && selectedDate !== "") 
                  return null;

                if (!item.dentist) return null;
                return (
                  <div key={item._id} className="mt-4">
                    <h3 className="text-blue-600 text-xl">{item.user.name}</h3>
                    <ul className="list-disc ml-5 text-gray-700">
                      <li>
                        <strong>User ID:</strong> {item.user._id} <br />
                        <strong>Appointment:</strong> {new Date(item.apptDateAndTime).toUTCString()}<br />
                        <strong>Status:</strong> {item.status}
                      </li>
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
