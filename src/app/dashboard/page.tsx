"use client";

import { FrontendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { getDentistSchedule } from "@/lib/dentist/getDentistSchedule";
import { Booking } from "@/types/api/Booking";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScheduleManagement() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [show, setShow] = useState(true);
  const [schedules, setSchedules] = useState<Array<Booking>>([]);
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  if (!user || user.role == Role_type.USER)
    redirect(FrontendRoutes.DENTIST_LIST);

  useEffect(() => {
    const fetchSchedule = async () => {
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

        if (!data) {
          setMessage("รับข้อมูลไม่ได้");
        } else if (data.length === 0) {
          setMessage("ไม่พบตารางนัดหมายของทันตแพทย์ในวันที่เลือก");
          console.log("AAAAAAAAAAAAA");
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

    fetchSchedule();
  }, []);

  /*
  const handleSearch = async () => {
    if (!session || !session.user.token) {
      setMessage("กรุณาเข้าสู่ระบบเพื่อดูตารางนัดหมาย");
      setShow(false);
      return;
    }


    try {
      const data = await getDentistSchedule(session.user.token);
      console.log("schedule data:", data);
      setSchedules(data);

      if (!data) {
        setMessage("รับข้อมูลไม่ได้");
      }

      if (data.length === 0) {
        setMessage("ไม่พบตารางนัดหมายของทันตแพทย์ในวันที่เลือก");
        console.log("AAAAAAAAAAAAA");
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
  */

  return (
    <div className="h-auto min-h-[500px] w-full rounded-lg bg-white shadow-lg">
      <div className="p-5">
        <div className="text-lg font-bold">Schedule Management</div>
        <div className="text-sm text-gray-500">
          View and manage dentist schedules and appointments
        </div>

        <div className="py-3 text-sm font-bold">Select Date</div>
        <div className="flex gap-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {/* <button
            className="rounded bg-yellow-400 px-4 py-1 text-sm font-semibold text-black hover:bg-yellow-500"
            onClick={handleSearch}
          >
            Search
          </button> */}
        </div>

        {loading && (
          <div className="mt-4 font-semibold text-blue-500">Loading...</div>
        )}

        {message && (
          <div className="mt-4 font-semibold text-red-600">{message}</div>
        )}
        {show && schedules.length > 0 && (
          <div className="mt-4 text-sm font-bold text-black">
            Schedule on {selectedDate || "this day"}
            {schedules.map((item) => {
              const apptDate = new Date(item.apptDateAndTime);

              if (isNaN(apptDate.getTime())) {
                console.warn("Invalid date:", item.apptDateAndTime);
                return null; // หรือจะแสดง error ก็ได้
              }

              const bookingDate = apptDate.toISOString().split("T")[0];
              if (bookingDate !== selectedDate) return null;

              if (!item.dentist) return null;
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
    </div>
  );
}
