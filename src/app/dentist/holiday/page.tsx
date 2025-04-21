"use client";

import OffHoursManagement from "@/components/HolidayManagement";
import { useRouter } from "next/navigation";

export default function HolidayDashboard() {
  const router = useRouter();

  const ScheduleClick = () => {
    router.push("/dentist");
  };

  const CommentClick = () => {
    router.push("/dentist/comment");
  };
  return (
    <main>
      <div className="m-3 flex justify-center text-3xl font-bold">
        Dental Clinic Dentist Dashboard
      </div>
      <div className="container mx-auto mb-6 px-6">
        <button
          className="mr-2 rounded bg-orange-400 px-4 py-1 text-sm font-semibold text-black hover:bg-white"
          onClick={ScheduleClick}
        >
          Schedules
        </button>

        <button
          className="mr-2 rounded bg-orange-400 px-4 py-1 text-sm font-semibold text-black hover:bg-white"
          onClick={CommentClick}
        >
          Comment
        </button>

        <button className="rounded bg-white px-4 py-1 text-sm font-semibold text-black hover:bg-white">
          Holidays
        </button>
      </div>

      <div className="flex justify-center">
        <OffHoursManagement/>
      </div>
    </main>
  );
}
