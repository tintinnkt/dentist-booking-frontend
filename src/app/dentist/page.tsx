"use client"

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
        
        <div className="text-3xl font-bold flex justify-center m-8">
          Dental Clinic Dentist Dashboard
        </div>
        
        <div className="container mx-auto px-6 mb-6">
          <button className="bg-white text-black text-sm font-semibold px-4 py-1 rounded mr-2">
            Schedules
          </button>

          <button
            className="bg-orange-400 hover:bg-white text-black text-sm font-semibold px-4 py-1 rounded mr-2" 
            onClick={CommentClick}>
            Comment
          </button>

          <button
            className="bg-orange-400 hover:bg-white text-black text-sm font-semibold px-4 py-1 rounded" 
            onClick={HolidayClick}>
            Holidays
          </button>
        </div>

        <div className="flex justify-center">
          <ScheduleManagement />
        </div>
      </main>
    );
  }