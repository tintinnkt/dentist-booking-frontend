"use client"
import NavBar from "@/components/NavBar";

import ScheduleManagement from "@/components/ScheduleManament";
import CommentDentist from "@/components/CommentDentist"
import { useRouter } from "next/navigation";
import HolidayDentist from "@/components/HolidayDentist"

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
        <div className="text-3xl font-bold flex justify-center m-3">
          Dental Clinic Dentist Dashboard
        </div>
        <div className="container mx-auto px-6 mb-6">
          <button
             className="bg-orange-400 hover:bg-white text-black text-sm font-semibold px-4 py-1 rounded mr-2" 
             onClick={ScheduleClick}>
             Schedules
          </button>
          
          <button
            className="bg-orange-400 hover:bg-white text-black text-sm font-semibold px-4 py-1 rounded mr-2" 
            onClick={CommentClick}>
            Comment
          </button>

          <button
            className="bg-white hover:bg-white text-black text-sm font-semibold px-4 py-1 rounded">
            Holidays
          </button>
        </div>
        
        <div className="flex justify-center">
          <HolidayDentist></HolidayDentist>
        </div>
        
      </main>
    );
  }