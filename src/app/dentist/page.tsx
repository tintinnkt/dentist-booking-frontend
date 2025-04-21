"use client";

import ScheduleManagement from "@/components/ScheduleManament";
import { useRouter } from "next/navigation";

export default function DentistDashboard() {
  const router = useRouter();

  const CommentClick = () => {
    router.push("/dentist/comment");
  };
  const HolidayClick = () => {
    router.push("/dentist/holiday");
  };
  return (
    <main>
      <div className="m-8 flex justify-center text-3xl font-bold">
        Dental Clinic Dentist Dashboard
      </div>

      <div className="container mx-auto mb-6 px-6">
        <button className="mr-2 rounded bg-white px-4 py-1 text-sm font-semibold text-black">
          Schedules
        </button>

        <button
          className="mr-2 rounded bg-orange-400 px-4 py-1 text-sm font-semibold text-black hover:bg-white"
          onClick={CommentClick}
        >
          Comment
        </button>

        <button
          className="rounded bg-orange-400 px-4 py-1 text-sm font-semibold text-black hover:bg-white"
          onClick={HolidayClick}
        >
          Holidays
        </button>
      </div>

      <div className="flex justify-center">
        <ScheduleManagement />
      </div>
    </main>
  );
}
