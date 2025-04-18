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
        <div className="flex justify-start px-90"><button
            className="bg-orange-400 hover:bg-white text-black text-sm font-semibold px-4 py-1 rounded " onClick={() => {ScheduleClick()}}>
            Schedules
          </button>
          
          <button
            className="bg-white hover:bg-white  text-black text-sm font-semibold px-4 py-1 rounded " >
            comment
          </button>

          <button
            className="bg-orange-400 hover:bg-white  text-black text-sm font-semibold px-4 py-1 rounded " onClick={() => HolidayClick()}>
            Holidays
          </button>
          </div>
        
        <div className="flex justify-center ">
        <CommentDentist></CommentDentist>
        </div>
        
      </main>
    );
  }
  