"use client"
import NavBar from "@/components/NavBar";

import ScheduleManagement from "@/components/ScheduleManament";
import CommentDentist from "@/components/CommentDentist"
import { useRouter } from "next/navigation";

export default function CommentDashboard() {
    const router = useRouter();

    const ScheduleClick = () => {
        router.push("/dentist"); 
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
          <button
             className="bg-orange-400 hover:bg-white text-black text-sm font-semibold px-4 py-1 rounded mr-2" 
             onClick={ScheduleClick}>
             Schedules
          </button>
          
          <button
            className="bg-white hover:bg-white text-black text-sm font-semibold px-4 py-1 rounded mr-2">
            Comment
          </button>

          <button
            className="bg-orange-400 hover:bg-white text-black text-sm font-semibold px-4 py-1 rounded" 
            onClick={HolidayClick}>
            Holidays
          </button>
        </div>
        
        <div className="flex justify-center">
          <CommentDentist></CommentDentist>
        </div>
        
      </main>
    );
  }